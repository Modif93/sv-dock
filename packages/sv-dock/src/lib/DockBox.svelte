<script lang="ts">
  import { isBoxData, isPanelData, type BoxData } from './dockData.js';
  import DockBox from './DockBox.svelte';
  import DockPanel from './DockPanel.svelte';
  import type { DropzoneVisibility, PanelDropEvent } from '$lib/dragdrop/gesture-manager';

  type DockBoxProps = {
    boxData: BoxData;
    onTabDrop?: (e: PanelDropEvent) => void;
    isRoot?: boolean;
  };

  let { boxData = $bindable(), onTabDrop, isRoot = false }: DockBoxProps = $props();

  let groupRef: HTMLDivElement | undefined = $state();
  let resizing = $state<{
    index: number;
    startPosition: number;
    beforeSize: number;
    afterSize: number;
  } | null>(null);

  const isHorizontal = $derived(boxData.mode === 'horizontal');
  const directRootPanelDropzoneVisibility: DropzoneVisibility | undefined = $derived(
    isRoot
      ? {
          top: boxData.mode !== 'vertical',
          bottom: boxData.mode !== 'vertical',
          west: boxData.mode !== 'horizontal',
          east: boxData.mode !== 'horizontal'
        }
      : undefined
  );

  function childWeight(index: number) {
    return boxData.children[index]?.size ?? 1;
  }

  function childStyle(index: number) {
    return `flex: ${childWeight(index)} 1 0; min-width: 0; min-height: 0;`;
  }

  function handlePanelEmpty(index: number) {
    if (isPanelData(boxData.children[index])) {
      boxData.children.splice(index, 1);
    }
  }

  function startResize(event: PointerEvent, index: number) {
    event.preventDefault();
    const children = groupRef?.querySelectorAll<HTMLElement>(':scope > [data-dock-child]');
    const before = children?.[index - 1];
    const after = children?.[index];

    if (!before || !after) return;

    resizing = {
      index,
      startPosition: isHorizontal ? event.clientX : event.clientY,
      beforeSize: isHorizontal
        ? before.getBoundingClientRect().width
        : before.getBoundingClientRect().height,
      afterSize: isHorizontal
        ? after.getBoundingClientRect().width
        : after.getBoundingClientRect().height
    };

    before.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent) {
    if (!resizing) return;

    const delta = (isHorizontal ? event.clientX : event.clientY) - resizing.startPosition;
    const nextBefore = Math.max(80, resizing.beforeSize + delta);
    const nextAfter = Math.max(80, resizing.afterSize - delta);

    boxData.children[resizing.index - 1].size = nextBefore;
    boxData.children[resizing.index].size = nextAfter;
  }

  function stopResize() {
    resizing = null;
  }
</script>

<svelte:window onpointermove={handlePointerMove} onpointerup={stopResize} />

<div
  bind:this={groupRef}
  class="sv-dock-group flex h-full w-full overflow-hidden"
  class:flex-row={isHorizontal}
  class:flex-col={!isHorizontal}
  data-direction={boxData.mode}
>
  {#each boxData.children as child, i}
    {#if i > 0}
      <button
        type="button"
        aria-label="Resize dock panel"
        class="sv-dock-resizer shrink-0 bg-slate-200 transition-colors hover:bg-sky-400 data-[direction=horizontal]:w-1 data-[direction=horizontal]:cursor-col-resize data-[direction=vertical]:h-1 data-[direction=vertical]:cursor-row-resize"
        data-direction={boxData.mode}
        onpointerdown={(event) => startResize(event, i)}
      ></button>
    {/if}

    <div data-dock-child class="min-h-0 min-w-0 overflow-hidden" style={childStyle(i)}>
      {#if isPanelData(child)}
        <DockPanel
          panelData={child}
          onTabDrop={(e) => onTabDrop?.(e)}
          onPanelEmpty={() => handlePanelEmpty(i)}
          dropzoneVisibility={directRootPanelDropzoneVisibility}
        />
      {:else if isBoxData(child)}
        <DockBox boxData={child} {onTabDrop} />
      {/if}
    </div>
  {/each}
</div>
