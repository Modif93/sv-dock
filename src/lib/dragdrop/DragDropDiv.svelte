<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as DragManager from './drag-manager';
  import { type GestureComponent, GestureState } from './gesture-manager';
  import type { DragDropComponent } from './drag-manager';
  import type { HTMLAttributes } from 'svelte/elements';

  interface DragDropDivProps extends HTMLAttributes<HTMLDivElement>{
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
    ref?: HTMLDivElement
  }
  let {
    onDragStartT,
    onDragOverT,
    onDragMoveT,
    onDragEndT,
    onDropT,
    directDragT = false,
    useRightButtonDragT = false,
    onGestureStartT,
    onGestureMoveT,
    onGestureEndT,
    class: className,
    children,
    ref = $bindable(),
    ...restProps
  }: DragDropDivProps = $props();

  let ownerDocument: Document;

  // const _getRef = (r: HTMLDivElement) => {
  //   if (r === ref) {
  //     return;
  //   }
  //   if (ref && onDragOverT) {
  //     DragManager.removeHandlers(ref);
  //   }
  //   if (r && onDragOverT) {
  //     DragManager.addHandlers(r,);
  //   }
  // };



  const handlePointerDown = (e: MouseEvent | TouchEvent) => {
    const nativeTarget = e.target as HTMLElement;
    if (
      nativeTarget instanceof HTMLInputElement ||
      nativeTarget instanceof HTMLTextAreaElement ||
      nativeTarget.classList.contains('drag-ignore')
    ) {
      return;
    }

    if (e.type === 'touchstart') {
      const touches = (e as TouchEvent).touches;
      if (touches.length === 1 && onDragStartT) {
        onDragStart(e);
      } else if (touches.length === 2 && onGestureStartT && onGestureMoveT) {
        onGestureStart(e as TouchEvent);
      }
    } else if (e.type === 'mousedown' && onDragStartT) {
      if ((e as MouseEvent).button === 2 && !useRightButtonDragT) {
        return;
      }
      onDragStart(e);
    }
  };

  function onDragStart(event: MouseEvent | TouchEvent) {
    if (DragManager.isDragging()) return;
    if(!ref) return;

    const component: DragDropComponent = {
      element: ref,
      ownerDocument,
      dragType: event.type.startsWith('touch') ? 'touch' : 'left',
      baseX: 0,
      baseY: 0,
      scaleX: 1,
      scaleY: 1
    };
    const state = new DragManager.DragState(event, component, true);

    const rect = ref.parentElement?.getBoundingClientRect();
    component.baseX = state.pageX;
    component.baseY = state.pageY;
    component.scaleX = (ref.parentElement?.offsetWidth || 1) / Math.round(rect?.width || 1);
    component.scaleY = (ref.parentElement?.offsetHeight || 1) / Math.round(rect?.height || 1);

    ownerDocument = ref.ownerDocument;

    const moveListener = (e: MouseEvent | TouchEvent) =>
      onDragMoveT?.(new DragManager.DragState(e, component));
    const endListener = (e: MouseEvent | TouchEvent) => {
      ownerDocument.removeEventListener('mousemove', moveListener);
      ownerDocument.removeEventListener('mouseup', endListener);
      ownerDocument.removeEventListener('touchmove', moveListener);
      ownerDocument.removeEventListener('touchend', endListener);
      onDragEndT?.(new DragManager.DragState(e, component));
    };

    if (directDragT) {
      onDragStartT?.(state);
    }

    if (event.type === 'touchstart') {
      ownerDocument.addEventListener('touchmove', moveListener);
      ownerDocument.addEventListener('touchend', endListener);
    } else {
      ownerDocument.addEventListener('mousemove', moveListener);
      ownerDocument.addEventListener('mouseup', endListener);
    }
  }

  let gestureState: GestureState | undefined;

  function onGestureStart(event: TouchEvent) {
    if (event.touches.length !== 2) return;
    if(!ref) return;

    const component:GestureComponent = {
      element: ref,
      dragType: 'touch',
      baseX: event.touches[0].pageX,
      baseY: event.touches[0].pageY,
      baseX2: event.touches[1].pageX,
      baseY2: event.touches[1].pageY,
      baseDis: Math.hypot(
        event.touches[1].pageX - event.touches[0].pageX,
        event.touches[1].pageY - event.touches[0].pageY
      ),
      baseAng: Math.atan2(
        event.touches[1].pageY - event.touches[0].pageY,
        event.touches[1].pageX - event.touches[0].pageX
      ),
      scaleX: 1,
      scaleY: 1
    };

    gestureState = new GestureState(event, component, true);

    const moveListener = (e: TouchEvent) => {
      gestureState = new GestureState(e, component);
      onGestureMoveT?.(gestureState);
    };
    const endListener = () => {
      ownerDocument.removeEventListener('touchmove', moveListener);
      ownerDocument.removeEventListener('touchend', endListener);
      onGestureEndT?.();
    };

    const shouldStart = onGestureStartT?.(gestureState);

    if (shouldStart) {
      ownerDocument.addEventListener('touchmove', moveListener);
      ownerDocument.addEventListener('touchend', endListener);
    }
  }


  onMount(() => {
    ref?.addEventListener('mousedown', handlePointerDown);
    ref?.addEventListener('touchstart', handlePointerDown);
  });


  onDestroy(() => {
    ref?.removeEventListener('mousedown', handlePointerDown);
    ref?.removeEventListener('touchstart', handlePointerDown);
    if (ref && onDragOverT) {
      DragManager.removeHandlers(ref);
    }

  });
</script>

<div bind:this={ref} class={className} {...restProps}>
  {@render children?.()}
</div>

