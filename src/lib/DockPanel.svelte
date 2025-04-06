<script lang="ts" module>
  import type { PanelData } from './dock-data';

  interface Props {
    panelData: PanelData;
    size: number;
  }

  interface State {
    dropFromPanel?: PanelData |null;
    draggingHeader?: boolean;
  }
  interface MovingState {
    _movingCorner?: string
    _movingX?: number
    _movingY?: number
    _movingW?: number
    _movingH?: number
  }
</script>

<script lang="ts">
  import DragDropDiv from './dragdrop/DragDropDiv.svelte';
  import DockTabs from './DockTabs.svelte';
  import { DragState } from './dragdrop/drag-manager';
  import { groupClassNames } from '$lib/utils';
  import classNames from 'classnames';
  import { getFloatPanelSize, nextZIndex } from '$lib/algorithm';
  import type { DockContext, TabData } from './dock-data';
  import { setContext,getContext } from 'svelte';

  const context:DockContext = getContext('DockContext');

  let ref: HTMLDivElement|undefined = $state();
  let { panelData = $bindable(), size }: Props = $props();
  let { dropFromPanel, draggingHeader }: State = $state({});
  let { minWidth, minHeight, group, id, parent, panelLock } = panelData;
  let { widthFlex, heightFlex } = tabGroup;
  let {_movingCorner,_movingX,_movingY,_movingW,_movingH }:MovingState = $state({});
  let isMax =   $derived(parent?.mode === 'maximize');
  let isFloat = $derived(parent?.mode === 'float');
  let isHBox =  $derived(parent?.mode === 'horizontal');
  let isVBox =  $derived(parent?.mode === 'vertical');
  let styleName = $derived(group);
  let panelClass: string = $derived(classNames(groupClassNames(styleName)));
  let flex = $derived(isHBox && widthFlex != null? widthFlex : isVBox && heightFlex != null? heightFlex : 1);
  let flexGrow = $derived(flex * size);
  let flexShrink = $derived(flex * 1000000 <1? 1 : flex * 1000000);
  let cls = $derived(`dock-panel ${
    panelClass ? panelClass : ''}${
    dropFromPanel ? ' dock-panel-dropping' : ''}${
    draggingHeader ? ' dragging' : ''
  }`);


  let style = $derived(
    `min-width: ${minWidth}px; min-height: ${minHeight}px; flex: ${flexGrow} ${flexShrink} ${size}px;` +
    isFloat?`left: {panelData.x}px; top: {panelData.y}px; width: {panelData.w}px; height: {panelData.h}px; z-index: {panelData.z};`:'')



  function onPanelCornerDrag(e: DragState, corner: string) {
    let {parent, x, y, w, h} = panelData;
    if (parent?.mode === 'float') {
      _movingCorner = corner;
      _movingX = x;
      _movingY = y;
      _movingW = w;
      _movingH = h;
      e.startDrag(null, null);
    }
  }
  function onDragOverOtherPanel() {
    dropFromPanel = null;
  }
  const onPanelCornerDragT = (e: DragState) => {
    onPanelCornerDrag(e, 't');
  };
  const onPanelCornerDragB = (e: DragState) => {
    onPanelCornerDrag(e, 'b');
  };
  const onPanelCornerDragL = (e: DragState) => {
    onPanelCornerDrag(e, 'l');
  };
  const onPanelCornerDragR = (e: DragState) => {
    onPanelCornerDrag(e, 'r');
  };
  const onPanelCornerDragTL = (e: DragState) => {
    onPanelCornerDrag(e, 'tl');
  };
  const onPanelCornerDragTR = (e: DragState) => {
    onPanelCornerDrag(e, 'tr');
  };
  const onPanelCornerDragBL = (e: DragState) => {
    onPanelCornerDrag(e, 'bl');
  };
  const onPanelCornerDragBR = (e: DragState) => {
    onPanelCornerDrag(e, 'br');
  };
  const onPanelCornerDragMove = (e: DragState) => {
    let {dx, dy} = e;
    if (_movingCorner.startsWith('t')) {
      // when moving top corners, dont let it move header out of screen
      let {width, height} = context.getLayoutSize();
      if (_movingY + dy < 0) {
        dy = -_movingY;
      } else if (_movingY + dy > height - 16) {
        dy = height - 16 - _movingY;
      }
    }

    switch (_movingCorner) {
      case 't': {
        panelData.y = _movingY + dy;
        panelData.h = _movingH - dy;
        break;
      }
      case 'b': {
        panelData.h = _movingH + dy;
        break;
      }
      case 'l': {
        panelData.x = _movingX + dx;
        panelData.w = _movingW - dx;
        break;
      }
      case 'r': {
        panelData.w = _movingW + dx;
        break;
      }
      case 'tl': {
        panelData.x = _movingX + dx;
        panelData.w = _movingW - dx;
        panelData.y = _movingY + dy;
        panelData.h = _movingH - dy;
        break;
      }
      case 'tr': {
        panelData.w = _movingW + dx;
        panelData.y = _movingY + dy;
        panelData.h = _movingH - dy;
        break;
      }
      case 'bl': {
        panelData.x = _movingX + dx;
        panelData.w = _movingW - dx;
        panelData.h = _movingH + dy;
        break;
      }
      case 'br': {
        panelData.w = _movingW + dx;
        panelData.h = _movingH + dy;
        break;
      }
    }
    panelData.w = Math.max(panelData.w || 0, panelData.minWidth || 0);
    panelData.h = Math.max(panelData.h || 0, panelData.minHeight || 0);
  };
  const onPanelCornerDragEnd = (e: DragState) => {
    context.onSilentChange(panelData.activeId, 'move');
  };
  const onPanelHeaderDragStart = (event: DragState) => {

    let {parent, x, y, z} = panelData;
    let dockId = context.getDockId();
    if (parent?.mode === 'float') {
      _movingX = x;
      _movingY = y;
      // hide the panel, but not create drag layer element
      event.setData({panel: panelData, tabGroup: panelData.group}, dockId);
      event.startDrag(null, null);
      onFloatPointerDown();
    } else {
      let tabGroup = context.getGroup(panelData.group);
      let [panelWidth, panelHeight] = getFloatPanelSize(ref, tabGroup);

      event.setData({panel: panelData, panelSize: [panelWidth, panelHeight], tabGroup: panelData.group}, dockId);
      event.startDrag(null);
    }
    draggingHeader = true;
  };
  const onPanelHeaderDragMove = (e: DragState) => {
    if (panelData.parent?.mode !== 'float') {
      return;
    }
    let {width, height} = context.getLayoutSize();
    panelData.x = _movingX + e.dx;
    panelData.y = _movingY + e.dy;
    if (width > 200 && height > 200) {
      if (panelData.y < 0) {
        panelData.y = 0;
      } else if (panelData.y > height - 16) {
        panelData.y = height - 16;
      }

      if (panelData.x + panelData.w < 16) {
        panelData.x = 16 - panelData.w;
      } else if (panelData.x > width - 16) {
        panelData.x = width - 16;
      }
    }
  };
  const onPanelHeaderDragEnd = (e: DragState) => {
    draggingHeader = false
    if (e.dropped === false) {
      if (panelData.parent?.mode === 'float') {
        // in float mode, the position change needs to be sent to the layout
        context.onSilentChange(panelData.activeId, 'move');
      }
    }
  };


  
  const onDragOver = (e: DragState) => {
    if (_droppingPanel === this) {
      return;
    }
    let dockId = context.getDockId();
    let tab: TabData = DragState.getData('tab', dockId);
    let panel: PanelData = DragState.getData('panel', dockId);
    if (tab || panel) {
      DockPanel.droppingPanel = this;
    }
    if (tab) {
      if (tab.parent) {
        setState({dropFromPanel: tab.parent});
      } else {
        // add a fake panel
        setState({dropFromPanel: {activeId: '', tabs: [], group: tab.group}});
      }
    } else if (panel) {
      setState({dropFromPanel: panel});
    }
  };


  const onFloatPointerDown = () => {
    let {z} = panelData;
    let newZ = nextZIndex(z);
    if (newZ !== z) {
      panelData.z = newZ;
    }
  };
  const onPanelClicked = (e: MouseEvent) => {
    const target = e.target;
    if(!ref) return;
    if (!ref.contains(ref.ownerDocument.activeElement) && target instanceof Node && ref.contains(target)) {
      (ref.querySelector('.dock-bar') as HTMLElement).focus();
    }
  };
