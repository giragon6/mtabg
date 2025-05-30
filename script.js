const cardName = "Black Lotus"; // Example card name
const apiUrl = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`;

async function fetchCardImage() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const newCard = Card.deserialize(data); 


        displayCardImage(imageUrl);
    } catch (error) {
        console.error("Error fetching card image:", error);
    }
}