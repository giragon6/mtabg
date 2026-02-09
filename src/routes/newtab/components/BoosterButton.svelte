<script lang="ts">
  import { HoverTilt } from 'hover-tilt';
  import img from '$lib/assets/booster_pack_images/tdm.png';

  export let onclick: any;
  export let loading: boolean;
</script>

<HoverTilt tiltFactor={1.1} scaleFactor={1} glareMask="url(/booster_pack_bitmasks/tdm-smaller-bitmask.png)" glareMaskMode="luminance">
  <button class:loading={loading} disabled={loading} onclick={onclick} title="Open pack">
    <img class="pack" src={img} alt="Booster pack" width=342>
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