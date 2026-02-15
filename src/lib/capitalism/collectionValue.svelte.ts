import Card from "$lib/models/card";
import { MTabGStorage } from "$lib/storage/storage";
import { FoilType } from "$lib/types/types";
import CardFetcher from "$lib/util/cardFetcher";

export const collectionValueState = $state({value: 0.0});

const fetcher = new CardFetcher();

export async function refreshCardVals(cards: Card[]): Promise<Card[]> { 
  const cardIds = cards.map(c => c.id);
  const newCards = cards;
  let cardsResp;
  try {
    cardsResp = await fetcher.fetchCardsById(cardIds);
  } catch(err: any) {
    console.error("Failed to refresh card prices!")
    return []
  }
  // cards returned in the order they're requested EXCEPT if some can't be found
  // so if none aren't found we can do this in a less horrifically inefficient way!!
  // (this is a bad idea)
  let unupdatedCards = []; // if card can't be found
  if (cardsResp.length === cards.length) {
    for (let i = 0; i < cards.length; i++) {
      const foilStub = cards[i].foil
      const newPrice = cardsResp[i]["prices"][cards[i].foil.foilType == FoilType.foil ? "usd_foil" : "usd"];
      newCards[i].price = Number(newPrice);
    }
  } else {
    for (let i = 0; i < cards.length; i++) {
      let foundNewPrice = false;
      for (let j = 0; j < cardsResp.length; j++) {
        if (cardsResp[j]["id"] === cards[i].id) {
          foundNewPrice = true;
          const newPrice = cardsResp[j]["prices"][cards[i].foil.foilType == FoilType.foil ? "usd_foil" : "usd"];
          newCards[i].price = Number(newPrice);
          cardsResp.splice(j, 1); // remove price for found card so we dont have to iterate over it again
        }
      }
      if (!foundNewPrice) {
        unupdatedCards.push(cards[i]);
      }
    }
  }
  console.log(`Updated ${cards.length - unupdatedCards.length} card prices. Couldn't find ${unupdatedCards.length} card prices.`)
  return newCards;
}

export async function refreshAndSyncCardVals(cards: Card[] | null | undefined): Promise<boolean> {
  if (!cards || cards.length === 0) {
    cards = await MTabGStorage.getAllCards();
  }
  const newCards = await refreshCardVals(cards);
  const success = await MTabGStorage.syncCardPrices(cards);
  return success
}