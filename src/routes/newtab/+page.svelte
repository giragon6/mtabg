<svelte:head>
	<title>New Tab</title>
</svelte:head>

<script lang='ts'>
    import { MtGSet, BoosterType, getBoosterTypesForSet, toFullName, getBoosterPrice } from '$lib/types/boosters'
    import { capitalismState } from '$lib/capitalism/capitalismMode.svelte'
	import { Money } from '$lib/capitalism/money.svelte';
    import Card from '$lib/models/card'
	import CardContainer from '$lib/components/card/CardContainer.svelte'
    import ValueStatus from '$lib/components/ValueStatus.svelte'
	import { titleCase } from '$lib/util/formatUtil'
    import { Pack } from '$lib/models/pack'
	import { MTabGStorage } from '$lib/storage/storage'
    import type { PackData } from '$lib/types/types'

	import BoosterButton from './components/BoosterButton.svelte'

    let cards: Card[] = $state([]);
    let loading: boolean = $state(false);
    let err: string | null = $state(null);
    let quotaReachedMsg: string | null = $state(null);
    let packVisible: boolean = $state(true);

    let curSet: MtGSet = $state(MtGSet.tdm);
    let boosterType: BoosterType = $state(BoosterType.play);
    let availableSets: MtGSet[] = Object.values(MtGSet);
    let availableBoosterTypes: Set<BoosterType> = $derived(getBoosterTypesForSet(curSet));

    async function openPack() {
        let packData: PackData;
        try {
            const res = await fetch(`booster_data/${curSet}-${boosterType}.json`);
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
            if (!MTabGStorage.quotaReached) {
                console.log('storing cards')
                await MTabGStorage.addCards(cards);
            } else {
                quotaReachedMsg = "IndexedDB quota reached! New cards opened will not be saved. Try deleting some!"
            }
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
        if (capitalismState.capitalismMode) {
            Money.buyPack(getBoosterPrice(curSet, boosterType));
        }
        loading = false;
    }

    function reset() {
        cards = [];
        packVisible = true;
    }
</script>

<h1>Magic: The Gathering Booster Pack Simulator</h1>
<h3>Gamble without going bankrupt!</h3>
<div class="error">{err}</div>
<a href="/collection">
    <button>Go to collection</button>
</a>
<br>
<button onclick={() => capitalismState.capitalismMode = !capitalismState.capitalismMode}>
    {capitalismState.capitalismMode ? "Dis" : "En"}able capitalism mode
</button>
<br>
<div class="selects">
    <select bind:value={curSet}>
        {#each availableSets as s}
            <option value={s}>{toFullName(s)}</option>
        {/each}
    </select>
    <select name="type" bind:value={boosterType}>
        {#each availableBoosterTypes as bt}
            <option value={bt}>{titleCase(bt)}{capitalismState.capitalismMode ? ` ($${getBoosterPrice(curSet, bt)})` : ''}</option>
        {/each}
    </select>
</div>

{#if quotaReachedMsg}
    <div class="quota-reached">{quotaReachedMsg}</div>
{/if}

{#if capitalismState.capitalismMode}
<ValueStatus />
{/if}

{#if packVisible}
    <BoosterButton 
        loading={loading} 
        onclick={openPack}
        set={curSet}
        boosterType={boosterType} />
{:else}
    <button onclick={reset} class="open-another">Open another!</button>
    <CardContainer cards={cards} />
{/if}

<style>
    h1 {
        color: #c93b28;
        -webkit-text-stroke: #e3e3e3 1px;
        font-weight: bold;
        text-align: center;
    }

    h3 {
        color: #e3e3e3;
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
</style>
