<script lang="ts">
  import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@lucide/svelte';

  import { panelStore } from '../store/panel-store';
  import type { PanelDropEvent } from '../model/panel-event';
  import type { DropDirection, OverPanelDropzone } from '../model/panel-drop';
  import DockDrop from './DockDrop.svelte';

  type DropzoneProps = {
    panelId: string;
    ondrop: (e: PanelDropEvent) => void;
    isOverDrop: OverPanelDropzone;
  };
  let {
    panelId,
    ondrop,
    isOverDrop = $bindable({
      top: false,
      up: false,
      west: false,
      left: false,
      center: false,
      right: false,
      east: false,
      down: false,
      bottom: false
    })
  }: DropzoneProps = $props();
  function handleOnDrop(direction: DropDirection) {
    const fromId = $panelStore.draggingId;
    if (!fromId) return;
    ondrop({ fromId, toId: panelId, direction });
  }
</script>

<div class="z-30 mx-auto my-auto flex flex-col items-center justify-center gap-0.5">
  <DockDrop half vertical ondrop={() => handleOnDrop('top')} bind:isOver={isOverDrop.top}>
    <ChevronUp />
  </DockDrop>
  <DockDrop ondrop={() => handleOnDrop('up')} bind:isOver={isOverDrop.up}>
    <ChevronUp />
  </DockDrop>

  <div class="flex gap-0.5">
    <DockDrop half horizontal ondrop={() => handleOnDrop('left')} bind:isOver={isOverDrop.west}>
      <ChevronLeft />
    </DockDrop>
    <DockDrop ondrop={() => handleOnDrop('left')} bind:isOver={isOverDrop.left}>
      <ChevronLeft />
    </DockDrop>
    <DockDrop ondrop={() => handleOnDrop('center')} bind:isOver={isOverDrop.center}></DockDrop>
    <DockDrop ondrop={() => handleOnDrop('right')} bind:isOver={isOverDrop.right}>
      <ChevronRight />
    </DockDrop>
    <DockDrop half horizontal ondrop={() => handleOnDrop('right')} bind:isOver={isOverDrop.east}>
      <ChevronRight />
    </DockDrop>
  </div>
  <DockDrop ondrop={() => handleOnDrop('down')} bind:isOver={isOverDrop.down}>
    <ChevronDown />
  </DockDrop>
  <DockDrop half vertical ondrop={() => handleOnDrop('bottom')} bind:isOver={isOverDrop.bottom}>
    <ChevronDown />
  </DockDrop>
</div>
