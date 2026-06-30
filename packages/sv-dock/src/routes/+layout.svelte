<script lang="ts">
  import '../app.css';

  let { children } = $props();

  const links = [
    { href: '/', label: 'Dock demo' },
    { href: '/layouts', label: 'Layouts' },
    { href: '/tabs', label: 'Tabs' },
    { href: '/testing', label: 'Testing' }
  ];
</script>

<div class="min-h-screen bg-slate-950 text-slate-100">
  <header class="border-b border-white/10 bg-slate-900/80 px-5 py-3 backdrop-blur">
    <nav class="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
      <a href="/" class="mr-4 text-lg font-semibold text-white">sv-dock</a>
      {#each links as link}
        <a
          class="rounded-md px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
          href={link.href}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </header>

  {@render children()}
</div>
