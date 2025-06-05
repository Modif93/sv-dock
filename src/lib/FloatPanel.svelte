<script lang="ts" module>
  import type {SizeBox, TabData} from './dock-data.js';
  export type FloatPanelProps = {
    tabs: TabData[];
    box: SizeBox
    onTabEmpty: () => void;
  };
</script>
<script lang="ts">
  import { X } from '@lucide/svelte';
  import type {HandlePosition} from '$lib/dock-data.js';
  import ResizeHandle from '$lib/dragdrop/ResizeHandle.svelte';
  import FlexRender from "$lib/FlexRender.svelte";
  import { cn } from '$lib/utils.js';
  import DragDropDiv from "$lib/dragdrop/DragDropDiv.svelte";

  let { tabs = $bindable([]),box = $bindable({w:100,h:100,x:100,y:100}), onTabEmpty }: FloatPanelProps = $props();

  let isDragging = $state(false);
  let isResizing = $state(false);
  let resizeHandle: HandlePosition | null = $state(null);
  let startX = $state(0);
  let startY = $state(0);
  let startWidth = $state(0);
  let startHeight = $state(0);
  let startBoxX = $state(0);
  let startBoxY = $state(0);
  let activeTabId = $state(tabs[0].id);
  let tabbarDiv: HTMLDivElement | undefined = $state();
  let activeTabIndex = $derived(
    tabs.findIndex((tab) => tab.id === activeTabId) === -1
      ? 0
      : tabs.findIndex((tab) => tab.id === activeTabId)
  );

  function handleClicked(e: MouseEvent, pos: HandlePosition) {
    e.stopPropagation();
    e.preventDefault();

    isResizing = true;
    resizeHandle = pos;

    // 리사이징 시작 시 초기 마우스 위치 저장
    startX = e.clientX;
    startY = e.clientY;

    // 리사이징 시작 시 초기 박스 크기와 위치 저장
    startWidth = box.w;
    startHeight = box.h;
    startBoxX = box.x;
    startBoxY = box.y;
  }

  function handlePanelClick(e: MouseEvent) {
    isDragging = true;
    // 드래깅 시작 시 초기 마우스 위치와 박스 위치 저장
    startX = e.clientX;
    startY = e.clientY;
    startBoxX = box.x;
    startBoxY = box.y;
  }


  function handleMouseMove(e: MouseEvent) {
    const y = e.clientY;
    const x = e.clientX;

    // 마우스 이동 거리 계산
    const deltaX = x - startX;
    const deltaY = y - startY;

    if (isDragging) {
      // 드래깅 시 박스 위치 업데이트
      box.x = startBoxX + deltaX;
      box.y = startBoxY + deltaY;
    } else if (isResizing && resizeHandle) {
      // 리사이징 시 핸들에 따라 박스 크기와 위치 업데이트
      switch (resizeHandle) {
        case 'e': // 오른쪽 핸들
          box.w = Math.max(50, startWidth + deltaX);
          break;
        case 'w': // 왼쪽 핸들
          const newWidth = Math.max(50, startWidth - deltaX);
          box.x = startBoxX + (startWidth - newWidth);
          box.w = newWidth;
          break;
        case 'n': // 위쪽 핸들
          const newHeight = Math.max(50, startHeight - deltaY);
          box.y = startBoxY + (startHeight - newHeight);
          box.h = newHeight;
          break;
        case 's': // 아래쪽 핸들
          box.h = Math.max(50, startHeight + deltaY);
          break;
        case 'ne': // 오른쪽 위 핸들
          box.w = Math.max(50, startWidth + deltaX);
          const newHeightNE = Math.max(50, startHeight - deltaY);
          box.y = startBoxY + (startHeight - newHeightNE);
          box.h = newHeightNE;
          break;
        case 'nw': // 왼쪽 위 핸들
          const newWidthNW = Math.max(50, startWidth - deltaX);
          box.x = startBoxX + (startWidth - newWidthNW);
          box.w = newWidthNW;
          const newHeightNW = Math.max(50, startHeight - deltaY);
          box.y = startBoxY + (startHeight - newHeightNW);
          box.h = newHeightNW;
          break;
        case 'se': // 오른쪽 아래 핸들
          box.w = Math.max(50, startWidth + deltaX);
          box.h = Math.max(50, startHeight + deltaY);
          break;
        case 'sw': // 왼쪽 아래 핸들
          const newWidthSW = Math.max(50, startWidth - deltaX);
          box.x = startBoxX + (startWidth - newWidthSW);
          box.w = newWidthSW;
          box.h = Math.max(50, startHeight + deltaY);
          break;
      }
    }
  }
  function closeTab(tab: TabData) {
    tabs = tabs.filter((t) => t.id !== tab.id);
    if (tabs.length === 0) {
      console.log('tab is Empty!');
      onTabEmpty();
    }
  }
  function handleScroll(e: WheelEvent) {
    tabbarDiv?.scrollTo({ left: tabbarDiv?.scrollLeft + e.deltaY });
  }
  function handleTabClick(e: MouseEvent, tab: TabData) {
    e.preventDefault();
    if (e.button === 0) {
      activeTabId = tab.id;
    } else if (e.button === 1 && tab.closable) {
      closeTab(tab);
    }
  }
  function handleMouseUp() {
    isResizing = false;
    isDragging = false;
    resizeHandle = null;
  }
</script>

{#snippet titleSnippet()}
  {#each tabs as tab, i}
    <DragDropDiv
        data-state={activeTabIndex === i ? 'active' : ''}
        class="flex items-center gap-1 bg-gray-300 px-5 py-2 data-[state=active]:bg-gray-200"
    >
      <button onmousedown={(e) => handleTabClick(e, tab)} class="flex-grow text-nowrap">
        <FlexRender content={tab.title} />
      </button>
      {#if tab.closable}
        <button
            class="hover:drop-shadow-xs hover:drop-shadow-blue-300"
            onclick={() => closeTab(tab)}
        >
          <X class="size-4" />
        </button>
      {/if}
    </DragDropDiv>
  {/each}
{/snippet}

{#snippet panelSnippet()}
  {#if tabs.length > 0}
    <FlexRender content={tabs[activeTabIndex].content} />
  {/if}
{/snippet}

<svelte:window onmousemove={(e) => handleMouseMove(e)} onmouseup={() => handleMouseUp()} />

<div
    class={cn(
    'absolute z-1 shadow-[0_0_4px_rgb(170,170,170)]',
    'flex flex-col transition-opacity duration-100',
    isDragging ? 'opacity-50' : 'opacity-100'
  )}
    style="width: {box.w}px;height: {box.h}px;top: {box.y}px; left: {box.x}px;"
>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
      role="banner"
      bind:this={tabbarDiv}
      onwheel={(e) => handleScroll(e)}
      onmousedown={(e) => handlePanelClick(e)}
      class={cn(
        'h-8 flex scrollbar-hide bg-gray-300 gap-2 cursor-move px-2',
        isDragging?'cursor-move':'cursor-auto'
    )}
  >
    {@render titleSnippet()}
  </div>
  <div class="flex-grow bg-gray-300">
    {@render panelSnippet()}
  </div>
  <ResizeHandle pos="w" {handleClicked} />
  <ResizeHandle pos="e" {handleClicked} />
  <ResizeHandle pos="n" {handleClicked} />
  <ResizeHandle pos="s" {handleClicked} />
  <ResizeHandle pos="nw" {handleClicked} />
  <ResizeHandle pos="ne" {handleClicked} />
  <ResizeHandle pos="sw" {handleClicked} />
  <ResizeHandle pos="se" {handleClicked} />
</div>