</script>

{#snippet droppingLayer()}
  {#if dropFromPanel}
    {#if !context.getGroup(dropFromPanel.group).tabLocked || DragState.getData('tab', dockId) == null}
      {#if context.useEdgeDrop()}
        <DockDropEdge panelData={panelData} panelElement={ref} dropFromPanel={dropFromPanel}/>
      {:else }
        <DockDropLayer panelData={panelData} panelElement={ref} dropFromPanel={dropFromPanel}/>
      {/if}
    {/if}
  {/if}
{/snippet}


<DragDropDiv
  bind:ref={ref}
  class={cls}
  style={style}
  data-dockid={id}
  onDragOverT={isFloat ? null : onDragOver}
  onClick={onPanelClicked}
>
  <DockTabs
    {panelData}
    onPanelDragStart={onPanelHeaderDragStart}
    onPanelDragMove={onPanelHeaderDragMove}
    onPanelDragEnd={onPanelHeaderDragEnd}
  />
  {#if isFloat}
    <DragDropDiv
      class="dock-panel-drag-size dock-panel-drag-size-t"
      onDragStartT={onPanelCornerDragT}
      onDragMoveT={onPanelCornerDragMove}
      onDragEndT={onPanelCornerDragEnd}
    />
    <DragDropDiv
      class="dock-panel-drag-size dock-panel-drag-size-b"
      onDragStartT={onPanelCornerDragB}
      onDragMoveT={onPanelCornerDragMove}
      onDragEndT={onPanelCornerDragEnd}
    />
    <DragDropDiv
      class="dock-panel-drag-size dock-panel-drag-size-l"
      onDragStartT={onPanelCornerDragL}
      onDragMoveT={onPanelCornerDragMove}
      onDragEndT={onPanelCornerDragEnd}
    />
    <DragDropDiv
      class="dock-panel-drag-size dock-panel-drag-size-r"
      onDragStartT={onPanelCornerDragR}
      onDragMoveT={onPanelCornerDragMove}
      onDragEndT={onPanelCornerDragEnd}
    />
    <DragDropDiv
      class="dock-panel-drag-size dock-panel-drag-size-t-l"
      onDragStartT={onPanelCornerDragTL}
      onDragMoveT={onPanelCornerDragMove}
      onDragEndT={onPanelCornerDragEnd}
    />
    <DragDropDiv
      class="dock-panel-drag-size dock-panel-drag-size-t-r"
      onDragStartT={onPanelCornerDragTR}
      onDragMoveT={onPanelCornerDragMove}
      onDragEndT={onPanelCornerDragEnd}
    />
    <DragDropDiv
      class="dock-panel-drag-size dock-panel-drag-size-b-l"
      onDragStartT={onPanelCornerDragBL}
      onDragMoveT={onPanelCornerDragMove}
      onDragEndT={onPanelCornerDragEnd}
    />
    <DragDropDiv
      class="dock-panel-drag-size dock-panel-drag-size-b-r"
      onDragStartT={onPanelCornerDragBR}
      onDragMoveT={onPanelCornerDragMove}
      onDragEndT={onPanelCornerDragEnd}
    />
  {/if}
  {@render droppingLayer()}
</DragDropDiv>
