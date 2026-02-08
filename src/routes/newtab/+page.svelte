<svelte:head>
	<title>New Tab</title>
</svelte:head>

<script lang='ts'>
    import { Pack } from '$lib/models/pack';
    import Card from '$lib/models/card'
    import CardDisplay from './components/CardDisplay.svelte';
	import BoosterButton from './components/BoosterButton.svelte';

    import type { PackData } from '$lib/types/types';
    import packData from '$lib/booster_data/tdm-play.json';

    let cards: Card[];
    let loading: boolean = false;
    let err: string | null = null;

    async function openPack() {
    cards = [];
    err = null;
    loading = true;
    let pack = new Pack(packData as PackData);
    console.log(pack);
    try {
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
    <BoosterButton loading={loading} onclick={openPack} />
    <div class="cards-container">
        {#each cards as c}
            <CardDisplay imageUri={c.imageUri} name={c.name} isFoil={c.foil.foilType == 'foil'} />
        {/each}
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
        padding: 2%;
        background: linear-gradient(#5d00b4, #0064b7);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin: 5%;
    }
</style>
