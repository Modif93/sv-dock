<script lang="ts">
  import type { PanelData } from './dockData.js';
  import DockTabs from './DockTabs.svelte';
  import Dropzone from '$lib/dragdrop/Dropzone.svelte';
  import { nanoid } from 'nanoid';
  import type {
    DropzoneVisibility,
    OverPanelDropzone,
    PanelDropEvent
  } from '$lib/dragdrop/gesture-manager';
  import { dragStore, dropStore } from '$lib/utils';

  type DockPanelProps = {
    panelData: PanelData;
    onPanelEmpty: () => void;
    onTabDrop?: (e: PanelDropEvent) => void;
    dropzoneVisibility?: DropzoneVisibility;
  };

  let { panelData = $bindable(), onPanelEmpty, onTabDrop, dropzoneVisibility }: DockPanelProps = $props();

  let contentRef: HTMLDivElement | undefined = $state();
  let isDragging = $state(false);
  let isPointerInside = $state(false);
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

  $effect(() => {
    if (!panelData.id) {
      panelData.id = nanoid();
    }
  });

  dropStore.subscribe((value) => {
    isDragging =
      value.tabId !== undefined && value.fromId !== undefined && panelData.id !== value.fromId;
  });

  dragStore.subscribe((value) => {
    const rect = contentRef?.getBoundingClientRect();
    isPointerInside =
      !!rect &&
      rect.left < value.x &&
      value.x < rect.right &&
      rect.top < value.y &&
      value.y < rect.bottom;
  });
</script>

<div
  bind:this={contentRef}
  class="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden border border-slate-200 bg-white"
>
  <DockTabs
    bind:panelId={panelData.id}
    bind:tabs={panelData.tabs}
    onTabEmpty={onPanelEmpty}
    onTabDrop={(e) => onTabDrop?.(e)}
  />

  {#if isDragging && isPointerInside}
    <div class="absolute inset-0 z-20 flex bg-sky-500/10 backdrop-blur-[1px]">
      <Dropzone
        panelId={panelData.id}
        bind:isOverDrop
        visibility={dropzoneVisibility}
        ondrop={(e) => onTabDrop?.(e)}
      />
    </div>
  {/if}
</div>
