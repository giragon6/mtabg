<svelte:head>
	<title>New Tab</title>
</svelte:head>

<script lang='ts'>
  import { Pack } from '$lib/models/pack';
  import Card from '$lib/models/card'

  var cards: Card[];
  var loading: boolean = false;
  var err: string | null = null;

  async function openPack() {
    err = null;
    loading = true;
    var pack;
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

<div class="error">{err}</div>
<div class="cards-container">
    <ul>
        {#each cards as card (card.id)}
            <img src={card.imageUri} alt="Card">
            <!--TODO: add card name to model and alt-->
        {/each}
    </ul>
</div>
<button class="open-pack" disabled={loading} onclick={openPack}>Open Pack</button>