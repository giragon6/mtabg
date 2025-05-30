class Pack {
    id: number;
    template: string;
    cards: any[];
    created_at: string;
    updated_at: string;

    constructor(id, type, cardParamsList) {
        this.id = id || null;
        this.template = type || null;
        this.cards = [];
        this.created_at = new Date().toISOString();
        this.updated_at = new Date().toISOString();
    }


    /**
     * Fetches cards from Scryfall based on card parameters and saves to pack.
     */
    async populateCards() {

    }
}