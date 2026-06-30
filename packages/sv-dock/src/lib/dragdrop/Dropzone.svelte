<script lang="ts">
  import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@lucide/svelte';

  import DockDrop from './DockDrop.svelte';

  import type {
    DropDirection,
    DropzoneVisibility,
    OverPanelDropzone,
    PanelDropEvent
  } from './gesture-manager';
  import { dropStore } from '$lib/utils';

  type DropzoneProps = {
    panelId?: string;
    ondrop: (e: PanelDropEvent) => void;
    isOverDrop: OverPanelDropzone;
    visibility?: DropzoneVisibility;
  };
  let {
    panelId,
    ondrop,
    visibility = {},
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

  function isVisible(direction: DropDirection) {
    return visibility[direction] ?? true;
  }

  function checkDrop(): DropDirection | null {
    if (isVisible('top') && isOverDrop.top) return 'top';
    if (isVisible('up') && isOverDrop.up) return 'up';
    if (isVisible('west') && isOverDrop.west) return 'west';
    if (isVisible('left') && isOverDrop.left) return 'left';
    if (isVisible('center') && isOverDrop.center) return 'center';
    if (isVisible('right') && isOverDrop.right) return 'right';
    if (isVisible('east') && isOverDrop.east) return 'east';
    if (isVisible('down') && isOverDrop.down) return 'down';
    if (isVisible('bottom') && isOverDrop.bottom) return 'bottom';
    return null;
  }

  $effect(() => {
    for (const direction of Object.keys(isOverDrop) as DropDirection[]) {
      if (!isVisible(direction)) {
        isOverDrop[direction] = false;
      }
    }
  });

  $effect(() => {
    const direction = checkDrop();
    if (direction) {
      $dropStore.direction = direction;
      $dropStore.toId = panelId;
    } else {
      $dropStore.direction = 'float';
      $dropStore.toId = undefined;
    }
  });
</script>

<div class="z-10 mx-auto my-auto flex flex-col items-center justify-center gap-0.5">
  {#if isVisible('top')}
    <DockDrop half vertical bind:isOver={isOverDrop.top}>
      <ChevronUp />
    </DockDrop>
  {/if}
  {#if isVisible('up')}
    <DockDrop bind:isOver={isOverDrop.up}>
      <ChevronUp />
    </DockDrop>
  {/if}

  <div class="flex gap-0.5">
    {#if isVisible('west')}
      <DockDrop half horizontal bind:isOver={isOverDrop.west}>
        <ChevronLeft />
      </DockDrop>
    {/if}
    {#if isVisible('left')}
      <DockDrop bind:isOver={isOverDrop.left}>
        <ChevronLeft />
      </DockDrop>
    {/if}
    {#if isVisible('center')}
      <DockDrop bind:isOver={isOverDrop.center}></DockDrop>
    {/if}
    {#if isVisible('right')}
      <DockDrop bind:isOver={isOverDrop.right}>
        <ChevronRight />
      </DockDrop>
    {/if}
    {#if isVisible('east')}
      <DockDrop half horizontal bind:isOver={isOverDrop.east}>
        <ChevronRight />
      </DockDrop>
    {/if}
 </div>
  {#if isVisible('down')}
    <DockDrop bind:isOver={isOverDrop.down}>
      <ChevronDown />
    </DockDrop>
  {/if}
  {#if isVisible('bottom')}
    <DockDrop half vertical bind:isOver={isOverDrop.bottom}>
      <ChevronDown />
    </DockDrop>
  {/if}
</div>
