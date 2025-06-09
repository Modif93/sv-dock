<script lang="ts">
  import type { FloatBoxData, HandlePosition, TabData } from '$lib/dockData.js';
  import FloatPanel from '$lib/FloatPanel.svelte';
  import type { PanelDropEvent } from './dragdrop/gesture-manager';

  type FloatBoxProps = {
    floatData: FloatBoxData;
    onPanelEmpty: (id: string) => void;
    onTabDrop?: (e: PanelDropEvent) => void;
  };
  let { floatData = $bindable(), onPanelEmpty, onTabDrop }: FloatBoxProps = $props();
  let activePanel = $state(0);
</script>

{#each floatData.children as child, i}
  <FloatPanel
    bind:id={child.id}
    bind:tabs={child.tabs}
    {activePanel}
    bind:box={child.box}
    onTabEmpty={() => onPanelEmpty(child.id)}
    {onTabDrop}
  />
{/each}
