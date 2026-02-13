import Card from "$lib/models/card";
import { openDB } from "idb";

export namespace MTabGStorage {
  const DB_NAME = 'MTabGDatabase';
  const CARD_STORE_NAME = 'cards';
  const LF_STORE_NAME = 'lastFetched';
  const DB_VERSION = 1;
  let db;

  const openOrCreateDB = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) { initDB }
  });

  function initDB(init: any) {
    db = init.target.result;
    db.onerror = () => {
      console.error('Error loading database')
    }

    const lastFetched = db.createObjectStore(LF_STORE_NAME);

    const cardsTable = db.createObjectStore(CARD_STORE_NAME, { 
      keyPath: 'id', autoIncrement: true 
    });
    cardsTable.createIndex('hash', 'hash', { unique: true });
  }

  export async function getAllCards(): Promise<Card[]> {
    const db = await openOrCreateDB;
    const cardsResp = await db.getAllFromIndex(CARD_STORE_NAME, 'name');
    return cardsResp.flatMap(c => (new Array(c.quantity)).fill(c)).map(c => Card.fromIDB(c));
  }

  export async function addCard(card: Card) {
    await addCards([card]);
  }

  export async function addCards(cards: Card[]) {
    const cardStores = cards.map(c => c.toIDB());
    const db = await openOrCreateDB;
    const cardQuantities: {[key: string]: number} = {}
    const read_tx = db.transaction(CARD_STORE_NAME, 'readonly');
    // first we need to check whether any of the cards are alr in the db
    // if so, we record the current quantity so updated records are accurate
    for (let c of cardStores) {
      const existingCard = await read_tx.store.get(c.hash);
      if (existingCard !== undefined) {
        c.quantity = existingCard.quantity + 1;
      }
    }
    await read_tx.done;
    // then we update the cards that alr exist
    const write_tx = db.transaction(CARD_STORE_NAME, 'readwrite');
    for (let c of cardStores) {
      write_tx.store.put(c);
    }
    await write_tx.done;
  }
}