import type { MtGSet } from "./boosters"
import type { MtGColor, Rarity } from "./cards"

export type CardStore = {
  hash: string,
  name: string,
  price: number,
  imageUri: string, 
  rarity: Rarity,
  set: MtGSet,
  colors: MtGColor[],
  color_identity: MtGColor[],
  power: number,
  toughness: number,
  mana_cost: string,
  cmc: number,
  flipImageUri: string | undefined,
  quantity: number
}

export type QuotaReport = {
  quota: number | undefined,
  usage: number | undefined
}

export type CapitalismState = {
  capitalismMode: boolean,
  collectionValue: number,
  money: number
}

export interface KeyValuePair<T> { 
  key: string; value: T 
}

export type FlagOption = 
  "capitalismMode" |
  "tableMode"