import { FoilType } from "../types/types.js"
import Foil from "./foil.js"

class Card {
  id: string;
  foil: Foil;
  price: number;
  imageUri: string;

  constructor(id: string, foilType: FoilType, price: number, imageUri: string) {
    this.id = id;
    this.foil = new Foil(foilType);
    this.price = price;
    this.imageUri = imageUri;
  }

  static fromJson(cardJson: {[index: string]: any}, foilType: FoilType): Card {
    const price: number = cardJson["prices"][foilType == FoilType.foil ? "usd_foil" : "usd"];
    const imageUri: string = cardJson["image_uris"]["large"];
    return new Card(cardJson["id"], foilType, price, imageUri);
  }
} 

export default Card;