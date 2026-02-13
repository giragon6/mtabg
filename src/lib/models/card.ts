import { FoilType, type CardStore } from "$lib/types/types"
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
  static fromScryfall(cardJson: {[index: string]: any}, foilType: FoilType): Card {
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

  static fromIDB(cardJson: {[index: string]: any}): Card {
    return new Card(cardJson.id, 
                    cardJson.foil, 
                    cardJson.name, 
                    cardJson.price, 
                    cardJson.imageUri, 
                    cardJson.flipImageUri);
  }

  static hash(card: Card | {[index: string]: any}): string {
    return card.id + '_' + card.foil;
  }

  static idFoilFromHash(hash: string): {id: string, foil: string} {
    const components = hash.split('_');
    return {id: components[0], foil: components[1]}
  }

  toIDB(): CardStore {
    return {
      hash: Card.hash(this),
      name: this.name,
      price: this.price,
      imageUri: this.imageUri,
      flipImageUri: this.flipImageUri,
      quantity: 0 // db will auto increment to 1 when adding the card
    }
  }

} 

export default Card;