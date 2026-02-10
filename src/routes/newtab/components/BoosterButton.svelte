<script module lang='ts'>
  const images: any = import.meta.glob(['$lib/assets/booster_pack_images/**.png'], { eager: true, query: '?url', import: 'default' });
  console.log(images)
</script>

<script lang="ts">
  import { HoverTilt } from 'hover-tilt';
	import type { BoosterType, MtGSet } from '$lib/types/boosters';
  
  export let onclick: any;
  export let loading: boolean;
  export let set: MtGSet;
  export let boosterType: BoosterType;

  const img = images[`/src/lib/assets/booster_pack_images/${set}-${boosterType}.png`];
</script>

<HoverTilt tiltFactor={1.1} scaleFactor={1} glareMask={`url(/booster_pack_bitmasks/${set}-play-bitmask.png)`} glareMaskMode="luminance">
  <button class:loading={loading} disabled={loading} onclick={onclick} title="Open pack">
    <img class="pack" src={images[`/src/lib/assets/booster_pack_images/${set}-${boosterType}.png`]} alt="Booster pack" width=342>
  </button>
</HoverTilt>

<style>
  button {
    background: transparent;
    border: none;
    width: fit-content;
  }

  .loading {
    box-shadow: 0px 0px 40px 20px #c93b28;
  }
</style>