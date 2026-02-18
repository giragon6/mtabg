import type { ScryfallCard } from "@scryfall/api-types"

import type { MtGSet } from "./boosters"

export enum Rarity {
  common = "common",
  uncommon = "uncommon",
  rare = "rare",
  mythic = "mythic",
}
export const sortOrders: Record<string, Record<string, number>> = {
  "rarity": {
    "common": 0,
    "uncommon": 1,
    "rare": 2,
    "mythic": 3
  },
  "mtgcolor": {
    "W": 0,
    "U": 1,
    "B": 2,
    "R": 3,
    "G": 4
  }
}

export enum Frame {
  showcase = "showcase",
  full_art = "full_art",
  borderless = "borderless"
}

export enum FoilType {
  none = "none",
  foil = "foil",
  dragonscale = "dragonscale",
  double_rainbow = "double_rainbow",
  halo = "halo",
  fracture = "fracture"
}

export enum LandType {
  basic = "basic",
  gainland = "gainland"
}

export enum MtGColor {
  W = "W", // white
  U = "U", // blue
  B = "B", // black
  R = "R", // red
  G = "G" //green
}
const colorMap: Record<MtGColor, string> = {
  [MtGColor.W]: "#fffbd5",
  [MtGColor.U]: "#aae0fa",
  [MtGColor.B]: "#cbc2bf",
  [MtGColor.R]: "#f9aa8f",
  [MtGColor.G]: "#9bd3ae"
}
export function colorsToStyle(colors: MtGColor[]): string {
  if (colors.length === 1) {
    return colorMap[colors[0]];
  }
  return "#e9d28f";
}


export enum SortOption {
  name = "name",
  price = "price", 
  rarity = "rarity", 
  set = "set",
  colors = "colors", 
  color_identity = "color_identity", 
  power = "power", 
  toughness = "toughness", 
  mana_cost = "mana_cost", 
  cmc = "cmc"
}

export type Special = { 
  name: string, 
  query: string, 
  ids?: string[]
}

export type PackSlot = {
  amount: number,
  chances: CardChance[]
}

export type CardChance = {
  special?: number,
  rarity?: Rarity,
  frame?: Frame,
  foil?: FoilType,
  land?: LandType,
  include_nonbasic_lands?: boolean,
  chance: number,
}

export type PackData = {
  type: string,
  set: MtGSet,
  slots: PackSlot[],
  special: Special[],
}

export type ScryfallResponse = {
  object: string,
  total_cards: number,
  has_more: boolean,
  next_page?: string,
  data: ScryfallCard.Any[]
}

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