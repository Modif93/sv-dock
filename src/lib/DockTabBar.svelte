<script lang="ts">
  import { XIcon } from '@lucide/svelte';
  import type { TabData } from './dock-data.js';
  import DragDropDiv from './dragdrop/DragDropDiv.svelte';
  import FlexRender from './FlexRender.svelte';

  type DockTabBarProps = {
    tab: TabData;
    activeTabId: string;
    closeTab: (tab: TabData) => void;
  };
  let { tab, closeTab }: DockTabBarProps = $props();
</script>

<DragDropDiv
  data-state={tab.id && activeTabId === tab.id ? 'active' : ''}
  class="flex items-center gap-1 bg-gray-300 p-1 data-[state=active]:bg-gray-200"
>
  <button onmousedown={(e) => handleTabClick(e, tab)} class="text-nowrap">
    <FlexRender content={tab.title} />
  </button>
  {#if tab.closable}
    <button class="hover:drop-shadow-xs hover:drop-shadow-blue-300" onclick={() => closeTab(tab)}>
      <XIcon class="size-4" />
    </button>
  {/if}
</DragDropDiv>
