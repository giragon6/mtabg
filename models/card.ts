import { FoilType } from "../types/types"
import Foil from "./foil"

class Card {
  id: string;
  foil: Foil;
  price: number;

  constructor(id: string, foilType: FoilType, price: number) {
    this.id = id;
    this.foil = new Foil(foilType);
    this.price = price;
  }

  static fromJson(cardJson: {[index: string]: any}, foilType: FoilType): Card {
    const price = cardJson["prices"][foilType == FoilType.foil ? "usd_foil" : "usd"];
    return new Card(cardJson["id"], foilType, price);
  }
}

export default Card;