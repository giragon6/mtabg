import type { MtGSet } from "$lib/types/boosters"
import type { PackData, Special, PackSlot, CardChance } from "$lib/types/meta"
import CardFetcher from "$lib/util/cardFetcher"
import QueryGenerator from "$lib/util/queryGenerator"
import { weightedRandom } from "$lib/util/randUtil"

import Card from "./card"

export class Pack {
  packData: PackData
  cards: Card[] = []
  fetcher: CardFetcher
  queryGenerator: QueryGenerator
  set: MtGSet
  special: Special[]

  constructor(packData: PackData) {
    this.packData = packData;
    this.set = packData.set;
    this.special = packData.special;
    this.fetcher = new CardFetcher();
    this.queryGenerator = new QueryGenerator();

    console.log(`Pack of set ${this.set} created`)
  }

  private evalSlot(slot: PackSlot): CardChance {
    const weights = slot.chances.map(c => c.chance);
    const idx = weightedRandom(weights);
    return slot.chances[idx];
  }

  private chooseRandomCards(cards: any[], num: number): any[] {
    let chosenCards = [];
    for (let i = 0; i < num; i++) {
      chosenCards.push(cards[Math.floor(Math.random() * cards.length)]);
    }
    return chosenCards;
  }

  private async openToJson(): Promise<JSON[]> {
    const ccs = this.packData.slots.flatMap(s => (new Array(s.amount)).fill(s)).map(s => this.evalSlot(s));
    // reuse responses with the same query
    let responseMap: { [query: string]: any[] } = {};
    let cardJsons: any[] = []; 
    for (let cc of ccs) {
      const query = this.queryGenerator.toQuery(cc, this.set, this.special);
      const isIds = Array.isArray(query);
      const key = isIds ? query.join(",") : query;
      let resp;
      if (responseMap[key]) {
        // the query has already been made, so use "cached" results
        resp = responseMap[key];
      } else {
        // the query is new, so ask scryfall
        resp = isIds ? await this.fetcher.fetchCardsById(query) : await this.fetcher.fetchCardsByQuery(query);
        responseMap[key] = resp;
      }
      let chosenCard = this.chooseRandomCards(resp, 1)[0]; // returns only one card
      if (cc.foil) {
        chosenCard["foil"] = cc.foil;
      } else {
        chosenCard["foil"] = 'none';
      }
      cardJsons.push(chosenCard);
    }
    return cardJsons;
  }

  async open(): Promise<Card[]> {
    console.log(`Opening pack of set ${this.set}...`)
    const cardJsons: {[k: string]: any}[] = await this.openToJson();
    this.cards = cardJsons.map(j => Card.fromScryfall(j, j["foil"]));
    console.log('returning cards')
    return this.cards;
  }
}