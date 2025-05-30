class Card {
    artist: string;
    collector_number: string;
    foil: boolean;
    frame: string;
    full_art: boolean;
    id: string;
    illustration_id: string;
    image_uris: Record<string, string>;
    layout: string;
    name: string;
    nonfoil: boolean;
    object: string;
    oracle_id: string;
    oracle_text: string;
    prices: Record<string, number>;
    promo: boolean;
    rarity: string;
    released_at: string;
    reprint: boolean;
    reserved: boolean;
    set: string;
    set_id: string;
    set_name: string;
    set_type: string;
    type_line: string;
    variation: boolean;
    created_at: string;
    updated_at: string;

    static deserialize(data) {
        if (!data) {
            return null;
        }
        const card = new Card();
        card.artist = data.artist || "";
        card.collector_number = data.collector_number || "";
        card.foil = data.foil || false;
        card.frame = data.frame || "";
        card.full_art = data.full_art || false;
        card.id = data.id || "";
        card.illustration_id = data.illustration_id || "";
        card.image_uris = data.image_uris || {};
        card.layout = data.layout || "normal";
        card.name = data.name || "";
        card.nonfoil = data.nonfoil || true;
        card.object = data.object || "card";
        card.oracle_id = data.oracle_id || "";
        card.oracle_text = data.oracle_text || "";
        card.prices = data.prices || {};
        card.promo = data.promo || false;
        card.rarity = data.rarity || "";
        card.released_at = data.released_at || "";
        card.reprint = data.reprint || false;
        card.reserved = data.reserved || false;
        card.set = data.set || "";
        card.set_id = data.set_id || "";
        card.set_name = data.set_name || "";
        card.set_type = data.set_type || "";
        card.type_line = data.type_line || "";
        card.variation = data.variation || false;

        card.created_at = data.created_at || new Date().toISOString();
        card.updated_at = data.updated_at || new Date().toISOString();

        return card;
    }

    constructor() {
        this.artist = "";
        this.collector_number = "";
        this.foil = false;
        this.frame = "";
        this.full_art = false;
        this.id = "";
        this.illustration_id = "";
        this.image_uris = {};
        this.layout = "normal";
        this.name = "";
        this.nonfoil = true;
        this.object = "card";
        this.oracle_id = "";
        this.oracle_text = "";
        this.prices = {};
        this.promo = false;
        this.rarity = "";
        this.released_at = "";
        this.reprint = false;
        this.reserved = false;
        this.set = "";
        this.set_id = "";
        this.set_name = "";
        this.set_type = "";
        this.type_line = "";
        this.variation = false;

        // Timestamps
        this.created_at = new Date().toISOString();
        this.updated_at = new Date().toISOString();
    }

    displayCardImage(maxWidth = "200px") {
        if (this.image_uris && this.image_uris.normal) {
            const img = document.createElement("img");
            img.src = this.image_uris.normal;
            img.alt = this.name;
            img.style.maxWidth = maxWidth;
            document.body.appendChild(img);
        } else {
            console.error("No image available for this card.");
        }
    }
}