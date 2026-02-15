import type { MtGSet } from "$lib/types/boosters.js";
import { FoilType, MtGColor, Rarity, type CardStore } from "$lib/types/types"
import Foil from "./foil.js"

class Card {
  id: string;
  foil: Foil;
  name: string;
  price: number;
  imageUri: string;
  flipImageUri: string | undefined;
  quantity: number;
  rarity: Rarity;
  set: MtGSet;
  colors: MtGColor[];
  color_identity: MtGColor[];
  power: number;
  toughness: number;
  mana_cost: string;
  cmc: number;

  constructor(id: string, 
              foilType: FoilType, 
              name: string, 
              price: number, 
              imageUri: string, 
              rarity: Rarity,
              set: MtGSet,
              colors: MtGColor[],
              color_identity: MtGColor[],
              power: number,
              toughness: number,
              mana_cost: string,
              cmc: number,
              flipImageUri?: string | undefined,
              quantity: number = 0,
            ) {
    this.id = id;
    this.foil = new Foil(foilType);
    this.name = name;
    this.price = price;
    this.imageUri = imageUri; 
    this.rarity = rarity;
    this.set = set;
    this.colors = colors;
    this.color_identity = color_identity;
    this.power = power;
    this.toughness = toughness;
    this.mana_cost = mana_cost;
    this.cmc = cmc;
    this.flipImageUri = flipImageUri;
    this.quantity = quantity;
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
    
    return new Card(
      cardJson["id"], 
      foilType, 
      cardJson["name"], 
      price, 
      imageUri, 
      cardJson["rarity"],
      cardJson["set"],
      cardJson["colors"],
      cardJson["color_identity"],
      cardJson["power"],
      cardJson["toughness"],
      cardJson["mana_cost"],
      cardJson["cmc"],
      flipImageUri);
  }

  static fromIDB(cardStore: CardStore): Card {
    const idFoil = Card.idFoilFromHash(cardStore.hash)
    return new Card(idFoil.id, 
                    idFoil.foil, 
                    cardStore.name, 
                    cardStore.price, 
                    cardStore.imageUri,
                    cardStore.rarity,
                    cardStore.set,
                    cardStore.colors,
                    cardStore.color_identity,
                    cardStore.power,
                    cardStore.toughness,
                    cardStore.mana_cost,
                    cardStore.cmc, 
                    cardStore.flipImageUri,
                    cardStore.quantity);
  }

  // is this even a hash lmao
  static hash(card: Card | {[index: string]: any}): string {
    return card.id + '_' + card.foil;
  }

  static idFoilFromHash(hash: string): {id: string, foil: FoilType} {
    const components = hash.split('_');
    return {id: components[0], foil: components[1] as FoilType}
  }

  toIDB(): CardStore {
    return {
      hash: Card.hash(this),
      name: this.name,
      price: this.price,
      imageUri: this.imageUri,
      rarity: this.rarity,
      set: this.set,
      colors: this.colors,
      color_identity: this.color_identity,
      power: this.power,
      toughness: this.toughness,
      mana_cost: this.mana_cost,
      cmc: this.cmc,
      flipImageUri: this.flipImageUri,
      quantity: 0 // db will auto increment to 1 when adding the card
    }
  }

} 

export default Card;