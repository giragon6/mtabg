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
</script>

<div class="container" class:laser-open={loading} style={`--mask-image=url(/booster_pack_bitmasks/${set}-play-bitmask.png)`}>
  <HoverTilt tiltFactor={1.1} scaleFactor={1} glareMask={`url(/booster_pack_bitmasks/${set}-${boosterType}-bitmask.png)`} glareMaskMode="luminance">
    <button class:loading={loading} disabled={loading} onclick={onclick} title="Open pack">
      <img class="pack" src={images[`/src/lib/assets/booster_pack_images/${set}-${boosterType}.png`]} alt="Booster pack" width=342>
    </button>
  </HoverTilt>
</div>

<style>
  .container {
    margin: 5%;
    position: relative;
    height: fit-content;
    width: fit-content;
  }

  .laser-open {
    overflow: hidden;
  }

  .laser-open::before {
    border-radius: 50%;
    z-index: 100;
    box-shadow: 0 0 4px 4px #ff0000;
    animation: laser-slide 1s linear 1;
    content: "";
    position: absolute;
    left: 50%;
    top: -147%;
    width: 6px;
    height: 1%;
    transform: translateX(-50%);
   background: #ffffff;
    opacity: 0.95;
  }

  .laser-open::after {
    z-index: 99;
    animation: laser-slide-trail 1s linear 1;
    content: "";
    position: absolute;
    left: 50%;
    top: -147%;
    width: 6px;
    height: 50%;
    transform: translateX(-50%);
    background: linear-gradient(360deg, #ffffff, transparent);
    opacity: 0.95;    
  }

  @keyframes laser-slide-trail {
    0%    { top: -50%; opacity: 1; }
    100%  { top: 40%; opacity: 1; }
  }

  @keyframes laser-slide {
    0%    { top: 0%; opacity: 1; }
    100%  { top: 90%; opacity: 1; }
  }

  button {
    background: transparent;
    border: none;
    width: fit-content;
  }

  .loading::before {
    content: "";
    position: absolute;
    top: 0%;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    z-index: 100;
    background-color: white;
    mask-image: radial-gradient(closest-side at 46%, white, white, transparent);
    animation: fade-in-out 1.2s linear infinite;
  }

  @keyframes fade-in-out {
    0%    { opacity: 0.2; }
    25%   { opacity: 0.4; }
    50%   { opacity: 0.6; }
    75%   { opacity: 0.4; }
    100%  { opacity: 0.2; }
  }
</style>