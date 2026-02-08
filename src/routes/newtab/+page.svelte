<svelte:head>
	<title>New Tab</title>
</svelte:head>

<script lang='ts'>
    import { Pack } from '$lib/models/pack';
    import Card from '$lib/models/card'
    import CardDisplay from './components/CardDisplay.svelte';

    let cards: Card[];
    let loading: boolean = false;
    let err: string | null = null;

    async function openPack() {
    cards = [];
    err = null;
    loading = true;
    let pack;
    try {
        const res = await fetch('./booster_data/tdm-play.json');
        if (!res) throw new Error("Response was null!")
        const packData = await res.json();
        if (!packData) throw new Error("Pack data was undefined!")
        pack = new Pack(packData);
        console.log(pack);
        cards = await pack.open();
        console.log("got cards!")
        console.log(cards);
    } catch(e) {
        if (typeof e === "string") {
            err = e;
        } else if (e instanceof Error) {
            err = e.message
        } else {
            err = String(e);
        }
        console.log(`Error opening pack: ${err}`)
    }
        loading = false;
    }
</script>

<div class="container">
    <div class="error">{err}</div>
    <button class="open-pack" disabled={loading} onclick={openPack}>Open Pack</button>
    <div class="cards-container">
            <!-- {#each cards as c}
                <CardDisplay imageUri={c.imageUri} name={c.name} />
            {/each} -->
        <CardDisplay imageUri="https://cards.scryfall.io/large/front/0/3/031afea3-fbfb-4663-a8cc-9b7eb7b16020.jpg?1743204949" name="Dragonfire Blade" />
        <CardDisplay imageUri="https://cards.scryfall.io/large/front/0/3/031afea3-fbfb-4663-a8cc-9b7eb7b16020.jpg?1743204949" name="Dragonfire Blade" />
        <CardDisplay imageUri="https://cards.scryfall.io/large/front/0/3/031afea3-fbfb-4663-a8cc-9b7eb7b16020.jpg?1743204949" name="Dragonfire Blade" />
        <CardDisplay imageUri="https://cards.scryfall.io/large/front/0/3/031afea3-fbfb-4663-a8cc-9b7eb7b16020.jpg?1743204949" name="Dragonfire Blade" />
        <CardDisplay imageUri="https://cards.scryfall.io/large/front/0/3/031afea3-fbfb-4663-a8cc-9b7eb7b16020.jpg?1743204949" name="Dragonfire Blade" />
        <CardDisplay imageUri="https://cards.scryfall.io/large/front/0/3/031afea3-fbfb-4663-a8cc-9b7eb7b16020.jpg?1743204949" name="Dragonfire Blade" />
        <CardDisplay imageUri="https://cards.scryfall.io/large/front/0/3/031afea3-fbfb-4663-a8cc-9b7eb7b16020.jpg?1743204949" name="Dragonfire Blade" />
        <CardDisplay imageUri="https://cards.scryfall.io/large/front/0/3/031afea3-fbfb-4663-a8cc-9b7eb7b16020.jpg?1743204949" name="Dragonfire Blade" />
        <CardDisplay imageUri="https://cards.scryfall.io/large/front/0/3/031afea3-fbfb-4663-a8cc-9b7eb7b16020.jpg?1743204949" name="Dragonfire Blade" />            
    </div>
</div>

<style>
    :global(html, body) {
        height: 100%;
        width: 100%;
        margin: 0;
    }

    .container {
        min-height: 100%;
        background: linear-gradient(#5d00b4, #0064b7);
    }

    .cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin: 5%;
    }
</style>
