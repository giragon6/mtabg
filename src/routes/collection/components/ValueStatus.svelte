<script lang='ts'>
  import CardFetcher from '$lib/util/cardFetcher'

  import { onMount } from 'svelte';

  let { cards = [] } = $props();
  let cardsVal: number = $derived(cards.reduce(
      (acc, cur) => acc + Number(cur.price),
      0
    ));
  const fetcher = new CardFetcher();

  async function refreshCardVals() { 
    const cardIds = cards.map(c => c.id);
    try {
      const cardsResp = await fetcher.fetchCardsById(cardIds);
    } catch(err: any) {
      console.error("Failed to refresh card prices!")
      return
    }
    // cards returned in the order they're requested EXCEPT if some can't be found
    // so if none aren't found we can do this in a less horrifically inefficient way!!
    // (this is a bad idea)
    let unupdatedCards = []; // if card can't be found
    if (cardsResp.length === cards.length) {
      for (let i = 0; i < cards.length; i++) {
        const foilStub = cards[i].foil
        cards[i].price = cardsResp[i]["prices"][cards[i].foil.foilType == FoilType.foil ? "usd_foil" : "usd"];
      }
    } else {
      for (let i = 0; i < cards.length; i++) {
        let foundNewPrice = false;
        for (let j = 0; j < cardsResp.length; j++) {
          if (cardsResp[j]["id"] === cards[i].id) {
            foundNewPrice = true;
            cards[i].price = cardsResp[j]["prices"][cards[i].foil.foilType == FoilType.foil ? "usd_foil" : "usd"];
            cardsResp.splice(j, 1); // remove price for found card so we dont have to iterate over it again
          }
        }
        if (!foundNewPrice) {
          unupdatedCards.push(cards[i]);
        }
      }
    }
    console.log(`Updated ${cards.length - unupdatedCards.length} cards' prices. Couldn't find ${unupdatedCards.length} cards' prices.`)
  }
</script>

<p class="cardsValue">Collection value: ${cardsVal.toFixed(2)}</p>

<style>
  .cardsValue {
    color: white;
  }
</style>