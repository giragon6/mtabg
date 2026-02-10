import { FoilType } from "$lib/types/types"
import Foil from "./foil.js"

class Card {
  id: string;
  foil: Foil;
  name: string;
  price: number;
  imageUri: string;

  constructor(id: string, foilType: FoilType, name: string, price: number, imageUri: string) {
    this.id = id;
    this.foil = new Foil(foilType);
    this.name = name;
    this.price = price;
    this.imageUri = imageUri;
  }

  static fromJson(cardJson: {[index: string]: any}, foilType: FoilType): Card {
    const price: number = cardJson["prices"][foilType == FoilType.foil ? "usd_foil" : "usd"];
    const cardImageUris = cardJson["image_uris"] ? cardJson["image_uris"] : cardJson["card_faces"][0]
    // TODO: handle double faced cards
    const imageUri: string = cardImageUris["large"];
    const name: string = cardJson["name"]
    return new Card(cardJson["id"], foilType, name, price, imageUri);
  }
} 

export default Card;