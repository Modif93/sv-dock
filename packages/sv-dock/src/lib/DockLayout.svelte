<script lang="ts">
  import {
    type BoxData,
    findPanelInDockBox,
    findPanelInFloatBox,
    findParentBox,
    type FloatBoxData,
    isBoxData,
    type LayoutData,
    type PanelData,
    type TabData
  } from './dockData.js';
  import DockBox from './DockBox.svelte';
  import FloatBox from '$lib/FloatBox.svelte';
  import type { PanelDropEvent } from './dragdrop/gesture-manager.js';
  import { dragStore, dropStore } from '$lib/utils';
  import { get } from 'svelte/store';
  import { nanoid } from 'nanoid';

  type DockLayoutProps = {
    defaultLayout?: LayoutData;
    layout?: LayoutData;
    class?: string;
  };

  let { defaultLayout, layout = $bindable(), class: className = '' }: DockLayoutProps = $props();

  let initialized = false;
  let boxData = $state<BoxData>({ mode: 'horizontal', children: [] });
  let floatData = $state<FloatBoxData>({ mode: 'float', children: [] });
  let maxBox = $state({});

  $effect(() => {
    if (!initialized) {
      const source =
        layout ??
        defaultLayout ??
        ({
          dockbox: { mode: 'horizontal', children: [] },
          floatbox: { mode: 'float', children: [] },
          maxbox: {}
        } satisfies LayoutData);

      boxData = source.dockbox;
      floatData = source.floatbox ?? { mode: 'float', children: [] };
      maxBox = source.maxbox ?? {};
      initialized = true;
    }

    layout = {
      dockbox: boxData,
      floatbox: floatData,
      maxbox: maxBox
    };
  });

  function onPanelEmpty(id?: string) {
    if (!id) return;
    floatData.children = floatData.children.filter((panel) => panel.id !== id);
  }

  function findPanelById(panelId: string): PanelData | null {
    return findPanelInDockBox(boxData, panelId) ?? findPanelInFloatBox(floatData, panelId);
  }

  function handleEmptyBox(box: BoxData): boolean {
    for (let i = box.children.length - 1; i >= 0; i--) {
      const child = box.children[i];

      if (isBoxData(child) && handleEmptyBox(child)) {
        box.children.splice(i, 1);
      }
    }

    return box.children.length === 0;
  }

  function handleEmptyPanelInDock(panelId: string): void {
    const result = findParentBox(boxData, panelId);
    if (!result) return;

    result.box.children.splice(result.index, 1);
    handleEmptyBox(boxData);
  }

  function findAndRemoveTab(panelId: string, tabId: string): TabData | null {
    const panel = findPanelById(panelId);
    if (!panel) return null;

    const tabIndex = panel.tabs.findIndex((tab) => tab.id === tabId);
    if (tabIndex === -1) return null;

    const [removedTab] = panel.tabs.splice(tabIndex, 1);

    if (panel.tabs.length === 0) {
      const isFloatingPanel = floatData.children.some((panel) => panel.id === panelId);

      if (isFloatingPanel) {
        onPanelEmpty(panelId);
      } else {
        handleEmptyPanelInDock(panelId);
      }
    }

    return removedTab;
  }

  function createPanel(tab: TabData, size = 1): PanelData {
    return {
      id: nanoid(),
      tabs: [tab],
      size
    };
  }

  function splitRoot(direction: 'top' | 'bottom' | 'west' | 'east', tab: TabData) {
    const currentRoot = boxData;
    const newPanel = createPanel(tab, 1);
    const insertBefore = direction === 'top' || direction === 'west';
    currentRoot.size = 1;

    boxData = {
      mode: direction === 'west' || direction === 'east' ? 'horizontal' : 'vertical',
      children: insertBefore ? [newPanel, currentRoot] : [currentRoot, newPanel]
    };
  }

  function splitPanel(
    targetPanelId: string,
    direction: 'up' | 'down' | 'left' | 'right',
    tab: TabData
  ): boolean {
    const result = findParentBox(boxData, targetPanelId);
    if (!result) return false;

    const target = result.box.children[result.index];
    const newPanel = createPanel(tab);
    const splitDirection: BoxData['mode'] = direction === 'left' || direction === 'right' ? 'horizontal' : 'vertical';
    const insertAfter = direction === 'right' || direction === 'down';

    if (result.box.mode === splitDirection) {
      const baseSize = target.size ?? 1;
      target.size = baseSize / 2;
      newPanel.size = baseSize / 2;
      result.box.children.splice(result.index + (insertAfter ? 1 : 0), 0, newPanel);
      return true;
    }

    const wrapperSize = target.size;
    target.size = 1;
    newPanel.size = 1;

    result.box.children[result.index] = {
      mode: splitDirection,
      size: wrapperSize,
      children: insertAfter ? [target, newPanel] : [newPanel, target]
    };

    return true;
  }

  function onTabDrop(e: PanelDropEvent) {
    if ($dropStore.handled || !e.fromId || !e.tabId) return;

    const tab = findAndRemoveTab(e.fromId, e.tabId);
    if (!tab) return;

    if (e.toId && e.direction === 'center') {
      findPanelById(e.toId)?.tabs.push(tab);
    } else if (
      e.direction === 'top' ||
      e.direction === 'bottom' ||
      e.direction === 'west' ||
      e.direction === 'east'
    ) {
      splitRoot(e.direction, tab);
    } else if (
      e.toId &&
      (e.direction === 'up' || e.direction === 'down' || e.direction === 'left' || e.direction === 'right')
    ) {
      if (!splitPanel(e.toId, e.direction, tab)) {
        splitRoot(
          e.direction === 'left'
            ? 'west'
            : e.direction === 'right'
              ? 'east'
              : e.direction === 'up'
                ? 'top'
                : 'bottom',
          tab
        );
      }
    } else {
      const { x, y } = get(dragStore);
      floatData.children.push({
        id: nanoid(),
        tabs: [tab],
        box: {
          x,
          y,
          w: 360,
          h: 240,
          z: floatData.children.length + 1
        }
      });
    }

    $dropStore.handled = true;
  }
</script>

<div
  class={`sv-dock relative h-full w-full overflow-hidden bg-slate-50 text-slate-950 ${className}`}
>
  <DockBox bind:boxData {onTabDrop} isRoot />
  <FloatBox bind:floatData {onPanelEmpty} {onTabDrop} />
</div>
