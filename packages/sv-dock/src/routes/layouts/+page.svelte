<script lang="ts">
  import type { LayoutData } from '$lib/dockData.js';
  import DockLayout from '$lib/DockLayout.svelte';

  const layouts: Record<string, LayoutData> = {
    ide: {
      dockbox: {
        mode: 'horizontal',
        children: [
          {
            size: 220,
            tabs: [{ id: 'files', title: 'Files', content: 'File explorer', closable: true }]
          },
          {
            mode: 'vertical',
            children: [
              {
                size: 520,
                tabs: [{ id: 'code', title: 'Code', content: 'Editor area', closable: true }]
              },
              {
                size: 180,
                tabs: [{ id: 'logs', title: 'Logs', content: 'Build logs', closable: true }]
              }
            ]
          }
        ]
      }
    },
    analytics: {
      dockbox: {
        mode: 'vertical',
        children: [
          {
            size: 280,
            tabs: [{ id: 'chart', title: 'Chart', content: 'Top chart panel', closable: true }]
          },
          {
            mode: 'horizontal',
            children: [
              { tabs: [{ id: 'table', title: 'Table', content: 'Data table', closable: true }] },
              {
                tabs: [
                  { id: 'filters', title: 'Filters', content: 'Filter controls', closable: true }
                ]
              }
            ]
          }
        ]
      }
    }
  };

  let selected = $state<keyof typeof layouts>('ide');
  let layout: LayoutData = $state(structuredClone(layouts.ide));

  function switchLayout(name: keyof typeof layouts) {
    selected = name;
    layout = structuredClone(layouts[name]);
  }
</script>

<svelte:head>
  <title>sv-dock layout presets</title>
</svelte:head>

<main class="mx-auto flex max-w-7xl flex-col gap-4 p-5">
  <section class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 class="text-2xl font-semibold text-white">Layout route</h1>
      <p class="text-sm text-slate-400">라우팅 전환 없이 여러 layout data preset을 확인합니다.</p>
    </div>
    <div class="flex gap-2">
      <button
        class="rounded-md px-3 py-2 text-sm font-medium {selected === 'ide'
          ? 'bg-sky-500 text-white'
          : 'bg-white/10 text-slate-200'}"
        onclick={() => switchLayout('ide')}>IDE</button
      >
      <button
        class="rounded-md px-3 py-2 text-sm font-medium {selected === 'analytics'
          ? 'bg-sky-500 text-white'
          : 'bg-white/10 text-slate-200'}"
        onclick={() => switchLayout('analytics')}>Analytics</button
      >
    </div>
  </section>

  <section class="h-[calc(100vh-11rem)] overflow-hidden rounded-xl border border-white/10 bg-white">
    <DockLayout bind:layout />
  </section>
</main>
