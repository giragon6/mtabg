<svelte:head>
	<title>New Tab</title>
</svelte:head>

<script lang='ts'>
    import { Pack } from '$lib/models/pack';
    import Card from '$lib/models/card'
	import BoosterButton from './components/BoosterButton.svelte';
	import CardContainer from './components/CardContainer.svelte';

    import type { PackData } from '$lib/types/types';
    import { MtGSet, BoosterType, getBoosterTypesForSet, toFullName } from '$lib/types/boosters'
	import { titleCase } from '$lib/util/formatUtil';

    let cards: Card[] = $state([]);
    let loading: boolean = $state(false);
    let err: string | null = $state(null);
    let packVisible: boolean = $state(true);

    let set: MtGSet = $state(MtGSet.tdm);
    let boosterType: BoosterType = $state(BoosterType.play);
    let availableSets: MtGSet[] = Object.values(MtGSet);

    async function openPack() {
        let packData: PackData;
        try {
            const res = await fetch(`booster_data/${set}-${boosterType}.json`);
            if (!res.ok) throw new Error("Pack data response wasn't ok");
            packData = await res.json();
            if (!packData) throw new Error("Pack data was null")
        } catch(e) {
            throw new Error(`Failed to fetch pack data ${e}`)
        }
        cards = [];
        err = null;
        loading = true;
        let pack = new Pack(packData);
        console.log(pack);
        try {
            cards = await pack.open();
            console.log('storing cards')
            // await MTabGStorage.addCards(cards);
            // console.log(await MTabGStorage.getAllCards())
            await new Promise(r => setTimeout(r, 1000)); //wait for animation to finish (and build suspense?) 
            packVisible = false;
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

    function reset() {
        cards = [];
        packVisible = true;
    }
</script>

<div class="container">
    <h1>Magic: The Gathering Booster Pack Simulator</h1>
    <h3>Gamble without going bankrupt!</h3>
    <div class="error">{err}</div>
    <div class="selects">
        <select name="set" bind:value={set}>
            {#each availableSets as s}
                <option value={s}>{toFullName(s)}</option>
            {/each}
        </select>
        <select name="type" bind:value={boosterType}>
            {#each getBoosterTypesForSet(set) as bt}
                <option value={bt}>{titleCase(bt)}</option>
            {/each}
        </select>
    </div>
    {#if packVisible}
        <BoosterButton 
            loading={loading} 
            onclick={openPack}
            set={set}
            boosterType={boosterType} />
    {:else}
        <button onclick={reset} class="open-another">Open another!</button>
        <CardContainer cards={cards} />
    {/if}
    <footer>
        Magic: The Gathering is the intellectual property of Wizards of the Coast LLC, a subsidiary of Hasbro, Inc. Card API by Scryfall.
    </footer>
</div>

<style>
    :global(html, body) {
        height: 100%;
        width: 100%;
        margin: 0;
        font-family: 'Courier New', Courier, monospace;
    }

    h1 {
        color: #c93b28;
        -webkit-text-stroke: #e3e3e3 1px;
        font-weight: bold;
        text-align: center;
    }

    h3 {
        color: #e3e3e3;
    }

    footer {
        text-align: center;
    }

    select {
        font-size: medium;
    }

    .open-another {
        font-size: medium;
    }

    .selects {
        display: flex;
        flex-direction: row;
        gap: 10%;
    }

    .container {
        min-height: 100%;
        padding: 2%;
        background: linear-gradient(#222a68, #574ae2);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
</style>
