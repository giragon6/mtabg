import Dexie, { type EntityTable } from "dexie";

import Card from "$lib/models/card";
import { type CardStore, type FlagOption, type KeyValuePair, type QuotaReport } from "$lib/types/meta";
import { SortOption } from "$lib/types/packs";

const DB_NAME = 'MTabGDatabase';
const DB_VERSION = 3;

export namespace MTabGStorage {
  export const db = new Dexie(DB_NAME) as Dexie & {
    capitalism: EntityTable<KeyValuePair<number>, 'key'>;
    meta: EntityTable<KeyValuePair<any>, 'key'>;
    cards: EntityTable<CardStore, 'hash'>;
  };

  db.version(DB_VERSION).stores({
    capitalism: '&key',
    meta: '&key',
    cards: 'hash,name,price,rarity,set,colors,color_identity,power,toughness,mana_cost,cmc'
  });

  export let quotaReached = false;

  function handleStorageError(err: Error) {
    console.error(`IDB transaction failed! Error: ${err.stack}`);
    if (err instanceof Dexie.QuotaExceededError) {
      quotaReached = true;
    }
  }

  export async function setFlag(flag: FlagOption, enabled: boolean): Promise<void> {
    try {
      await db.meta.put({ value: enabled }, flag);
    } catch(err: any) {
      handleStorageError(err);
    }
  }

  export async function getFlag(flag: FlagOption): Promise<boolean | null> {
    let ret = null;
    try {
      const res = await db.meta.get(flag);
      ret = res?.value;
    } catch(err: any) {
      handleStorageError(err);
    }
    return ret
  }

  // there is almost certainly a better way to do this
  export async function addMoney(amt: number): Promise<boolean> {
    let success = false;
    try {
      const money = await getMoney();
      let moneySet: boolean;
      if (money !== null) {
        moneySet = await setMoney(Number(money) + Number(amt));
      } else {
        moneySet = await setMoney(0);
      }
      success = true;
    } catch(err: any) {
      handleStorageError(err);
    }
    return success;
  }

  export async function subtractMoney(amt: number): Promise<boolean> {
    let success = false;
    try {
      const money = await getMoney();
      let moneySet: boolean;
      if (money !== null) {
        moneySet = await setMoney(Number(money) - Number(amt));
      } else {
        moneySet = await setMoney(0);
      }
      success = true;
    } catch(err: any) {
      handleStorageError(err);
    }
    return success;
  }

  export async function setMoney(amt: number): Promise<boolean> {
    let success = false;
    try {
      db.capitalism.upsert('money', { 'value': Number(amt) });
      success = true;
    } catch(err: any) {
      handleStorageError(err);
    }
    return success;
  }

  export async function getMoney(): Promise<number | null> {
    let ret = null;
    try {
      const money = await db.capitalism.get('money');
      if (money === null || money === undefined) await setMoney(0.0);
      ret = money && money.value !== null ? money.value : null;
    } catch(err: any) {
      handleStorageError(err);
    }
    return ret;
  }

  export async function syncCardPrices(cards: Card[]): Promise<boolean> {
    let success = false;
    const cardChanges = cards.map(c => {return {
      key: Card.hash(c),
      changes: {
        "price": c.price
      }
    }})
    try {
      db.cards.bulkUpdate(cardChanges);
      success = true;
    } catch(err: any) {
      handleStorageError(err);
    }
    return success;
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