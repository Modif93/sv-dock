<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../utils.js';
  import _ from 'lodash';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement;
    half?: boolean;
    vertical?: boolean;
    horizontal?: boolean;
    ondrop?: () => void;
    isOver?: boolean;
  }
  let { ref = $bindable(), children, class: className, ...restProps }: Props = $props();
  let isDragging = $state(false);
  let isMouseDown = $state(false);
  let dragTimeout: ReturnType<typeof setTimeout> | null = $state(null);
  let initialMousePos = $state({ x: 0, y: 0 });
  let floatPos = $state({ x: 0, y: 0 });

  let boxSize: DOMRect = $derived(ref?.getBoundingClientRect());

  const debounceMouseDown = _.throttle(() => {
    isDragging = true;
  }, 600);

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    isMouseDown = true;
    // Clear any existing timeout
    if (dragTimeout) {
      clearTimeout(dragTimeout);
    }

    // Set a timeout for 600ms to determine if this is a drag operation
    dragTimeout = setTimeout(() => {
      if (isMouseDown) {
        isDragging = true;
        floatPos.x = e.clientX;
        floatPos.y = e.clientY;
      }
      dragTimeout = null;
    }, 300);
    // debounceMouseDown();
  }
  function handleMouseUp(e: MouseEvent) {
    isMouseDown = false;
    if (dragTimeout) {
      clearTimeout(dragTimeout);
      dragTimeout = null;
    }

    isDragging = false;
  }
  function handleDrag(e: MouseEvent) {
    if (isDragging) {
      floatPos.x = e.clientX;
      floatPos.y = e.clientY;
    }
  }
</script>

<svelte:window onmousemove={(e) => handleDrag(e)} onmouseup={(e) => handleMouseUp(e)} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={ref}
  class={cn('draggable', className)}
  onmousedown={(e) => handleMouseDown(e)}
  onmouseup={(e) => handleMouseUp(e)}
  {...restProps}
>
  {@render children?.()}
</div>
{#if isDragging}
  <div
    class={cn('absolute cursor-default opacity-35', className)}
    style="left: {floatPos.x}px; top:{floatPos.y}px; transform: translate({-boxSize.width /
      2}px,{-boxSize.height / 2}px)"
  >
    {@render children?.()}
  </div>
{/if}
