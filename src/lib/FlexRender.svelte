<script lang="ts">
  import { RenderComponentConfig, RenderSnippetConfig } from './renderHelper.js';

  type FlexRenderProps = {
    content: string | Function;
    context?: any;
  };
  let { content, context }: FlexRenderProps = $props();
</script>

{#if typeof content === 'string'}
  {content}
{:else if content instanceof Function}
  {@const result = content(context)}
  {#if result instanceof RenderComponentConfig}
    {@const { component: Component, props } = result}
    <Component {...props} />
  {:else if result instanceof RenderSnippetConfig}
    {@const { snippet, params } = result}
    {@render snippet(params)}
  {:else}
    {result}
  {/if}
{/if}
