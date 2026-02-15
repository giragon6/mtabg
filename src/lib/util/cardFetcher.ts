import type { ScryfallResponse } from "$lib/types/types";
import type { ScryfallCard } from "@scryfall/api-types";

class CardFetcher {
  readonly url = "https://api.scryfall.com/cards/"
  readonly headers = new Headers({
    "content-type": "application/json",
    "Accept"      : "*/*",
    "User-Agent"  : "MTabG/1.0"
  })
  readonly FETCH_LIMIT = 100; //prevent infinite loop but jankily
  readonly FETCH_DELAY = 50; //ms
  
  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchCardsById(identifiers: string[]): Promise<ScryfallCard.Any[]> {
    let cardsJson: ScryfallCard.Any[] = []
    const body = {
      identifiers: identifiers.map(id => ({id}))
    }
    const collectionUrl = this.url + "collection"
    console.log(`POSTing to ${collectionUrl} with body:`)
    console.log(JSON.stringify(body)) 
    try {
      const data: ScryfallResponse = await this.fetchFromUrl(collectionUrl, "POST", body);
      if (!data || !data.data) throw new Error('Response had unexpected structure');
      console.log(data.data);
      cardsJson = data.data;
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
    if (!cardsJson || cardsJson.length == 0) {
      console.error('Error fetching data: no cards retrieved');
    }
    return cardsJson;
  }

  private async fetchFromUrl(url: string, method: "GET" | "POST", body?: {[k: string]: any}): Promise<ScryfallResponse> {
    await this.sleep(this.FETCH_DELAY);
    console.log(JSON.stringify(body))
    return fetch(url, {
      headers: this.headers,
      method: method,
      body: body ? JSON.stringify(body) : null
    })
    .then(response => {
      if (!response.ok) throw new Error('URL response wasn\'t ok');
      return response.json();
    })
    .then(data => {
      return data;
    })
  }

  async fetchCardsByQuery(query: string): Promise<ScryfallCard.Any[]> {
    let currentUrl = this.url + "search?q=" + query;
    console.log(currentUrl)
    let hasMore = true;
    let cardsJson: ScryfallCard.Any[] = []
    console.log(`GETting from ${currentUrl}`)
    let counter = 0;
    while (hasMore && counter < this.FETCH_LIMIT) {
      counter++;
      try {
        const data: ScryfallResponse = await this.fetchFromUrl(currentUrl, "GET");
        if (!data || !data.data) throw new Error('Response had unexpected structure');
        console.log('Got some data');
        console.log(data.data);
        hasMore = data.has_more;
        if (hasMore && data.next_page) currentUrl = data.next_page;
        cardsJson.push(...data.data);
        console.log('pushed cards');
      } catch (error) {
        console.error('Error fetching data: ', error);
        hasMore = false;
      }
    }
    console.log(cardsJson);
    if (!cardsJson || cardsJson.length == 0) {
      console.error('Error fetching data: no cards retrieved');
    } 
    return cardsJson;
  }
}

export default CardFetcher