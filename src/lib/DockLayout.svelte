<script lang="ts" module>
  import type {PanelBase, TabBase, TabGroup} from "./dock-data";

  export interface LayoutProps {
    /**
     * when there are multiple DockLayout, by default, you can't drag panel between them
     * but if you assign same dockId, it will allow panels to be dragged from one layout to another
     */
    dockId?: string;

    /**
     * - when [[LayoutProps.loadTab]] callback is defined, tabs in defaultLayout only need to have an id, unless loadTab requires other fields
     * - when [[LayoutProps.loadTab]] is not defined, tabs must contain title and content, as well as other fields in [[TabData]] when needed
     */
    defaultLayout?: LayoutData;

    /**
     * set layout only when you want to use DockLayout as a fully controlled react component
     * when using controlled layout, [[LayoutProps.onChange]] must be set to enable any layout change
     */
    layout?: LayoutBase;

    /**
     * Tab Groups, defines additional configuration for different groups
     */
    groups?: {[key: string]: TabGroup};

    /**
     * @param newLayout layout data can be set to [[LayoutProps.layout]] directly when used as controlled component
     * @param currentTabId id of current tab
     * @param direction direction of the dock change
     */
    onLayoutChange?(newLayout: LayoutBase, currentTabId?: string, direction?: DropDirection): void;

    /**
     * - default mode: showing 4 to 9 squares to help picking drop areas
     * - edge mode: using the distance between mouse and panel border to pick drop area
     *   - in edge mode, dragging float panel's header won't bring panel back to dock layer
     */
    dropMode?: 'default' | 'edge';

    /**
     * override the default saveTab behavior
     * @return must at least have an unique id
     */
    saveTab?(tab: TabData): TabBase;

    /**
     * override the default loadTab behavior
     * - when loadTab is not defined, [[LayoutProps.defaultLayout]] will be used to find a tab to load, thus defaultLayout must contain the titles and contents for TabData
     * - when loadTab is defined, [[LayoutProps.defaultLayout]] can ignore all those and only keep id and other custom data
     */
    loadTab?(tab: TabBase): TabData;

    /**
     * modify the savedPanel, you can add additional data into the savedPanel
     */
    afterPanelSaved?(savedPanel: PanelBase, panel: PanelData): void;

    /**
     * modify the loadedPanel, you can retrieve additional data into the panel
     * - modifying panel tabs is allowed, make sure to add or replace full TabData with title and content, because loadTab won't be called after this
     * - if tabs is empty, but still remaining in layout because of panelLock, make sure also set the group if it's not null
     */
    afterPanelLoaded?(savedPanel: PanelBase, loadedPanel: PanelData): void;

    style?: string;

    /**
     * when specified, docklayout will create a react portal for the maximized panel
     * use dom element as the value, or use the element's id
     */
    maximizeTo?: string | HTMLElement;
  }

  interface LayoutState {
    layout: LayoutData;
    /** @ignore */
    dropRect?: {left: number, width: number, top: number, height: number, element: HTMLElement, source?: any, direction?: DropDirection};
  }


