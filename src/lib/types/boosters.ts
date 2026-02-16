export enum MtGSet {
  tdm = "tdm",
  ecl = "ecl"
}

export enum BoosterType {
  play = "play",
  collector = "collector"
}

const boosterAvailabilityMap: Record<MtGSet, Set<BoosterType>> = {
  [MtGSet.tdm]: new Set([BoosterType.play, BoosterType.collector]),
  [MtGSet.ecl]: new Set([BoosterType.play, BoosterType.collector])
}

const setFullnameMap: Record<MtGSet, String> = {
  [MtGSet.tdm]: "Tarkir: Dragonstorm",
  [MtGSet.ecl]: "Lorwyn Eclipsed"
}

export const toFullName = (set: MtGSet) => {
  return setFullnameMap[set]
}

export const getBoosterTypesForSet = (set: MtGSet) => {
  return boosterAvailabilityMap[set]
}