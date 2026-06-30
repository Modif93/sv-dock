<script lang="ts">
  import { DockLayout, type LayoutData } from '@modif93/sv-dock';

  const starter = `pnpm add @modif93/sv-dock bits-ui`;
  const usage = `<script lang="ts">
  import { DockLayout, type LayoutData } from '@modif93/sv-dock';

  let layout: LayoutData = $state({
    dockbox: {
      mode: 'horizontal',
      children: [
        { tabs: [{ id: 'explorer', title: 'Explorer', content: 'File tree' }] },
        {
          mode: 'vertical',
          children: [
            { tabs: [{ id: 'editor', title: 'Editor', content: 'Editor surface' }] },
            { tabs: [{ id: 'terminal', title: 'Terminal', content: 'Shell output' }] }
          ]
        }
      ]
    }
  });
<\/script>

<DockLayout bind:layout />`;

  let layout: LayoutData = $state({
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          size: 260,
          tabs: [
            {
              id: 'explorer',
              title: 'Explorer',
              content: 'src/routes, src/lib, package.json',
              closable: true
            }
          ]
        },
        {
          mode: 'vertical',
          children: [
            {
              size: 420,
              tabs: [
                {
                  id: 'editor',
                  title: 'Editor.svelte',
                  content: 'Drag this tab to a drop target or resize split handles.',
                  closable: true
                },
                {
                  id: 'preview',
                  title: 'Preview',
                  content: 'Tabs are powered by bits-ui for accessible keyboard behavior.',
                  closable: true
                }
              ]
            },
            {
              size: 180,
              tabs: [
                {
                  id: 'terminal',
                  title: 'Terminal',
                  content: 'Panel layout is implemented with an internal paneforge-inspired flex splitter.',
                  closable: true
                }
              ]
            }
          ]
        }
      ]
    },
    floatbox: {
      mode: 'float',
      children: [
        {
          id: 'floating-help',
          tabs: [
            {
              id: 'help',
              title: 'Help',
              content: 'Floating panels can be moved and resized.',
              closable: true
            }
          ],
          box: { x: 700, y: 310, w: 320, h: 210, z: 2 }
        }
      ]
    }
  });
</script>

<svelte:head>
  <title>sv-dock — Svelte docking layout</title>
  <meta
    name="description"
    content="Svelte docking layout library inspired by rc-dock, using bits-ui tabs and paneforge-style panel resizing."
  />
</svelte:head>

<main class="min-h-screen bg-slate-950 text-white">
  <section class="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14">
    <div class="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
      <div class="space-y-6">
        <p class="w-fit rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-sm text-sky-200">
          Svelte 5 docking layout library
        </p>
        <div class="space-y-4">
          <h1 class="text-5xl font-semibold tracking-tight text-white md:text-7xl">sv-dock</h1>
          <p class="max-w-2xl text-lg leading-8 text-slate-300">
            rc-dock과 유사한 JSON 기반 docking layout을 Svelte 5로 제공합니다. 탭은 bits-ui를 사용하고,
            panel split/resize는 paneforge 구조를 참고한 내부 flex splitter로 동작합니다.
          </p>
        </div>
        <div class="flex flex-wrap gap-3 text-sm text-slate-200">
          <span class="rounded-full bg-white/10 px-3 py-1">nested panels</span>
          <span class="rounded-full bg-white/10 px-3 py-1">draggable tabs</span>
          <span class="rounded-full bg-white/10 px-3 py-1">floating panels</span>
          <span class="rounded-full bg-white/10 px-3 py-1">Cloudflare-ready docs</span>
        </div>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-sky-950/40">
        <h2 class="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-sky-200">Install</h2>
        <pre class="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100"><code>{starter}</code></pre>
        <p class="mt-3 text-sm text-slate-400">
          `bits-ui`는 탭 primitive 런타임 의존성입니다. Tailwind 없이도 동작하지만 기본 스타일은 utility class로 제공됩니다.
        </p>
      </div>
    </div>

    <section class="rounded-3xl border border-white/10 bg-white p-2 text-slate-950 shadow-2xl">
      <div class="h-155 overflow-hidden rounded-2xl border border-slate-200">
        <DockLayout bind:layout />
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <article class="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 class="text-2xl font-semibold">Usage</h2>
        <pre class="mt-4 max-h-130 overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100"><code>{usage}</code></pre>
      </article>

      <article class="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
        <h2 class="text-2xl font-semibold text-white">API shape</h2>
        <dl class="mt-5 space-y-4">
          <div>
            <dt class="font-mono text-sky-200">DockLayout</dt>
            <dd>`layout` 또는 `bind:layout`을 받아 dockbox/floatbox 상태를 렌더링합니다.</dd>
          </div>
          <div>
            <dt class="font-mono text-sky-200">LayoutData.dockbox</dt>
            <dd>`horizontal`/`vertical` 중첩 box와 tab panel 배열로 전체 split 구조를 선언합니다.</dd>
          </div>
          <div>
            <dt class="font-mono text-sky-200">TabData</dt>
            <dd>`id`, `title`, `content`, `closable`을 가지며 문자열, 컴포넌트, snippet 렌더 헬퍼를 지원합니다.</dd>
          </div>
          <div>
            <dt class="font-mono text-sky-200">renderComponent / renderSnippet</dt>
            <dd>Svelte 컴포넌트나 snippet을 탭 title/content로 전달할 때 사용하는 helper입니다.</dd>
          </div>
        </dl>
      </article>
    </section>
  </section>
</main>
