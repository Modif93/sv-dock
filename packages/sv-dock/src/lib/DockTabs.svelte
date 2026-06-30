<script lang="ts" module>
  import type { TabData as DockTabData } from './dockData.js';
  import type { PanelDropEvent } from './dragdrop/gesture-manager';

  export type TabData = DockTabData;
  export type DockTabProps = {
    panelId?: string;
    tabs: TabData[];
    onTabEmpty?: () => void;
    onTabDrop?: (e: PanelDropEvent) => void;
    isParentFloating?: boolean;
    onPanelDragStart?: (event: MouseEvent) => void;
  };
</script>

<script lang="ts">
  import { X } from '@lucide/svelte';
  import FlexRender from './FlexRender.svelte';
  import DragDropDiv from './dragdrop/DragDropDiv.svelte';
  import { nanoid } from 'nanoid';
  import { Tabs } from 'bits-ui';

  let {
    panelId = $bindable(),
    tabs = $bindable([]),
    onTabEmpty = () => {},
    onTabDrop = () => {},
    isParentFloating = false,
    onPanelDragStart
  }: DockTabProps = $props();

  let activeTabId = $state(tabs[0]?.id ?? '');
  let tabbarDiv: HTMLDivElement | undefined = $state();

  function ensureActiveTab() {
    if (tabs.length === 0) {
      activeTabId = '';
      return;
    }

    if (!tabs.some((tab) => tab.id === activeTabId)) {
      activeTabId = tabs[0].id;
    }
  }

  function handleScroll(e: WheelEvent) {
    tabbarDiv?.scrollTo({ left: tabbarDiv.scrollLeft + e.deltaY });
  }

  function handlePanelDragHandleMouseDown(e: MouseEvent) {
    const target = e.target as HTMLElement | null;

    if (
      target?.closest('[data-sv-dock-tab-trigger]') ||
      target?.closest('[data-sv-dock-tab-close]') ||
      target?.closest('[data-sv-dock-tab-draggable]')
    ) {
      return;
    }

    onPanelDragStart?.(e);
  }

  function closeTab(tab: TabData) {
    tabs = tabs.filter((t) => t.id !== tab.id);
    ensureActiveTab();

    if (tabs.length === 0) {
      onTabEmpty();
    }
  }

  function handleMiddleClick(e: MouseEvent, tab: TabData) {
    if (e.button === 1 && tab.closable) {
      e.preventDefault();
      closeTab(tab);
    }
  }

  $effect(() => {
    if (!panelId) {
      panelId = nanoid();
    }
  });

  $effect(() => {
    ensureActiveTab();
  });
</script>

<Tabs.Root bind:value={activeTabId} class="flex h-full min-h-0 min-w-0 flex-col">
  <div class="flex h-9 shrink-0 items-center border-b border-slate-200 bg-slate-100">
    <div
      bind:this={tabbarDiv}
      onwheel={handleScroll}
      onmousedown={handlePanelDragHandleMouseDown}
      role="presentation"
      class="scrollbar-hide h-full min-w-0 flex-1 overflow-x-auto"
    >
      <Tabs.List class="flex h-full min-w-full" aria-label="Dock tabs">
        {#each tabs as tab (tab.id)}
          <DragDropDiv
            tabId={tab.id}
            {panelId}
            {onTabDrop}
            {isParentFloating}
            data-sv-dock-tab-draggable
            data-state={activeTabId === tab.id ? 'active' : 'inactive'}
            class="group flex h-full shrink-0 items-center border-r border-slate-200 data-[state=active]:bg-white"
          >
            <Tabs.Trigger
              value={tab.id}
              data-sv-dock-tab-trigger
              onmousedown={(e) => handleMiddleClick(e, tab)}
              class="flex h-full items-center px-3 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-sky-400 data-[state=active]:font-medium data-[state=active]:text-slate-950"
            >
              <FlexRender content={tab.title} />
            </Tabs.Trigger>
            {#if tab.closable}
              <button
                type="button"
                data-sv-dock-tab-close
                class="mr-2 rounded p-0.5 text-slate-500 opacity-70 group-data-[state=active]:opacity-100 hover:bg-slate-200 hover:text-slate-900"
                aria-label="Close tab"
                onclick={() => closeTab(tab)}
              >
                <X class="size-3.5" />
              </button>
            {/if}
          </DragDropDiv>
        {/each}
      </Tabs.List>
    </div>
  </div>

  <div class="min-h-0 flex-1 overflow-auto bg-white">
    {#each tabs as tab (tab.id)}
      <Tabs.Content value={tab.id} class="h-full p-3 outline-none">
        <FlexRender content={tab.content} />
      </Tabs.Content>
    {/each}
  </div>
</Tabs.Root>
