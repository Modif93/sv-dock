<script lang="ts">
  import DockTabs, { type TabData } from '$lib/DockTabs.svelte';
  import { renderComponent, renderSnippet } from '$lib/renderHelper.js';
  import TestComponent from '$lib/TestComponent.svelte';
  import { createRawSnippet } from 'svelte';

  const tabs: Tab[] = [
    {
      id: 'tab1',
      title: () =>
        renderSnippet(
          createRawSnippet(() => ({
            render: () => `<div class="text-right">Tab1</div>`
          })),
          ''
        ),
      content: () =>
        renderComponent(TestComponent, {
          label: 'Tab1 content'
        }),

      closable: true
    },
    { id: 'tab2', title: 'example tab2', content: 'tab2 content' },
    { id: 'tab3', title: 'example tab3', content: 'tab3 content' },
    { id: 'tab4', title: 'example tab4', content: 'tab4 content' },
    { id: 'tab5', title: 'example tab5', content: 'tab5 content' },
    { id: 'tab6', title: 'example tab6', content: 'tab6 content' },
    { id: 'tab7', title: 'example tab7', content: 'tab7 content' },
    { id: 'tab8', title: 'example tab8', content: 'tab8 content' },
    { id: 'tab9', title: 'example tab9', content: 'tab9 content' },
    { id: 'tab10', title: 'example tab10', content: 'tab10 content' }
  ];
</script>

<div class="grid grid-cols-2">
  <DockTabs {tabs} />
</div>
