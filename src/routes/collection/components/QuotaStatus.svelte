<script lang='ts'>
  export let progress: number; 
</script>

<div class="border">
  {progress ? progress.toFixed(2)+'%' : 'Error displaying progress'}
  <div class="inner" style="width:{progress ? Math.min(progress, 100).toFixed(2)+'%' : '0%'}"></div>
</div>

<style>
  .border {
    width: 75%;
    border: black 4px solid;
    background: white;
    text-align: center;
  }

  .inner {
    background: #c93b28;
  }
</style>