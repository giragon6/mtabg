import type { CardChance, Special } from "$lib/types/types"
import { FoilType, LandType } from "$lib/types/types"

class QueryGenerator {
  /**
   * 
   * @param cc 
   * @param set 
   * @param special 
   * @returns A list of ids or a query string
   */
  toQuery(cc: CardChance, set: string, special: Special[]): string[] | string {
    let queryList = ["s:" + set]
    if (cc.special) {
      const sp = special[cc.special]
      if (sp.ids) {
        return sp.ids
      }
      return sp.query
    }
    if (cc.rarity) queryList.push("r:" + cc.rarity);
    if (cc.frame) queryList.push("is:" + cc.frame);
    if (cc.foil && cc.foil == FoilType.foil) queryList.push("is:" + cc.foil);
    if (cc.land) {
      if (cc.land == LandType.basic) {
        queryList.push("t:" + cc.land);
      } else {
        queryList.push(("is:" + cc.land));
      }
    }
    let query = queryList.join('+');
    return query;
  }
}

export default QueryGenerator