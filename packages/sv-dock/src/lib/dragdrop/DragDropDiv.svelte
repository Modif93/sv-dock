<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn, dropStore, dragStore } from '../utils.js';
  import type { PanelDropEvent } from './gesture-manager.js';
  import { get } from 'svelte/store';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement;
    half?: boolean;
    vertical?: boolean;
    horizontal?: boolean;
    onTabDrop?: (e: PanelDropEvent) => void;
    isOver?: boolean;
    isParentFloating?: boolean;
    panelId?: string;
    tabId?: string;
  }
  let {
    ref = $bindable(),
    tabId,
    panelId,
    onTabDrop,
    isParentFloating,
    children,
    class: className,
    ...restProps
  }: Props = $props();
  let isDragging = $state(false);
  let isMouseDown = $state(false);
  let dragTimeout: ReturnType<typeof setTimeout> | null = $state(null);
  let floatPos = $state({ x: 0, y: 0 });

  function handleMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
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
        $dropStore.tabId = tabId;
        $dropStore.fromId = panelId;
      }
      dragTimeout = null;
    }, 300);
  }
  function handleMouseUp(e: MouseEvent) {
    isMouseDown = false;
    if (dragTimeout) {
      clearTimeout(dragTimeout);
      dragTimeout = null;
    }

    if (isDragging) {
      floatPos.x = e.clientX;
      floatPos.y = e.clientY;
      dragStore.set({ x: e.clientX, y: e.clientY });
    }

    isDragging = false;

    const dropDir = get(dropStore);
    const dropEvent: PanelDropEvent = {
      direction: dropDir.direction,
      toId: dropDir.toId,
      fromId: dropDir.fromId,
      tabId: dropDir.tabId,
      handled: false
    };

    if (dropEvent.fromId && dropEvent.tabId) {
      onTabDrop?.(dropEvent);
    }

    if ($dropStore.handled) {
      setTimeout(() => {
        dropStore.set({
          direction: undefined,
          handled: false,
          toId: undefined,
          fromId: undefined,
          tabId: undefined
        });
      }, 0);
    }
  }
  function handleDrag(e: MouseEvent) {
    if (isDragging) {
      floatPos.x = e.clientX;
      floatPos.y = e.clientY;
      dragStore.set(floatPos);
    }
  }
</script>

<svelte:window onmousemove={(e) => handleDrag(e)} onmouseup={(e) => handleMouseUp(e)} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={ref}
  class={cn('draggable', className)}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  {...restProps}
>
  {@render children?.()}
</div>
{#if isDragging}
  <div
    class={cn('z-tab pointer-events-none fixed cursor-default opacity-60 shadow-lg', className)}
    style="left: {floatPos.x}px; top: {floatPos.y}px; transform: translate(-50%, -50%);"
  >
    {@render children?.()}
  </div>
{/if}

<style>
  .z-tab {
    z-index: 300;
  }
</style>
