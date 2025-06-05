<script lang="ts">
  import type { LayoutData } from './dock-data.js';
  import DockBox from './DockBox.svelte';
  import FloatBox from '$lib/FloatBox.svelte';

  type DockLayoutProps = {
    defaultLayout?: LayoutData;
    layout: LayoutData;
  };
  let { defaultLayout, layout = $bindable() }: DockLayoutProps = $props();

  let boxData = $state(layout.dockbox);
  let floatData = $state(layout.floatbox);
  let maxBox = $state(layout.maxbox);
</script>

<div class="h-full w-full">
  <DockBox bind:boxData />
  {#if floatData}
    <FloatBox bind:floatData />
  {/if}
</div>
