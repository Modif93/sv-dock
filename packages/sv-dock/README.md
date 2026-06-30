# sv-dock

Dockable layout components for Svelte 5. `sv-dock` provides draggable tabs, split dock panels, floating panels, and a serializable layout data model that can be stored and restored by your app.

## Install

```bash
pnpm add @modif93/sv-dock
```

`@modif93/sv-dock` has a Svelte 5 peer dependency.

## Styles

The components use Tailwind CSS utility classes. In a Tailwind CSS v4 app, include the package in your stylesheet source scan and enable the scrollbar helper plugin:

```css
@import 'tailwindcss';
@source '../node_modules/@modif93/sv-dock/dist';
@plugin 'tailwind-scrollbar-hide';
```

Adjust the `@source` path if your app stylesheet is nested deeper in your project.

## Basic Usage

```svelte
<script lang="ts">
  import { DockLayout, type LayoutData } from '@modif93/sv-dock';

  let layout: LayoutData = $state({
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          tabs: [
            {
              id: 'explorer',
              title: 'Explorer',
              content: 'Project files',
              closable: true
            }
          ]
        },
        {
          tabs: [
            {
              id: 'editor',
              title: 'Editor',
              content: 'Main editor',
              closable: true
            }
          ]
        }
      ]
    }
  });
</script>

<div class="h-screen">
  <DockLayout bind:layout />
</div>
```

`DockLayout` fills the size of its parent container, so give the parent an explicit height.

## Rendering Components and Snippets

Tab titles and content can be strings, numbers, Svelte components, Svelte snippets, or functions that return renderable content.

```svelte
<script lang="ts">
  import { DockLayout, renderComponent, renderSnippet, type LayoutData } from '@modif93/sv-dock';
  import DetailsPane from './DetailsPane.svelte';

  let layout: LayoutData = $state({
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          tabs: [
            {
              id: 'details',
              title: 'Details',
              content: renderComponent(DetailsPane, { itemId: 'item-1' })
            },
            {
              id: 'summary',
              title: 'Summary',
              content: renderSnippet(summary, { count: 3 })
            }
          ]
        }
      ]
    }
  });
</script>

{#snippet summary(params: { count: number })}
  <strong>{params.count} selected</strong>
{/snippet}

<DockLayout bind:layout />
```

## Layout Data

```ts
type LayoutData = {
  dockbox: BoxData;
  floatbox?: FloatBoxData;
  maxbox?: Record<string, never>;
};

type TabData = {
  id: string;
  title: Renderable;
  content: Renderable;
  closable?: boolean;
};
```

Use `bind:layout` when you want to persist user changes. Use `defaultLayout` when you only need an initial layout:

```svelte
<DockLayout {defaultLayout} class="rounded border" />
```

## Development

```bash
pnpm install
pnpm --filter @modif93/sv-dock dev
```

## Release Checklist

```bash
pnpm --filter @modif93/sv-dock check
pnpm --filter @modif93/sv-dock lint
pnpm --filter @modif93/sv-dock test
pnpm --filter @modif93/sv-dock build
pnpm --filter @modif93/sv-dock exec npm pack --dry-run
```

Before publishing, confirm the package version, license, changelog or release notes, and generated tarball contents.
