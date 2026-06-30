<script lang="ts">
  import DockTabs, { type TabData } from '$lib/DockTabs.svelte';
  import { renderComponent, renderSnippet } from '$lib/renderHelper.js';
  import TestComponent from '$lib/TestComponent.svelte';
  import { createRawSnippet } from 'svelte';
  import { nanoid } from 'nanoid';

  let panelId = $state('tabs-route-panel');
  let tabs: TabData[] = $state([
    {
      id: 'tab1',
      title: () =>
        renderSnippet(
          createRawSnippet(() => ({
            render: () => `<span class="font-semibold text-sky-700">Snippet tab</span>`
          })),
          ''
        ),
      content: () =>
        renderComponent(TestComponent, {
          label: 'Component-rendered tab content'
        }),
      closable: true
    },
    { id: 'tab2', title: 'Plain text', content: 'Plain string content', closable: true },
    {
      id: 'tab3',
      title: 'Long title example',
      content: 'Scroll the tab bar with a mouse wheel.',
      closable: true
    }
  ]);

  function addTab() {
    const id = nanoid();
    tabs.push({
      id,
      title: `Tab ${tabs.length + 1}`,
      content: `Dynamic tab ${id}`,
      closable: true
    });
  }
</script>

<svelte:head>
  <title>sv-dock tabs</title>
</svelte:head>

<main class="mx-auto flex max-w-5xl flex-col gap-4 p-5">
  <section class="flex items-center justify-between gap-3">
    <div>
      <h1 class="text-2xl font-semibold text-white">Tabs route</h1>
      <p class="text-sm text-slate-400">bits-ui 기반 DockTabs 단독 테스트 페이지입니다.</p>
    </div>
    <button
      class="rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-400"
      onclick={addTab}>Add tab</button
    >
  </section>

  <section class="h-96 overflow-hidden rounded-xl border border-white/10 bg-white text-slate-950">
    <DockTabs bind:panelId bind:tabs />
  </section>
</main>
