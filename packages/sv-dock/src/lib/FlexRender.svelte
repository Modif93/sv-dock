<script lang="ts">
  import { RenderComponentConfig, RenderSnippetConfig } from './renderHelper.js';
  import type { Renderable } from './dockData.js';

  type FlexRenderProps = {
    content: Renderable;
    context?: unknown;
  };

  let { content, context }: FlexRenderProps = $props();
</script>

{#if typeof content === 'string' || typeof content === 'number'}
  {content}
{:else if content instanceof RenderComponentConfig}
  {@const { component: Component, props } = content}
  <Component {...props} />
{:else if content instanceof RenderSnippetConfig}
  {@const { snippet, params } = content}
  {@render snippet(params)}
{:else if content instanceof Function}
  {@const result = content(context)}
  {#if result instanceof RenderComponentConfig}
    {@const { component: Component, props } = result}
    <Component {...props} />
  {:else if result instanceof RenderSnippetConfig}
    {@const { snippet, params } = result}
    {@render snippet(params)}
  {:else if typeof result === 'string' || typeof result === 'number'}
    {result}
  {/if}
{/if}
