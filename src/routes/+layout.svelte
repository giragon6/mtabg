<script lang="ts">
  let { children } = $props();
</script>

<div class="container">
  {@render children()}
  <footer style="text-align: center;">
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

  :global(body) {
    height: 100%;
    background-size: cover;
    background: linear-gradient(#222a68, #574ae2) no-repeat fixed;
  }

  footer {
    text-align: center;
    color: white;
  }

  .container {
    min-height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>