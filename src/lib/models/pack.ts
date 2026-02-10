import Card from "./card.js"
import QueryGenerator from "$lib/util/queryGenerator.js"
import CardFetcher from "$lib/util/cardFetcher.js"
import { weightedRandom } from "$lib/util/randUtil.js"
import type { PackData, Special, PackSlot, CardChance } from "$lib/types/types"

export class Pack {
  packData: PackData
  cards: Card[] = []
  fetcher: CardFetcher
  queryGenerator: QueryGenerator
  set: string // TODO: Make enum?
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

  private async openToJson(): Promise<JSON[]> {
    // TODO: Consolidate same cards
    const ccs = this.packData.slots.flatMap(s => (new Array(s.amount)).fill(s)).map(s => this.evalSlot(s));
    let cardJsons = [];
    for (let cc of ccs) {
      const query = this.queryGenerator.toQuery(cc, this.set, this.special);
      let resp = Array.isArray(query) ? await this.fetcher.fetchRandomCardsById(query, 1) : await this.fetcher.fetchRandomCardsByQuery(query, 1);
      if (cc.foil) {
        resp[0]["foil"] = cc.foil; //resp will only be one card for now
      } else {
        resp[0]["foil"] = 'none';
      }
      cardJsons.push(...resp);
    }
    return cardJsons;
  }

  async open(): Promise<Card[]> {
    console.log(`Opening pack of set ${this.set}...`)
    const cardJsons: {[k: string]: any}[] = await this.openToJson();
    this.cards = cardJsons.map(j => Card.fromJson(j, j["foil"]));
    console.log('returning cards')
    return this.cards;
  }
}