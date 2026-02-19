import { FoilType } from "$lib/types/cards";

class Foil {
  effect: string = '';
  foilType: FoilType;

  constructor(foilType: FoilType) {
    this.foilType = foilType;
  }

  public toString(): string {
    return this.foilType;
  }
}

export default Foil