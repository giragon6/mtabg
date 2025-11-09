import { Pack } from './dist/models/pack.js';

const cardsDiv = document.getElementById("cards");
const openBtn = document.getElementById("open-pack-btn");

async function openPack() {
    const response = await fetch('./booster_data/tdm-play.json');
    const packData = await response.json();
    const pack = new Pack(packData);
    const cards = pack.open();
    cardsDiv.innerHTML = '';
    for (let card of cards) {
        let img = document.createElement("img");
        img.src = card.imageUri;
        cardsDiv.appendChild(img);
    } 
}

openBtn.onclick = openPack;