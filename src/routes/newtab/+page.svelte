<svelte:head>
	<title>New Tab</title>
</svelte:head>

<script lang='ts'>
    import { Pack } from '$lib/models/pack';
    import Card from '$lib/models/card'
	import BoosterButton from './components/BoosterButton.svelte';

    import type { PackData } from '$lib/types/types';
    import { MtGSet, BoosterType, getBoosterTypesForSet, toFullName } from '$lib/types/boosters'
	import { titleCase } from '$lib/util/formatUtil';
	import CardContainer from './components/CardContainer.svelte';

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
            console.log("got cards!")
            console.log(cards);
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
</script>

<div class="container">
    <div class="error">{err}</div>
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
    {#if packVisible}
        <BoosterButton 
            loading={loading} 
            onclick={openPack} />
    {/if}
    <CardContainer cards={cards} />
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
</style>
