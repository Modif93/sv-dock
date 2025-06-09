<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn, dragStore } from '../utils.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    half?: boolean;
    vertical?: boolean;
    horizontal?: boolean;
    isOver?: boolean;
    ref?: HTMLDivElement | null;
  }

  let {
    ref = $bindable(null),
    children,
    half,
    vertical,
    horizontal,
    ondrop,
    isOver = $bindable(false)
  }: Props = $props();

  dragStore.subscribe((value) => {
    if (ref) {
      const rect = ref.getBoundingClientRect();
      isOver =
        rect.top < value.y && value.y < rect.bottom && rect.left < value.x && value.x < rect.right;
    }
  });
</script>

<div
  bind:this={ref}
  class={cn(
    'flex items-center justify-center border border-gray-300',
    half && vertical ? 'h-5' : 'h-10',
    half && horizontal ? 'w-5' : 'w-10',
    isOver ? 'bg-blue-800 text-gray-200' : 'bg-gray-700'
  )}
  role="presentation"
>
  {@render children?.()}
</div>
