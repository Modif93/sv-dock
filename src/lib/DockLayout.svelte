<script lang="ts">
  import type { LayoutData } from './dockData.js';
  import DockBox from './DockBox.svelte';
  import FloatBox from '$lib/FloatBox.svelte';
  import type { PanelDropEvent } from './dragdrop/gesture-manager.js';
  import { dropStore } from '$lib/utils';

  type DockLayoutProps = {
    defaultLayout?: LayoutData;
    layout: LayoutData;
  };
  let { defaultLayout, layout = $bindable() }: DockLayoutProps = $props();

  let boxData = $state(layout.dockbox);
  let floatData = $state(layout.floatbox);
  let maxBox = $state(layout.maxbox);
  function onPanelEmpty(id: string) {
    floatData.children = floatData.children.filter((p) => p.id !== id);
    console.log('Floating Panel is empty');
  }
  function onTabDrop(e: PanelDropEvent) {
    if($dropStore.handled) {
      return
    }
    console.log('Tab dropped:', e);
    $dropStore.handled = true
  }
</script>

<div class="h-full w-full border border-amber-600">
  <DockBox bind:boxData {onTabDrop} />
  {#if floatData}
    <FloatBox bind:floatData {onPanelEmpty} {onTabDrop} />
  {/if}
</div>
