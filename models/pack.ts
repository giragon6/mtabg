import Card from "./card.js"
import QueryGenerator from "../util/queryGenerator.js"
import CardFetcher from "../util/cardFetcher.js"
import { weightedRandom } from "../util/randUtil.js"
import { PackData, Special, PackSlot, CardChance } from "../types/types.js"

export class Pack {
  packData: PackData
  cards: Card[]
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
    let cardJsons: JSON[] = [];
    for (let cc of ccs) {
      const query = this.queryGenerator.toQuery(cc, this.set, this.special);
      let resp: {[index: string]: any} = Array.isArray(query) ? await this.fetcher.fetchCardsById(query) : await this.fetcher.fetchRandomCardsByQuery(query, 1);
      if (cc.foil) resp["foil"] = cc.foil;
      cardJsons.push.apply(resp);
    }
    return cardJsons;
  }

  open(): Card[] {
    console.log(`Opening pack of set ${this.set}...`)
    this.openToJson()
      .then((cardJsons: {[index: string]: any}[]) => 
        (cardJsons.map(j => Card.fromJson(j, j["foil"])))
      )
      .then((cards: Card[]) => {
        this.cards = cards
      })
    console.log('returning cards')
    return this.cards;
  }
}