export enum MtGSet {
  tdm = "tdm",
  tdc = "tdc",
  ecl = "ecl",
  ecc = "ecc"
}

export enum BoosterType {
  play = "play",
  collector = "collector"
}

const boosterAvailabilityMap: Partial<Record<MtGSet, Set<BoosterType>>> = {
  [MtGSet.tdm]: new Set([BoosterType.play, BoosterType.collector]),
  [MtGSet.ecl]: new Set([BoosterType.play, BoosterType.collector])
}

export const getBoosterTypesForSet = (set: MtGSet) => {
  return boosterAvailabilityMap[set]
}

const setFullnameMap: Record<MtGSet, String> = {
  [MtGSet.tdm]: "Tarkir: Dragonstorm",
  [MtGSet.tdc]: "Tarkir: Dragonstorm Commander",
  [MtGSet.ecl]: "Lorwyn Eclipsed",
  [MtGSet.ecc]: "Lorwyn Eclipsed Commander"
}

export const toFullName = (set: MtGSet) => {
  return setFullnameMap[set]
}

const boosterPriceMap: Partial<Record<MtGSet, Record<BoosterType, number>>> = {
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
  return boosterPriceMap[set] ? boosterPriceMap[set][boosterType] : 0;
}