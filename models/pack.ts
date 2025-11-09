import Card from "./card.js"

class Pack {
  packData: PackData
  cards: Card[]
  fetcher: CardFetcher
  queryGenerator: QueryGenerator
  set: string // TODO: Make enum?
  special: Special[]

  constructor(packData: PackData) {
    this.packData = packData
    this.set = packData.set
    this.special = packData.special
  }

  evalSlot(slot: PackSlot): CardChance {
    const weights = slot.map(c => c.chance)
    const idx = weightedRandom(weights)
    return slot[idx]
  }
}