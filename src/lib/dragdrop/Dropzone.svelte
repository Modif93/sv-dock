<script lang="ts">
  import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@lucide/svelte';

  import DockDrop from './DockDrop.svelte';

  import type { DropDirection, OverPanelDropzone, PanelDropEvent } from './gesture-manager';
  import { dropStore } from '$lib/utils';

  type DropzoneProps = {
    panelId?: string;
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
  function checkDrop() {
    if (
      isOverDrop.top ||
      isOverDrop.up ||
      isOverDrop.west ||
      isOverDrop.left ||
      isOverDrop.center ||
      isOverDrop.right ||
      isOverDrop.east ||
      isOverDrop.down ||
      isOverDrop.bottom
    ) {
      return isOverDrop.top
        ? 'top'
        : isOverDrop.up
          ? 'up'
          : isOverDrop.west
            ? 'west'
            : isOverDrop.left
              ? 'left'
              : isOverDrop.center
                ? 'center'
                : isOverDrop.right
                  ? 'right'
                  : isOverDrop.east
                    ? 'east'
                    : isOverDrop.down
                      ? 'down'
                      : isOverDrop.bottom
                        ? 'bottom'
                        : null;
    }
  }

  $effect(() => {
    const direction = checkDrop();
    if (direction) {
      $dropStore.direction = direction;
      $dropStore.toId = panelId;
    }
  });
</script>

<div class="z-10 mx-auto my-auto flex flex-col items-center justify-center gap-0.5">
  <DockDrop half vertical bind:isOver={isOverDrop.top}>
    <ChevronUp />
  </DockDrop>
  <DockDrop bind:isOver={isOverDrop.up}>
    <ChevronUp />
  </DockDrop>

  <div class="flex gap-0.5">
    <DockDrop half horizontal bind:isOver={isOverDrop.west}>
      <ChevronLeft />
    </DockDrop>
    <DockDrop bind:isOver={isOverDrop.left}>
      <ChevronLeft />
    </DockDrop>
    <DockDrop bind:isOver={isOverDrop.center}></DockDrop>
    <DockDrop bind:isOver={isOverDrop.right}>
      <ChevronRight />
    </DockDrop>
    <DockDrop half horizontal bind:isOver={isOverDrop.east}>
      <ChevronRight />
    </DockDrop>
  </div>
  <DockDrop bind:isOver={isOverDrop.down}>
    <ChevronDown />
  </DockDrop>
  <DockDrop half vertical bind:isOver={isOverDrop.bottom}>
    <ChevronDown />
  </DockDrop>
</div>
