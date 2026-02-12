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