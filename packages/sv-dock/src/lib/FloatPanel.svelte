<script lang="ts">
  import type { HandlePosition, SizeBox, TabData } from './dockData.js';
  import ResizeHandle from '$lib/dragdrop/ResizeHandle.svelte';
  import { cn, dragStore, dropStore } from '$lib/utils.js';
  import { nanoid } from 'nanoid';
  import type {
    DropzoneVisibility,
    OverPanelDropzone,
    PanelDropEvent
  } from './dragdrop/gesture-manager.js';
  import DockTabs from './DockTabs.svelte';
  import Dropzone from './dragdrop/Dropzone.svelte';

  export type FloatPanelProps = {
    id?: string;
    tabs: TabData[];
    box?: SizeBox;
    activePanel?: number;
    onTabEmpty: () => void;
    onTabDrop?: (e: PanelDropEvent) => void;
    dropzoneVisibility?: DropzoneVisibility;
  };

  let {
    id = $bindable(),
    tabs = $bindable([]),
    box = $bindable({ w: 360, h: 240, x: 100, y: 100, z: 0 }),
    onTabEmpty,
    onTabDrop,
    dropzoneVisibility
  }: FloatPanelProps = $props();

  let panelRef: HTMLDivElement | undefined = $state();
  let isDragging = $state(false);
  let isTabDragging = $state(false);
  let isPointerInside = $state(false);
  let isResizing = $state(false);
  let resizeHandle: HandlePosition | null = $state(null);
  let startX = $state(0);
  let startY = $state(0);
  let startWidth = $state(0);
  let startHeight = $state(0);
  let startBoxX = $state(0);
  let startBoxY = $state(0);
  let isOverDrop: OverPanelDropzone = $state({
    top: false,
    up: false,
    west: false,
    left: false,
    center: false,
    right: false,
    east: false,
    down: false,
    bottom: false
  });

  dropStore.subscribe((value) => {
    isTabDragging = value.tabId !== undefined && value.fromId !== undefined && id !== value.fromId;
  });

  dragStore.subscribe((value) => {
    const rect = panelRef?.getBoundingClientRect();
    isPointerInside =
      !!rect &&
      rect.left < value.x &&
      value.x < rect.right &&
      rect.top < value.y &&
      value.y < rect.bottom;
  });

  function handleResizeStart(e: MouseEvent, pos: HandlePosition) {
    e.stopPropagation();
    e.preventDefault();

    isResizing = true;
    resizeHandle = pos;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = box.w;
    startHeight = box.h;
    startBoxX = box.x;
    startBoxY = box.y;
  }

  function handlePanelDragStart(e: MouseEvent) {
    if (e.button !== 0) return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startBoxX = box.x;
    startBoxY = box.y;
    $dropStore.fromId = id;
  }

  function handleMouseMove(e: MouseEvent) {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (isDragging) {
      box.x = startBoxX + deltaX;
      box.y = startBoxY + deltaY;
      return;
    }

    if (!isResizing || !resizeHandle) return;

    switch (resizeHandle) {
      case 'e':
        box.w = Math.max(160, startWidth + deltaX);
        break;
      case 'w': {
        const nextWidth = Math.max(160, startWidth - deltaX);
        box.x = startBoxX + (startWidth - nextWidth);
        box.w = nextWidth;
        break;
      }
      case 'n': {
        const nextHeight = Math.max(120, startHeight - deltaY);
        box.y = startBoxY + (startHeight - nextHeight);
        box.h = nextHeight;
        break;
      }
      case 's':
        box.h = Math.max(120, startHeight + deltaY);
        break;
      case 'ne': {
        const nextHeight = Math.max(120, startHeight - deltaY);
        box.w = Math.max(160, startWidth + deltaX);
        box.y = startBoxY + (startHeight - nextHeight);
        box.h = nextHeight;
        break;
      }
      case 'nw': {
        const nextWidth = Math.max(160, startWidth - deltaX);
        const nextHeight = Math.max(120, startHeight - deltaY);
        box.x = startBoxX + (startWidth - nextWidth);
        box.y = startBoxY + (startHeight - nextHeight);
        box.w = nextWidth;
        box.h = nextHeight;
        break;
      }
      case 'se':
        box.w = Math.max(160, startWidth + deltaX);
        box.h = Math.max(120, startHeight + deltaY);
        break;
      case 'sw': {
        const nextWidth = Math.max(160, startWidth - deltaX);
        box.x = startBoxX + (startWidth - nextWidth);
        box.w = nextWidth;
        box.h = Math.max(120, startHeight + deltaY);
        break;
      }
    }
  }

  function handleMouseUp() {
    isResizing = false;
    isDragging = false;
    resizeHandle = null;
  }

  $effect(() => {
    if (!id) {
      id = nanoid();
    }
  });
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<div
  bind:this={panelRef}
  class={cn(
    'sv-dock-float absolute flex flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-xl transition-opacity duration-100',
    isDragging ? 'opacity-70' : 'opacity-100'
  )}
  style="width: {box.w}px; height: {box.h}px; top: {box.y}px; left: {box.x}px; z-index: {box.z ??
    1};"
>
  <div class="min-h-0 flex-1">
    <DockTabs
      bind:panelId={id}
      bind:tabs
      {onTabEmpty}
      onTabDrop={(e) => onTabDrop?.(e)}
      isParentFloating
      onPanelDragStart={handlePanelDragStart}
    />

    {#if isTabDragging && isPointerInside}
      <div class="absolute inset-0 z-20 bg-sky-500/10 backdrop-blur-[1px]">
        <Dropzone
          panelId={id}
          bind:isOverDrop
          visibility={dropzoneVisibility}
          ondrop={(e) => onTabDrop?.(e)}
        />
      </div>
    {/if}
  </div>

  <ResizeHandle pos="w" handleClicked={handleResizeStart} />
  <ResizeHandle pos="e" handleClicked={handleResizeStart} />
  <ResizeHandle pos="n" handleClicked={handleResizeStart} />
  <ResizeHandle pos="s" handleClicked={handleResizeStart} />
  <ResizeHandle pos="nw" handleClicked={handleResizeStart} />
  <ResizeHandle pos="ne" handleClicked={handleResizeStart} />
  <ResizeHandle pos="sw" handleClicked={handleResizeStart} />
  <ResizeHandle pos="se" handleClicked={handleResizeStart} />
</div>
