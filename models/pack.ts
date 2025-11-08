import Card from "./card.js"

enum Rarity {
  common,
  uncommon,
  rare,
  mythic,
}

enum Frame {
  showcase,
  full_art,
}

type Special = 
  | { name: string, query: string}
  | { name: string, ids: string[] }

type PackSlot = {
  special?: number,
  rarity?: Rarity,
  frame?: Frame,
  chance: number,
}

type PackData = {
  type: string,
  set: string,
  slots: PackSlot[],
  special: Special[],
}

class Pack {
  packData: PackData
  cards: Card[]
  fetcher: CardFetcher
  queryGenerator: SFQueryGenerator

  constructor(packData: PackData) {
    this.packData = packData
  }

  open(): Card[] {
  }
}