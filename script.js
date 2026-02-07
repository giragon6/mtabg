import { Pack } from './dist/models/pack.js';

const cardsDiv = document.getElementById("cards");
const openBtn = document.getElementById("open-pack-btn");

async function openPack() {
    console.log("Opening a pack!")
    var pack;
    fetch('./booster_data/tdm-play.json')
        .then((response) => response.json())
        .then((packData) => {
            if (!packData) throw new Error("Pack data was undefined!")
            console.log(packData);
            pack = new Pack(packData);
            console.log(pack);
            const cards = pack.open();
            console.log("got cards!")
            console.log(cards);
            cardsDiv.innerHTML = '';
            for (let card of cards) {
                let img = document.createElement("img");
                img.src = card.imageUri;
                console.log(img.src)
                cardsDiv.appendChild(img);
            }
        })
        .catch((err) => console.log(`Error opening pack: ${err}`))
}

openBtn.onclick = openPack;