<script lang="ts" module>
  import type {PanelData} from "./dock-data";

  interface Props {
    panelData: PanelData;
    size: number;
  }

  interface State {
    dropFromPanel: PanelData;
    draggingHeader: boolean;
  }

</script>
<script lang="ts">
    import DragDropDiv from "./dragdrop/DragDropDiv.svelte";
    import DockTabs from "./DockTabs.svelte";


    let ref:HTMLDivElement = $state()
    let isFloat = $state(false);
    let {panelData, size}:Props = $props();
    let {dropFromPanel, draggingHeader}:State = $state();
    let {minWidth, minHeight, group, id, parent, panelLock} = panelData;
    let {widthFlex, heightFlex} = tabGroup;
    let styleName = group;
    function getRef(ref: HTMLDivElement) {

    }


</script>

<DragDropDiv bind:ref={getRef} class={cls} style={style} data-dockid={id}
             onDragOverT={isFloat ? null : onDragOver} onClick={onPanelClicked}>
    <DockTabs panelData={panelData} onPanelDragStart={onPanelHeaderDragStart}
              onPanelDragMove={onPanelHeaderDragMove} onPanelDragEnd={onPanelHeaderDragEnd}/>
    {#if isFloat}
        <DragDropDiv class="dock-panel-drag-size dock-panel-drag-size-t"
                     onDragStartT={onPanelCornerDragT} onDragMoveT={onPanelCornerDragMove}
                     onDragEndT={onPanelCornerDragEnd}/>,
        <DragDropDiv class="dock-panel-drag-size dock-panel-drag-size-b"
                     onDragStartT={onPanelCornerDragB} onDragMoveT={onPanelCornerDragMove}
                     onDragEndT={onPanelCornerDragEnd}/>,
        <DragDropDiv class="dock-panel-drag-size dock-panel-drag-size-l"
                     onDragStartT={onPanelCornerDragL} onDragMoveT={onPanelCornerDragMove}
                     onDragEndT={onPanelCornerDragEnd}/>,
        <DragDropDiv  class="dock-panel-drag-size dock-panel-drag-size-r"
                     onDragStartT={onPanelCornerDragR} onDragMoveT={onPanelCornerDragMove}
                     onDragEndT={onPanelCornerDragEnd}/>,
        <DragDropDiv class="dock-panel-drag-size dock-panel-drag-size-t-l"
                     onDragStartT={onPanelCornerDragTL} onDragMoveT={onPanelCornerDragMove}
                     onDragEndT={onPanelCornerDragEnd}/>,
        <DragDropDiv class="dock-panel-drag-size dock-panel-drag-size-t-r"
                     onDragStartT={onPanelCornerDragTR} onDragMoveT={onPanelCornerDragMove}
                     onDragEndT={onPanelCornerDragEnd}/>,
        <DragDropDiv class="dock-panel-drag-size dock-panel-drag-size-b-l"
                     onDragStartT={onPanelCornerDragBL} onDragMoveT={onPanelCornerDragMove}
                     onDragEndT={onPanelCornerDragEnd}/>,
        <DragDropDiv class="dock-panel-drag-size dock-panel-drag-size-b-r"
                     onDragStartT={onPanelCornerDragBR} onDragMoveT={onPanelCornerDragMove}
                     onDragEndT={onPanelCornerDragEnd}/>
    {/if}
    {@render droppingLayer()}
</DragDropDiv>