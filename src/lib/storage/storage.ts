import type { CardStore } from "$lib/types/types";
import { AsyncFunction } from "$lib/types/objectDefs"
import Card from "$lib/models/card";
import Dexie, { type EntityTable } from "dexie";

const DB_NAME = 'MTabGDatabase';
const DB_VERSION = 1;

export namespace MTabGStorage {
  export const db = new Dexie(DB_NAME) as Dexie & {
    cards: EntityTable<CardStore, 'hash'>;
  };

  export let quotaReached = false;

  db.version(DB_VERSION).stores({
    meta: '',
    cards: 'hash'
  });

  function handleStorageError(err: Error) {
    console.error(`IDB transaction failed! Error: ${err.stack}`);
    
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
      success = false;
    })
    return success
  }

  export async function getCard(hash: string): Promise<Card | undefined> {
    const cardStore = await db.cards.get(hash);
    return cardStore ? Card.fromIDB(cardStore) : undefined;
  }

  export async function getCards(hashes: string[]): Promise<(Card | undefined)[]> {
    const cardStores = await db.cards.bulkGet(hashes);
    return cardStores.map(c => c ? Card.fromIDB(c) : undefined)
  }

  export async function getAllCards(): Promise<Card[]> {
    const cardStores = await db.cards.toArray();
    return cardStores.map(c => Card.fromIDB(c))
  }
}