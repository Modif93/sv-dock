<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../utils.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    half?: boolean;
    vertical?: boolean;
    horizontal?: boolean;
    ondrop?: () => void;
    isOver?: boolean;
  }
  let { children, half, vertical, horizontal, ondrop, isOver = $bindable(false) }: Props = $props();

  function handleMouseOver(e: MouseEvent | FocusEvent) {
    isOver = true;
  }
  function onmouseleave(e: MouseEvent | FocusEvent) {
    isOver = false;
  }
  function onmouseup(e: MouseEvent) {
    if (isOver) {
      isOver = false;
      ondrop?.();
    }
  }
</script>

<div
  class={cn(
    'flex items-center justify-center border border-gray-300 bg-gray-700 hover:bg-blue-800 hover:text-gray-200',
    half && vertical ? 'h-5' : 'h-10',
    half && horizontal ? 'w-5' : 'w-10'
  )}
  role="presentation"
  onmouseover={handleMouseOver}
  onfocus={handleMouseOver}
  {onmouseleave}
  {onmouseup}
>
  {@render children?.()}
</div>
