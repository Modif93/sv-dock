<script lang="ts">
  import { Pane } from 'paneforge';
  import type { PanelData } from './dockData.js';
  import DockTabs from './DockTabs.svelte';
  import DragDropButton from '$lib/dragdrop/DragDropButton.svelte';
  import Dropzone from '$lib/dragdrop/Dropzone.svelte';
  import { nanoid } from 'nanoid';
  import type {
    DropDirection,
    OverPanelDropzone,
    PanelDropEvent
  } from '$lib/dragdrop/gesture-manager';
  import { dragStore, dropStore } from '$lib/utils';
  type DockPanelProps = {
    panelData: PanelData;
    onPanelEmpty: () => void;
    ondrop: (e: PanelDropEvent) => void;
    onTabDrop?: (e: PanelDropEvent) => void;
  };
  let { panelData = $bindable(), ondrop, onPanelEmpty, onTabDrop }: DockPanelProps = $props();

  $effect(() => {
    if (!panelData.id) {
      panelData.id = nanoid();
    }
  });
  function handleTabEmpty() {
    // console.log('panel is Empty');
    onPanelEmpty();
  }
  let contentRef: HTMLElement | null = $state(null);

  let boundingBox = $derived(contentRef?.getBoundingClientRect());
  let isDragging = $state(false);
  let isFloating = $state(false);
  let mouseInside = $state(false);
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
    isDragging =
      value.tabId !== undefined && value.fromId !== undefined && panelData.id !== value.fromId;
  });

  dragStore.subscribe((value) => {
    if (boundingBox) {
      isFloating =
        boundingBox.left < value.x &&
        value.x < boundingBox.right &&
        boundingBox.top < value.y &&
        value.y < boundingBox.bottom;
    }
  });
</script>

<Pane bind:ref={contentRef} defaultSize={panelData.size} minSize={10}>
  <DockTabs
    bind:panelId={panelData.id}
    bind:tabs={panelData.tabs}
    onTabEmpty={() => handleTabEmpty()}
    onTabDrop={(e)=> onTabDrop?.(e)}
  />

  {#if isDragging && isFloating}
    <Dropzone panelId={panelData.id} {ondrop} bind:isOverDrop />
  {/if}
</Pane>
