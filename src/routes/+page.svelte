<script lang="ts">
  import { isPanelData, type LayoutData } from '$lib/dockData.js';
  import DockLayout from '$lib/DockLayout.svelte';
  import DockTabs from '$lib/DockTabs.svelte';
  import type { TabData } from '$lib/dockData.js';
  import { nanoid } from 'nanoid';
  import { renderComponent, renderSnippet } from '$lib/renderHelper.js';
  import TestComponent from '$lib/TestComponent.svelte';
  import { createRawSnippet } from 'svelte';
  import FloatBox from '$lib/FloatBox.svelte';
  import { dropStore } from '$lib/utils';
  let defTab = {
    content: () =>
      renderSnippet(
        createRawSnippet(() => ({
          render: () => `<div>Tab Content</div>`
        })),
        ''
      ),
    closable: true
  };
  const defaultLayout: LayoutData = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          mode: 'vertical',
          size: 200,
          children: [
            { tabs: [{ id: 't1', title: 'Tab 1', ...defTab }] },
            {
              tabs: [
                {
                  ...defTab,
                  id: 't3',
                  title: 'Min Size'
                },
                { ...defTab, id: 't4', title: 'Tab 4' }
              ]
            }
          ]
        },
        {
          size: 1000,
          tabs: [
            {
              id: 't5',
              title: 'basic demo',
              content: () =>
                renderSnippet(
                  createRawSnippet(() => ({
                    render: () =>
                      ` <div>This panel won't be removed from layout even when last Tab is closed</div>`
                  })),
                  ''
                )
            }
          ]
        }
      ]
    },
    floatbox: {
      mode: 'float',
      children: [
        {
          tabs: [
            { id: 't6', title: 'Tab 6', content: 'Tab 6 content', closable: true },
            { id: 't7', title: 'Tab 7', content: 'Tab 7 content', closable: true }
          ],
          box: {
            w: 400,
            h: 400,
            x: 300,
            y: 100
          }
        },
        {
          tabs: [
            { id: 't8', title: 'Tab 8', content: 'Tab 8 content', closable: true },
            { id: 't9', title: 'Tab 9', content: 'Tab 9 content', closable: true }
          ],
          box: {
            w: 400,
            h: 400,
            x: 300,
            y: 100
          }
        }
      ]
    }
  };

  let layout: LayoutData = $state(defaultLayout);

  function addPane() {
    layout.dockbox.children.push({ tabs: [{ id: nanoid(), title: 'new tab', ...defTab }] });
  }
  function addTab() {
    for (const child of layout.dockbox.children) {
      if (isPanelData(child)) {
        child.tabs.push({ id: nanoid(), title: 'new tab', ...defTab });
      }
    }
    layout.dockbox.children;
  }
</script>

<div class="flex flex-col">
  <div class="flex gap-2 p-3">
    <button
      class="rounded border border-gray-600 bg-blue-200 p-2 text-nowrap"
      onclick={() => addPane()}>add Pane</button
    >
    <button
      class="rounded border border-gray-600 bg-blue-200 p-2 text-nowrap"
      onclick={() => addTab()}>add Tab</button
    >
    {$dropStore.tabId ? $dropStore.tabId : 'noTabId'}
    {$dropStore.fromId ? $dropStore.fromId : 'noFromId'}
    {$dropStore.toId ? $dropStore.toId : 'noToId'}
    {$dropStore.direction ? $dropStore.direction : 'noDirection'}
  </div>
  <div class="h-[calc(100vh-10rem)] w-screen">
    <DockLayout bind:layout />
  </div>
</div>
