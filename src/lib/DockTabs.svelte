<script lang="ts" module>
  import type { TabData } from './dockData.js';
  import type { MouseEventHandler } from 'svelte/elements';
  import type { PanelDropEvent } from './dragdrop/gesture-manager';
  export type DockTabProps = {
    panelId?: string;
    tabs: TabData[];
    onTabEmpty: () => void;
    onTabDrop: (e: PanelDropEvent) => void;
  };
</script>

<script lang="ts">
  import { X } from '@lucide/svelte';
  import FlexRender from './FlexRender.svelte';
  import DragDropDiv from './dragdrop/DragDropDiv.svelte';
  import { nanoid } from 'nanoid';

  let {
    panelId = $bindable(),
    tabs = $bindable([]),
    onTabEmpty,
    onTabDrop
  }: DockTabProps = $props();

  let activeTabId = $state(tabs[0].id);
  let tabbarDiv: HTMLDivElement | undefined = $state();

  function setActive(id: string) {
    activeTabId = id;
  }
  function handleScroll(e: WheelEvent) {
    tabbarDiv?.scrollTo({ left: tabbarDiv?.scrollLeft + e.deltaY });
  }
  function closeTab(tab: TabData) {
    tabs = tabs.filter((t) => t.id !== tab.id);
    if (tabs.length === 0) {
      console.log('tab is Empty!');
      onTabEmpty();
    }
  }
  function handleTabClick(e: MouseEvent, tab: TabData) {
    e.preventDefault();
    if (e.button === 0) {
      activeTabId = tab.id;
    } else if (e.button === 1 && tab.closable) {
      closeTab(tab);
    }
  }
  let activeTabIndex = $derived(
    tabs.findIndex((tab) => tab.id === activeTabId) === -1
      ? 0
      : tabs.findIndex((tab) => tab.id === activeTabId)
  );
  $effect(() => {
    if (!panelId) {
      panelId = nanoid();
    }
  });
</script>

<div class="flex flex-col">
  <div class="grid grid-cols-9 bg-gray-500">
    <DragDropDiv
      bind:ref={tabbarDiv}
      onwheel={(e) => handleScroll(e)}
      class="scrollbar-hide col-span-8 flex h-8 gap-2 overflow-x-scroll border-t bg-gray-300"
    >
      {#each tabs as tab, i}
        <DragDropDiv
          tabId={tab.id}
          {panelId}
          {onTabDrop}
          data-state={activeTabIndex === i ? 'active' : ''}
          class="flex items-center gap-1 bg-gray-300 px-5 py-2 data-[state=active]:bg-gray-200"
        >
          <button onmousedown={(e) => handleTabClick(e, tab)} class="text-nowrap">
            <FlexRender content={tab.title} />
          </button>
          {#if tab.closable}
            <button
              class="hover:drop-shadow-xs hover:drop-shadow-blue-300"
              onclick={() => closeTab(tab)}
            >
              <X class="size-4" />
            </button>
          {/if}
        </DragDropDiv>
      {/each}
    </DragDropDiv>
  </div>

  <div class="flex-grow">
    {#if tabs.length > 0}
      <FlexRender content={tabs[activeTabIndex].content} />
    {/if}
  </div>
</div>
