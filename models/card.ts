interface CardFace {
    name: string;
    artist: string;
    flavor_text: string;
    oracle_text: string;
    image_uris: Record<string, string>;
}

class Card {
    id: string; // Scryfall ID
    layout: string;

    card_faces: CardFace[]; 
    
    effects: string[]; // e.g., finishes, frames, etc.

    prices: Record<string, string>; 
    
    created_at: string;
    updated_at: string;

    price_updated_at: string;

    static deserialize(data) {
        if (!data) {
            return null;
        }

        const card = new Card();
        card.id = data.id || "";
        card.layout = data.layout || "normal";

        card.card_faces = data.card_faces || [{
            name: data.name || "",
            artist: data.artist || "",
            flavor_text: data.flavor_text || "",
            oracle_text: data.oracle_text || "",
            image_uris: data.image_uris || {}
        }];

        let effects: string[] = [];
        if (data.promo_types) {
            effects.push(...data.promo_types);
        }
        if (data.foil) {
            effects.push("foil");
        }
        if (data.frame_effects.includes("etched")) {
            effects.push("etched");
        }
        card.effects = effects;

        card.prices = data.prices || {};

        card.created_at = new Date().toISOString();
        card.updated_at = new Date().toISOString();

        card.price_updated_at = new Date().toISOString();

        return card;
    }

    constructor() {
        this.id = "";
        this.layout = "normal";

        this.card_faces = [{
            name: "",
            artist: "",
            flavor_text: "",
            oracle_text: "",
            image_uris: {}
        }];

        this.effects = [];
        this.prices = {};

        this.created_at = new Date().toISOString();
        this.updated_at = new Date().toISOString();

        this.price_updated_at = new Date().toISOString();
    }

    getImageURIs(index = 0) {
        if (this.card_faces.length == 1) return this.card_faces[0].image_uris;
        if (index < 0 || index >= this.card_faces.length) {
            console.error("Invalid card face index.");
            return null;
        }
        return this.card_faces[index].image_uris;
    }

    getName(index = 0) {
        if (this.card_faces.length == 1) return this.card_faces[0].name;
        if (index < 0 || index >= this.card_faces.length) {
            console.error("Invalid card face index.");
            return "";
        }
        return this.card_faces[index].name;
    }

    getArtist(index = 0) {
        if (this.card_faces.length == 1) return this.card_faces[0].artist;
        if (index < 0 || index >= this.card_faces.length) {
            console.error("Invalid card face index.");
            return "";
        }
        return this.card_faces[index].artist;
    }

    getFlavorText(index = 0) {
        if (this.card_faces.length == 1) return this.card_faces[0].flavor_text;
        if (index < 0 || index >= this.card_faces.length) {
            console.error("Invalid card face index.");
            return "";
        }
        return this.card_faces[index].flavor_text;
    }

    getOracleText(index = 0) {
        if (this.card_faces.length == 1) return this.card_faces[0].oracle_text;
        if (index < 0 || index >= this.card_faces.length) {
            console.error("Invalid card face index.");
            return "";
        }
        return this.card_faces[index].oracle_text;
    }

    updatePrices(prices: string) {
        if (!this.prices) {
            this.prices = {};
        }
        if (!prices || typeof prices !== "object") {
            console.error("Invalid prices data.");
            return;
        }
        this.prices = prices;
        this.price_updated_at = new Date().toISOString();
    }

    displayCardImage(maxWidth = "200px") {
        let image_uris = this.getImageURIs();
        if (image_uris && image_uris.normal) {
            const img = document.createElement("img");
            img.src = image_uris.normal;
            img.alt = this.getName();
            img.style.maxWidth = maxWidth;
            document.body.appendChild(img);
        } else {
            console.error("No image available for this card.");
        }
    }
}