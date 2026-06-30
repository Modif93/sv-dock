<script lang="ts">
  import { isPanelData, type LayoutData, type TabData } from '$lib/dockData.js';
  import DockLayout from '$lib/DockLayout.svelte';
  import { nanoid } from 'nanoid';

  const content = (label: string) =>
    `${label} content — drag tabs, split panels, or resize handles.`;

  const makeTab = (title: string): TabData => ({
    id: nanoid(),
    title,
    content: content(title),
    closable: true
  });

  const defaultLayout: LayoutData = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          mode: 'vertical',
          size: 260,
          children: [
            {
              tabs: [
                { id: 'explorer', title: 'Explorer', content: content('Explorer'), closable: true }
              ]
            },
            {
              tabs: [
                { id: 'outline', title: 'Outline', content: content('Outline'), closable: true }
              ]
            }
          ]
        },
        {
          size: 740,
          tabs: [
            { id: 'editor', title: 'Editor', content: content('Editor'), closable: true },
            { id: 'preview', title: 'Preview', content: content('Preview'), closable: true }
          ]
        }
      ]
    },
    floatbox: {
      mode: 'float',
      children: [
        {
          id: 'floating-terminal',
          tabs: [
            { id: 'terminal', title: 'Terminal', content: content('Terminal'), closable: true }
          ],
          box: { w: 360, h: 220, x: 720, y: 260, z: 2 }
        }
      ]
    }
  };

  let layout: LayoutData = $state(structuredClone(defaultLayout));

  function resetLayout() {
    layout = structuredClone(defaultLayout);
  }

  function addRootPane() {
    layout.dockbox.children.push({ tabs: [makeTab('New pane')] });
  }

  function addTabToFirstRootPanel() {
    for (const child of layout.dockbox.children) {
      if (isPanelData(child)) {
        child.tabs.push(makeTab('New tab'));
        return;
      }
    }
  }
</script>

<svelte:head>
  <title>sv-dock demo</title>
</svelte:head>

<main class="mx-auto flex max-w-7xl flex-col gap-4 p-5">
  <section class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 class="text-2xl font-semibold text-white">Dock layout demo</h1>
      <p
        class="text
-sm text-slate-400"
      >
        rc-dock 스타일 layout data, bits-ui tabs, 내부 splitter를 함께 테스트합니다.
      </p>
    </div>
    <div class="flex gap-2">
      <button
        class="rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-400"
        onclick={addRootPane}>Add pane</button
      >
      <button
        class="rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600"
        onclick={addTabToFirstRootPanel}>Add tab</button
      >
      <button
        class="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
        onclick={resetLayout}>Reset</button
      >
    </div>
  </section>

  <section class="h-[calc(100vh-11rem)] overflow-hidden rounded-xl border border-white/10 bg-white">
    <DockLayout bind:layout />
  </section>
</main>
