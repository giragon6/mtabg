import { FoilType } from "$lib/types/types"
import Foil from "./foil.js"

class Card {
  id: string;
  foil: Foil;
  name: string;
  price: number;
  imageUri: string;
  flipImageUri: string | undefined;

  constructor(id: string, 
              foilType: FoilType, 
              name: string, 
              price: number, 
              imageUri: string, 
              flipImageUri?: string | undefined) {
    this.id = id;
    this.foil = new Foil(foilType);
    this.name = name;
    this.price = price;
    this.imageUri = imageUri;
    this.flipImageUri = flipImageUri;
  }

  // TODO: find a way to use Scryfall API types without typescript sliming me out
  static fromJson(cardJson: {[index: string]: any}, foilType: FoilType): Card {
    const price: number = cardJson["prices"][foilType == FoilType.foil ? "usd_foil" : "usd"];
    let imageUri: string;
    let flipImageUri: string | undefined = undefined;
    if (cardJson["image_uris"]) {
      // card is single faced
      imageUri = cardJson["image_uris"]["large"];
    } else {
      // card is double faced
      imageUri = cardJson["card_faces"][0]["image_uris"]["large"]
      flipImageUri = cardJson["card_faces"][1]["image_uris"]["large"]
    }
    const name: string = cardJson["name"]
    return new Card(cardJson["id"], foilType, name, price, imageUri, flipImageUri);
  }
} 

export default Card;