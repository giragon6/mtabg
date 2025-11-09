class CardFetcher {
  readonly url = "https://api.scryfall.com/cards/"
  readonly headers = new Headers({
    "Accept"      : "*/*",
    "User-Agent"  : "MTabG/1.0"
  })

  async fetchCardsById(identifiers: string[]): Promise<JSON[]> {
    let cardsJson: JSON[]
    const body = {
      identifiers: identifiers.map(id => ({id}))
    }
    const collectionUrl = this.url + "collection"
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
      cardsJson = data.data
    })
    .catch(error => {
      console.error('Error fetching data: ', error)
    })
    return cardsJson
  }

  async fetchRandomCardsByQuery(query: string, num: number): Promise<JSON[]> {
    let currentUrl = this.url + "search?q=" + query;
    let hasMore = true;
    let cardsJson: JSON[] = []
    while (hasMore) {
      fetch(currentUrl, { 
          headers: this.headers,
          method: "GET",
      })
      .then(response => {
        if (!response.ok) throw new Error('Card response wasn\'t ok');
        return response.json();
      })
      .then(data => {
        if (!data.data || !data.has_more) throw new Error('Response had unexpected structure');
        hasMore = data.has_more;
        cardsJson.push.apply(cardsJson, data.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      })
    }
    let chosenCards: JSON[];
    for (let i = 0; i <= num; i++) {
      chosenCards.push(cardsJson[Math.floor(Math.random() * cardsJson.length)]);
    }
    return chosenCards;
  }
}