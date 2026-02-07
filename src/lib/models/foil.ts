import { FoilType } from "../mtabg/src/lib/types/types.js";

class Foil {
  effect: string;
  foilType: FoilType;

  constructor(foilType: FoilType) {
    this.foilType = foilType;
  }
}

export default Foil