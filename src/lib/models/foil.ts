import { FoilType } from "$lib/types/types";

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