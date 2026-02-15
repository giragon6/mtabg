import type { ScryfallCard } from "@scryfall/api-types"
import type { MtGSet } from "./boosters"

export enum Rarity {
  common = "common",
  uncommon = "uncommon",
  rare = "rare",
  mythic = "mythic",
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
  halo = "halo"
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

export type SortOption = 
  "name" | 
  "price" | 
  "rarity" | 
  "set" | 
  "colors" | 
  "color_identity" | 
  "power" | 
  "toughness" | 
  "mana_cost" | 
  "cmc";