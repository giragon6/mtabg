import type Card from "$lib/models/card";
import type { CardStore } from "$lib/types/types";
import Dexie, { Entity, type EntityTable, type Table } from "dexie";

const DB_NAME = 'MTabGDatabase';
const CARD_STORE_NAME = 'cards';
const LF_STORE_NAME = 'lastFetched';
const DB_VERSION = 1;

export const db = new Dexie(DB_NAME) as Dexie & {
  cards: EntityTable<CardStore, 'hash'>;
};

db.version(1).stores({
  meta: '',
  cards: 'hash'
});

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
    console.error(`IDB transaction failed! Error: ${err.stack}`)
    success = false;
  })
  return success
}