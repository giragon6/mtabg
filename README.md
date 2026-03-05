# MTabG

![MTabG Screenshot](https://github.com/giragon6/mtabg/blob/main/assets/image.png?raw=true)

**If the collection mechanic isn't working, your browser may be automatically blocking local storage! Try opening in an incognito tab to see it working.**

An app that simulates opening booster packs from the trading card game Magic: The Gathering with accurate chances for cards. This app was built with Svelte and uses the Scryfall API to fetch cards. The card tilt effect was achieved with the HoverTilt library.

Supported sets:
- Tarkir: Dragonstorm
- Lorwyn Eclipsed
- Edge of Eternities

Current features:
- Open packs with accurate card chances
- View cards with cool effects
- Not going bankrupt
- Build a collection with accurate card prices
- Going bankrupt with fake money

Planned features:
- Better UI

LET'S GO GAMBLING!!!

## More information

### Why this project was made

I love gambling with the funny cardboard rectangles, but I have no money, so I wanted to simulate gambling to fill the void!!!

### How this project was made

This project was built with the Svelte framework and uses the Scryfall API to fetch Magic cards based on queries. I wanted semi-persistent data, but I didn't want an external server, so I also implemented local storage with IndexedDB.

### What I struggled with and what I learned

I struggled with the Scryfall API syntax at times, but I learned a lot more about fetching and async JavaScript since I don't use a lot of REST APIs generally.
