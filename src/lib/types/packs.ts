import type { ScryfallCard } from "@scryfall/api-types"
import type { FoilType, Frame, LandType, Rarity } from "./cards"
import type { MtGSet } from "./boosters"

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
  full_art?: boolean,
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
