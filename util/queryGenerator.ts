class QueryGenerator {
  toQuery(cc: CardChance, set: string, special: Special[]): string[] | string {
    let query = "s:" + set
    if (cc.special) {
      const sp = special[cc.special]
      if (sp.ids) {
        return sp.ids
      }
      return sp.query
    }
    if (cc.rarity) query += ("r:" + cc.rarity)
    if (cc.frame) query += ("is:" + cc.frame);
    if (cc.foil && cc.foil == FoilType.foil) query += ("is:" + cc.foil);
    if (cc.land) {
      query += cc.land == LandType.basic ? ("t:" + cc.land) : ("is:" + cc.land);
    }
    return query;
  }
}