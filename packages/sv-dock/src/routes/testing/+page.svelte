<script lang="ts">
  import DockLayout from '$lib/DockLayout.svelte';
  import type { LayoutData } from '$lib/dockData.js';

  const baseline: LayoutData = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          id: 'left-panel',
          size: 240,
          tabs: [
            { id: 'drag-a', title: 'Drag A', content: 'Drag me. The ghost should stay centered under the pointer.', closable: true },
            { id: 'drag-b', title: 'Drag B', content: 'Drop on center to merge tabs.', closable: true }
          ]
        },
        {
          mode: 'vertical',
          children: [
            {
              id: 'top-panel',
              size: 320,
              tabs: [{ id: 'drop-target', title: 'Drop target', content: 'Drop left/right/top/bottom to split.', closable: true }]
            },
            {
              id: 'bottom-panel',
              size: 180,
              tabs: [{ id: 'bottom', title: 'Bottom', content: 'Resize the handle above this panel.', closable: true }]
            }
          ]
        }
      ]
    },
    floatbox: {
      mode: 'float',
      children: [
        {
          id: 'float-panel',
          tabs: [{ id: 'float-tab', title: 'Floating', content: 'Drag this floating tab too.', closable: true }],
          box: { x: 620, y: 250, w: 330, h: 220, z: 3 }
        }
      ]
    }
  };

  let layout: LayoutData = $state(structuredClone(baseline));
  let showJson = $state(true);

  const json = $derived(JSON.stringify(layout, null, 2));

  function reset() {
    layout = structuredClone(baseline);
  }
</script>

<svelte:head>
  <title>sv-dock testing</title>
</svelte:head>

<main class="mx-auto grid max-w-7xl gap-4 p-5 xl:grid-cols-[1fr_380px]">
  <section class="flex min-w-0 flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-white">Testing route</h1>
        <p class="text-sm text-slate-400">탭 드래그 위치, split drop, resize, floating panel 동작을 재현합니다.</p>
      </div>
      <div class="flex gap-2">
        <button class="rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-400" onclick={reset}>Reset</button>
        <button class="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20" onclick={() => (showJson = !showJson)}>
          {showJson ? 'Hide JSON' : 'Show JSON'}
        </button>
      </div>
    </div>

    <div class="h-[calc(100vh-12rem)] min-h-[520px] overflow-hidden rounded-xl border border-white/10 bg-white">
      <DockLayout bind:layout />
    </div>
  </section>

  {#if showJson}
    <aside class="min-w-0 rounded-xl border border-white/10 bg-slate-900 p-4">
      <h2 class="mb-3 font-semibold text-white">Live layout data</h2>
      <pre class="max-h-[calc(100vh-10rem)] overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300"><code>{json}</code></pre>
    </aside>
  {/if}
</main>
