enum Rarity {
  common = "common",
  uncommon = "uncommon",
  rare = "rare",
  mythic = "mythic",
}

enum Frame {
  showcase = "showcase",
  full_art = "full_art",
}

enum FoilType {
  foil = "foil"
}

enum LandType {
  basic = "basic",
  gainland = "gainland"
}

type Special = { 
  name: string, 
  query: string, 
  ids?: string[]
}

type PackSlot = CardChance[]

type CardChance = {
  special?: number,
  rarity?: Rarity,
  frame?: Frame,
  foil?: FoilType,
  land?: LandType,
  chance: number,
}

type PackData = {
  type: string,
  set: string,
  slots: PackSlot[],
  special: Special[],
}