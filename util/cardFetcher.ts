class CardFetcher {
  readonly url = "https://api.scryfall.com/cards/"
  readonly headers = new Headers({
    "Accept"      : "*/*",
    "User-Agent"  : "MTabG/1.0"
  })
  readonly FETCH_LIMIT = 100; //prevent infinite loop but jankily
  readonly FETCH_DELAY = 10; //ms
  
  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchCardsById(identifiers: string[]): Promise<JSON[]> {
    let cardsJson: JSON[] = []
    const body = {
      identifiers: identifiers.map(id => ({id}))
    }
    const collectionUrl = this.url + "collection"
    console.log(`POSTing to ${collectionUrl} with body ${body}`)
    this.sleep(this.FETCH_DELAY)
    fetch(collectionUrl, { 
          headers: this.headers,
          method: "POST",
          body: JSON.stringify(body)
    })
    .then(response => {
      if (!response.ok) throw new Error('Card response wasn\'t ok');
      return response.json();
    }) 
    .then(data => {
      if (!data.data) throw new Error('Response had unexpected structure')
      console.log(data.data);
      cardsJson = data.data
    })
    .catch(error => {
      console.error('Error fetching data: ', error)
    })
    return cardsJson
  }

  async fetchRandomCardsByQuery(query: string, num: number): Promise<JSON[]> {
    let currentUrl = this.url + "search?q=" + query;
    console.log(currentUrl)
    let hasMore = true;
    let cardsJson: JSON[] = []
    console.log(`GETting from ${currentUrl}`)
    let counter = 0;
    // while (hasMore) {
    this.sleep(this.FETCH_DELAY)
    fetch(currentUrl, { 
        headers: this.headers,
        method: "GET",
    })
    .then(response => {
      if (counter++ >= this.FETCH_LIMIT) throw new Error('Exceeded maximum number of fetches');
      if (!response.ok) throw new Error('Card response wasn\'t ok');
      console.log('Response was ok')
      return response.json();
    })
    .then(data => {
      console.log(data)
      if (!data.data) throw new Error('Response had unexpected structure');
      console.log('Got some data')
      console.log(data.data);
      hasMore = data.has_more;
      cardsJson.push.apply(cardsJson, data.data);
      console.log('pushed cards')
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
      hasMore = false;
    })
    // }
    console.log(cardsJson)
    let chosenCards: JSON[] = [];
    for (let i = 0; i <= num; i++) {
      chosenCards.push(cardsJson[Math.floor(Math.random() * cardsJson.length)]);
    }
    console.log('returning chosencards')
    return chosenCards;
  }
}

export default CardFetcher