</script>
<script lang="ts">
    import WindowBox from "$lib/WindowBox.svelte";
    import FloatBox from "$lib/FloatBox.svelte";
    import DockBox from "$lib/DockBox.svelte";
    import type {
      TabData,PanelData,BoxData,DropDirection,FloatPosition,LayoutBase,LayoutData
    } from "./dock-data";
    import * as Algorithm from './algorithm'
    import * as Serializer from './serializer'
    import MaxBox from "$lib/MaxBox.svelte";
    import Portal from "svelte-portal";

    let props: LayoutProps = $props();
    let dockState:LayoutState = $state();
    let panelToFocus: string = $state('');
    let tempLayout: LayoutData = $state();
    let dropRectStyle = $state();
    let ref: HTMLDivElement;


    function getGroup(name:string) {
      if (name) {
        let {groups} = props;
        if(groups && name in groups) {
          return groups[name];
        }
        if (name === placeHolderStyle) {
          return placeHolderGroup;
        }
      }
      return defaultGroup
    }

    function getLayout() {
      return tempLayout || dockState.layout;
    }

    function setLayout(layout: LayoutData) {
      tempLayout = layout;
      dockState.layout = layout;
    }

    /** @ignore
     * change layout
     */
    function changeLayout(layoutData: LayoutData, currentTabId: string, direction: DropDirection, silent: boolean = false) {
      let {layout, onLayoutChange} = props;
      let savedLayout: LayoutBase;
      if (onLayoutChange) {
        savedLayout = Serializer.saveLayoutData(layoutData, this.props.saveTab, this.props.afterPanelSaved);
        layoutData.loadedFrom = savedLayout;
        onLayoutChange(savedLayout, currentTabId, direction);
      }
      if (!layout && !silent) {
        // uncontrolled layout when Props.layout is not defined
        setLayout(layoutData);
      }
    }

    /**
     * Find PanelData or TabData by id
     */
    function find(id: string, filter?: Algorithm.Filter): PanelData | TabData | BoxData | undefined {
      return Algorithm.find(getLayout(), id, filter);
    }

    function onDragStateChange (draggingScope: any) {
      if (draggingScope == null) {
        DockPanel.droppingPanel = null;
        if (dockState.dropRect) {
          dockState.dropRect = null

        }
      }
    }

    function dockMove(
      source: TabData | PanelData,
      target: string | TabData | PanelData | BoxData | null,
      direction: DropDirection,
      floatPosition?: FloatPosition
    ) {
      let layout = getLayout();
      if (direction === 'maximize') {
        layout = Algorithm.maximize(layout, source);
        panelToFocus = source.id;
      } else if (direction === 'front') {
        layout = Algorithm.moveToFront(layout, source);
      } else {
        layout = Algorithm.removeFromLayout(layout, source);
      }

      if (typeof target === 'string') {
        target = find(target, Algorithm.Filter.All);
      } else {
        target = Algorithm.getUpdatedObject(target); // target might change during removeTab
      }

      if (direction === 'float') {
        let newPanel = Algorithm.converToPanel(source);
        newPanel.z = Algorithm.nextZIndex(null);
        if (dockState.dropRect || floatPosition) {
          layout = Algorithm.floatPanel(layout, newPanel, dockState.dropRect || floatPosition);
        } else {
          layout = Algorithm.floatPanel(layout, newPanel);
          if (ref) {
            layout = Algorithm.fixFloatPanelPos(layout, ref.offsetWidth, ref.offsetHeight);
          }
        }
      } else if (direction === 'new-window') {
        let newPanel = Algorithm.converToPanel(source);
        layout = Algorithm.panelToWindow(layout, newPanel);
      } else if (target) {
        if ('tabs' in (target as PanelData)) {
          // panel target
          if (direction === 'middle') {
            layout = Algorithm.addTabToPanel(layout, source, target as PanelData);
          } else {
            let newPanel = Algorithm.converToPanel(source);
            layout = Algorithm.dockPanelToPanel(layout, newPanel, target as PanelData, direction);
          }

        } else if ('children' in (target as BoxData)) {
          // box target
          let newPanel = Algorithm.converToPanel(source);
          layout = Algorithm.dockPanelToBox(layout, newPanel, target as BoxData, direction);
        } else {
          // tab target
          layout = Algorithm.addNextToTab(layout, source, target as TabData, direction);
        }
      }
      if (layout !== getLayout()) {
        layout = Algorithm.fixLayoutData(layout, props.groups);
        const currentTabId: string = source.hasOwnProperty('tabs') ? (source as PanelData).activeId : (source as TabData).id;
        changeLayout(layout, currentTabId, direction);
      }
      onDragStateChange(false);
    }


    $effect(()=>{
      let {style,maximizeTo} = props;
      let {dropRect} = dockstate;
      if (dropRect) {
        let {element, direction, ...rect} = dropRect;
        dropRectStyle = {...rect, display: 'block'};
        if (direction === 'float') {
          dropRectStyle.transition = 'none';
        }
      }
      if (typeof maximizeTo === 'string') {
        maximizeTo = document.getElementById(maximizeTo);
      }
    })

</script>
{#snippet maximize()}
    <Portal target={props.maximizeTo}>
        <MaxBox boxData={dockState.layout.maxbox}/>
    </Portal>

    {#if props.maximizeTo}
        {props.maximizeTo}
    {/if}
{/snippet}
<div bind:this={ref} class="dock-layout">
    <DockBox/>
    <FloatBox/>
    <WindowBox/>
    {@render maximize()}
    <div class="dock-drop-indicator" style={dropRectStyle}></div>
</div>
