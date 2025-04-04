<script lang="ts" module>
  import * as DragManager from "./drag-manager";
  import {GestureState} from "./GestureManager";
  import type {HTMLProps} from "svelte/svelte-html";
  import type {HTMLAttributes} from  'svelte/elements'

  export type AbstractPointerEvent = MouseEvent | TouchEvent;

  interface DragDropDivProps extends HTMLAttributes<HTMLDivElement>{
    ref?: HTMLDivElement
    onDragStartT?: DragManager.DragHandler;
    onDragMoveT?: DragManager.DragHandler;
    onDragEndT?: DragManager.DragHandler;
    onDragOverT?: DragManager.DragHandler;
    onDragLeaveT?: DragManager.DragHandler;
    /**
     * Anything returned by onDropT will be stored in DragState.dropped
     * return false to indicate the drop is canceled
     */
    onDropT?: DragManager.DropHandler;
    /**
     * by default onDragStartT will be called on first drag move
     * but if directDragT is true, onDragStartT will be called as soon as mouse is down
     */
    directDragT?: boolean;
    useRightButtonDragT?: boolean;

    onGestureStartT?: (state: GestureState) => boolean;
    onGestureMoveT?: (state: GestureState) => void;
    onGestureEndT?: () => void;

    gestureSensitivity?: number;
  }

</script>
<script lang="ts">

  let {ref=$bindable(),directDragT,class:className, children,...restProps}:DragDropDivProps = $props()
  let waitingMove = $state()
  let dragType = $state()
  let divState = $state()
  let baseX = $state()
  let baseY = $state()
  let scaleX = $state()
  let scaleY = $state()


  onpointerdown = (e:AbstractPointerEvent) => {

  }
  onmousedown = (e:MouseEvent) => onpointerdown(e);
  
  ontouchstart = (e:TouchEvent) => onpointerdown(e);
    
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div bind:this={ref} class={className} {...restProps} {onmousedown} {ontouchstart}>
    {@render children?.()}
</div>
