<script lang="ts">
  import { HoverTilt } from 'hover-tilt';
  import img from '$lib/assets/booster_pack_images/tdm.png';

  export let onclick: any;
  export let loading: boolean;
</script>

<HoverTilt tiltFactor={1.1} scaleFactor={1} style="width: fit-content;" glareMask="url(/booster_pack_bitmasks/tdm-bitmask.png)" glareMaskMode="luminance">
  <button disabled={loading} onclick={onclick} title="Open pack">
    <img class="pack" src={img} alt="Booster pack" width=456>
  </button>
</HoverTilt>

<style>
button {
  background: transparent;
  border: none;
  width: fit-content;
}
</style>