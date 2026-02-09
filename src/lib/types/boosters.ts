export enum MtGSet {
  tdm = "tdm"
}

export enum BoosterType {
  play = "play",
  collector = "collector"
}

const boosterAvailabilityMap: Record<MtGSet, Set<BoosterType>> = {
  [MtGSet.tdm]: new Set([BoosterType.play])
}

const setFullnameMap: Record<MtGSet, String> = {
  [MtGSet.tdm]: "Tarkir: Dragonstorm"
}

export const toFullName = (set: MtGSet) => {
  return setFullnameMap[set]
}

export const getBoosterTypesForSet = (set: MtGSet) => {
  return boosterAvailabilityMap[set]
}