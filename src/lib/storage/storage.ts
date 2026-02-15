import { SortOption, type CardStore, type QuotaReport } from "$lib/types/types";
import Card from "$lib/models/card";
import Dexie, { type EntityTable } from "dexie";

const DB_NAME = 'MTabGDatabase';
const DB_VERSION = 2;

export namespace MTabGStorage {
  export const db = new Dexie(DB_NAME) as Dexie & {
    cards: EntityTable<CardStore, 'hash'>;
  };

  export let quotaReached = false;

  db.version(DB_VERSION).stores({
    meta: '',
    cards: 'hash,name,price,rarity,set,colors,color_identity,power,toughness,mana_cost,cmc'
  });

  function handleStorageError(err: Error) {
    console.error(`IDB transaction failed! Error: ${err.stack}`);
    if (err instanceof Dexie.QuotaExceededError) {
      quotaReached = true;
    }
  }

  // indexeddb has limited storage
  export async function getEstimatedQuota(): Promise<QuotaReport> {
    let quotaRes = undefined;
    let usageRes = undefined;
    if (navigator.storage && navigator.storage.estimate) {
      const estimation = await navigator.storage.estimate();
      quotaRes = estimation.quota;
      usageRes = estimation.usage;
    } else {
      console.error("StorageManager not found");
    }
    return { quota: quotaRes, usage: usageRes }
  }

  export async function addCard(card: Card): Promise<boolean> {
    return await addCards([card]);
  }

  export async function addCards(cards: Card[]): Promise<boolean> {
    let success = false;
    const cardStores = cards.map(c => c.toIDB());
    db.transaction('rw', db.cards, async () => {
      for (let c of cardStores) {
        // update quantity of existing card or add new card
        const card = (await db.cards.get(c.hash)) || c;
        ++card.quantity; // card quantity initialized to 0 so this works
        await db.cards.put(card);
      }
    }).then(() => {
      console.log(`IDB transaction successful: added ${cardStores.length} cards`);
      success = true;
    }).catch(err => {
      handleStorageError(err);
    })
    return success
  }

  export async function getCard(hash: string): Promise<Card | undefined> {
    let cardStore;
    try {
      cardStore = await db.cards.get(hash);
    } catch(err: any) {
      handleStorageError(err);
    }
    return cardStore ? Card.fromIDB(cardStore) : undefined;
  }
 
  export async function getCards(hashes: string[]): Promise<(Card | undefined)[]> {
    // since function should return array of same size even if error
    let cardStores = new Array(hashes.length).fill(undefined);
    try {
      cardStores = await db.cards.bulkGet(hashes);
    } catch(err: any) {
      handleStorageError(err);
    }
    return cardStores.map(c => c ? Card.fromIDB(c) : undefined)
  }

  export async function getAllCards(sortBy: SortOption = SortOption.colors): Promise<Card[]> {
    let cardStores: CardStore[] = [];
    try {
      cardStores = await db.cards.orderBy(sortBy).toArray();
    } catch(err: any) {
      handleStorageError(err);
    }
    return cardStores.map(c => Card.fromIDB(c))
  }

  export async function removeCard(hash: string): Promise<boolean> {
    let success = false;
    try {
      await db.cards.delete(hash);
      success = true;
    } catch(err: any) {
      handleStorageError(err);
    }
    return success;
  }

  export async function removeCards(hashes: string[]): Promise<boolean> {
    let success = false;
    try {
      await db.cards.bulkDelete(hashes);
      success = true;
    } catch(err: any) {
      handleStorageError(err);
    }
    return success;
  }

  export async function removeAllCards(): Promise<boolean> {
    let success = false;
    try {
      await db.cards.clear();
      success = true;
    } catch(err: any) {
      handleStorageError(err);
    }
    return success;
  }
}