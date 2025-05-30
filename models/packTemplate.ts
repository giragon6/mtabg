interface SlotPossibility {
    rarity: string;
    type?: string;
    foil?: string;
    chance: number;
}

interface Slot {
    possibilities: SlotPossibility[];
}

interface CardParams {
    set: string;
    rarity: string;
    type: string;
    foil: string;
}

class PackTemplate {
    type: string;
    slots: Slot[];
    created_at: string;
    updated_at: string;

    static deserialize(data) {
        if (!data) {
            return null;
        }
        const packTemplate = new PackTemplate(data.type, data.slots);
        
        packTemplate.created_at = data.created_at || new Date().toISOString();
        packTemplate.updated_at = data.updated_at || new Date().toISOString();

        return packTemplate;
    }

    constructor(type, slots) {
        this.type = type || "";
        this.slots = slots || [];

        this.created_at = new Date().toISOString();
        this.updated_at = new Date().toISOString();
    }

    /**
     * Generates and randomizes a new Pack instance based on this template.
     * @param {string} id - The ID for the new pack.
     * @returns {Pack} - A new Pack instance.
     */
    generatePack(id, set) {
        let cards = <CardParams[]>[];

        this.slots.forEach(slot => {
            const totalChance = slot.possibilities.reduce((sum, possibility) => sum + possibility.chance, 0);
            let randomValue = Math.random() * totalChance;

            for (const possibility of slot.possibilities) {
                if (randomValue < possibility.chance) {
                    let type = possibility.type || "normal";
                    let foil = possibility.foil || "nonfoil";

                    let card: CardParams = {set: set, rarity: possibility.rarity, type: type, foil: foil};
                    cards.push(card);
                    break;
                }
                randomValue -= possibility.chance;
            }
        });
        
        const pack = new Pack(id, this.type, cards);
        return pack;
    }
}