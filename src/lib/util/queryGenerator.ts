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
    let queryList = []

    // some slots provide a list of ids rather than a query
    // because the specific cards cant be isolated with queries
    if (cc.special && special[cc.special].ids) {
      return special[cc.special].ids!
    }

    if (cc.rarity) queryList.push("r:" + cc.rarity); 
    if (cc.frame) queryList.push("is:" + cc.frame);
    if (cc.foil && cc.foil == FoilType.foil) queryList.push("is:" + cc.foil);
    if (cc.land) {
      if (cc.land == LandType.basic) {
        queryList.push("t:" + cc.land);
      } else {
        queryList.push("is:" + cc.land);
      }
    }
    // we already checked if the special included id list
    // so it must include query
    if (cc.special) {
      queryList.push(...special[cc.special].query.split('+'))
    } else {
      queryList.push("s:" + set) // special queries already include set
    }
    for (let i = 0; i < queryList.length; i++) {
      queryList[i] = encodeURIComponent(queryList[i]);
    }
    return queryList.join('+');
  }
}

export default QueryGenerator