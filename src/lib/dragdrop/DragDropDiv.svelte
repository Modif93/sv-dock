<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn, dropStore, dragStore } from '../utils.js';
  import _ from 'lodash';
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
  let clickOffsetX = $state(0);
  let clickOffsetY = $state(0);
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
        $dropStore.tabId = tabId;
        $dropStore.fromId = panelId;
      }
      dragTimeout = null;
    }, 300);

    // Calculate the offset from the cursor to the element's top-left corner
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    if (isParentFloating) {
      clickOffsetX = rect.left;
      clickOffsetY = rect.top;
    } else {
      clickOffsetX = 0;
      clickOffsetY = 0;
    }

    // debounceMouseDown();
  }
  function handleMouseUp(e: MouseEvent) {
    isMouseDown = false;
    if (dragTimeout) {
      clearTimeout(dragTimeout);
      dragTimeout = null;
    }

    isDragging = false;

    const dropDir = get(dropStore);
    const dropEvent = {
      direction: dropDir.direction,
      toId: dropDir.toId,
      fromId: dropDir.fromId,
      tabId: dropDir.tabId,
      handled: false // Initialize as not handled
    };

    onTabDrop?.(dropEvent);

    if($dropStore.handled){
      setTimeout(() => {
        dropStore.set({direction: undefined, handled: false,toId: undefined, fromId: undefined, tabId: undefined});
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
  onmousedown={(e) => handleMouseDown(e)}
  onmouseup={(e) => handleMouseUp(e)}
  {...restProps}
>
  {@render children?.()}
</div>
{#if isDragging}
  <div
    class={cn('z-tab absolute cursor-default opacity-35', className)}
    style="left: {floatPos.x - clickOffsetX}px; top:{floatPos.y -
      clickOffsetY}px; transform: translate(-50%,-50%);"
  >
    {@render children?.()}
    {clickOffsetX}
    {clickOffsetY}
  </div>
{/if}

<style>
  .z-tab {
    z-index: 300;
  }
</style>
