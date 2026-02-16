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

export const getBoosterTypesForSet = (set: MtGSet) => {
  return boosterAvailabilityMap[set]
}

const setFullnameMap: Record<MtGSet, String> = {
  [MtGSet.tdm]: "Tarkir: Dragonstorm",
  [MtGSet.ecl]: "Lorwyn Eclipsed"
}

export const toFullName = (set: MtGSet) => {
  return setFullnameMap[set]
}

const boosterPriceMap: Record<MtGSet, Record<BoosterType, number>> = {
  [MtGSet.tdm]: {
    [BoosterType.play]: 5.49,
    [BoosterType.collector]: 24.99
  },
  [MtGSet.ecl]: {
    [BoosterType.play]: 5.49,
    [BoosterType.collector]: 26.99
  }
}

export const getBoosterPrice = (set: MtGSet, boosterType: BoosterType) => {
  return boosterPriceMap[set][boosterType]
}