class CardFetcher {
  readonly url = "https://api.scryfall.com/cards/"
  readonly headers = new Headers({
    "Accept"      : "*/*",
    "User-Agent"  : "MTabG/1.0"
  })

  async fetch(identifiers: string[]): Promise<JSON[]> {
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
}