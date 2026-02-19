// TODO: less messy way of handling this
export enum MtGSet {
  tdm = "tdm",
  tdc = "tdc",
  ecl = "ecl",
  ecc = "ecc",
  eoe = "eoe",
  eos = "eos"
}
export type BoosterAvailableSet = MtGSet.tdm | MtGSet.ecl | MtGSet.eoe;
export const allBoosterAvailableSets: BoosterAvailableSet[] = [
  MtGSet.tdm, 
  MtGSet.ecl,
  MtGSet.eoe
];

export enum BoosterType {
  play = "play",
  collector = "collector"
}

const boosterAvailabilityMap: Record<BoosterAvailableSet, Set<BoosterType>> = {
  [MtGSet.tdm]: new Set([BoosterType.play, BoosterType.collector]),
  [MtGSet.ecl]: new Set([BoosterType.play, BoosterType.collector]),
  [MtGSet.eoe]: new Set([BoosterType.play, BoosterType.collector])
}

export const getBoosterTypesForSet = (set: BoosterAvailableSet): Set<BoosterType> => {
  return boosterAvailabilityMap[set]
}

const setFullnameMap: Record<MtGSet, String> = {
  [MtGSet.tdm]: "Tarkir: Dragonstorm",
  [MtGSet.tdc]: "Tarkir: Dragonstorm Commander",
  [MtGSet.ecl]: "Lorwyn Eclipsed",
  [MtGSet.ecc]: "Lorwyn Eclipsed Commander",
  [MtGSet.eoe]: "Edge of Eternities",
  [MtGSet.eos]: "Edge of Eternities: Stellar Sights"
}

export const toFullName = (set: MtGSet) => {
  return setFullnameMap[set]
}

const boosterPriceMap: Record<BoosterAvailableSet, Record<BoosterType, number>> = {
  [MtGSet.tdm]: {
    [BoosterType.play]: 5.49,
    [BoosterType.collector]: 24.99
  },
  [MtGSet.ecl]: {
    [BoosterType.play]: 5.49,
    [BoosterType.collector]: 26.99
  },
  [MtGSet.eoe]: { 
    [BoosterType.play]: 5.49,
    [BoosterType.collector]: 24.99
  }
}

export const getBoosterPrice = (set: BoosterAvailableSet, boosterType: BoosterType) => {
  return boosterPriceMap[set] ? boosterPriceMap[set][boosterType] : 0;
}