<svelte:head>
	<title>New Tab</title>
</svelte:head>

<script lang='ts'>
    import { Pack } from '$lib/models/pack';
    import Card from '$lib/models/card'
    import CardDisplay from './components/CardDisplay.svelte';
	import BoosterButton from './components/BoosterButton.svelte';

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

    let dragStartIndex = $state(-1)
    let dragEnterIndex = $state(-1)
    let dropIndex = $state(-1)

    async function openPack() {
        let packData: PackData;
        try {
            const res = await fetch(`$lib/booster_data/${set}-${boosterType}.json`);
            if (!res) throw new Error("Pack data response was null");
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
    
    function handleDragStart(index: number) {
        dragStartIndex = index;
    }

    function handleDragEnter(index: number) {
        dragEnterIndex = index;
    }

    function handleDragEnd() {
        dragStartIndex = -1;
    }

    function handleDrop() {
        if (dragStartIndex === dropIndex) return;
        const draggedItem = cards[dragStartIndex];
        cards.splice(dragStartIndex, 1);
        cards.splice(dropIndex, 0, draggedItem);
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault()
        //@ts-ignore
        const targRect = e.target.getBoundingClientRect();
        const targLeft = targRect.left;
        const targWidth = targRect.width;
        const xLoc = e.clientX - targLeft;
        if (xLoc < targWidth / 2) {
            dropIndex = dragEnterIndex;
        } else {
            dropIndex = dragEnterIndex + 1;
        }
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
    <div class="cards-container" ondrop={handleDrop} ondragover={handleDragOver} role="region">
        {#each cards as c, i}
            <CardDisplay 
                imageUri={c.imageUri} 
                name={c.name} 
                isFoil={c.foil.foilType == 'foil'}
                index={i} 
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                handleDragEnter={handleDragEnter} />
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
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin: 5%;
    }
</style>
