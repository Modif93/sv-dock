<script lang="ts">
  import type { FloatBoxData } from '$lib/dockData.js';
  import FloatPanel from '$lib/FloatPanel.svelte';
  import type { DropzoneVisibility, PanelDropEvent } from './dragdrop/gesture-manager';

  type FloatBoxProps = {
    floatData: FloatBoxData;
    onPanelEmpty: (id?: string) => void;
    onTabDrop?: (e: PanelDropEvent) => void;
    dropzoneVisibility?: DropzoneVisibility;
  };

  let { floatData = $bindable(), onPanelEmpty, onTabDrop, dropzoneVisibility }: FloatBoxProps = $props();
</script>

{#each floatData.children as child (child.id)}
  <FloatPanel
    bind:id={child.id}
    bind:tabs={child.tabs}
    bind:box={child.box}
    onTabEmpty={() => onPanelEmpty(child.id)}
    {onTabDrop}
    {dropzoneVisibility}
  />
{/each}
