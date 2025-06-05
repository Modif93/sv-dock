<script lang="ts" module>
  import { type VariantProps, tv } from 'tailwind-variants';
  import type { WithElementRef } from 'bits-ui';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  export const handleVariants = tv({
    base: ' absolute z-300 bg-teal-500',
    variants: {
      position: {
        header: 'cursor-move top-1 left-1 right-1 h-5',
        top: 'cursor-ns-resize -top-1 left-1 right-1 h-2',
        bottom: 'cursor-ns-resize -bottom-1 left-1 right-1 h-2',
        left: 'cursor-ew-resize top-1 -left-1 bottom-1 w-2',
        right: 'cursor-ew-resize top-1 bottom-1 -right-1 w-2',
        'top-left': 'cursor-nwse-resize -top-1 -left-1 w-2 h-2',
        'top-right': 'cursor-nesw-resize -top-1 -right-1 w-2 h-2',
        'bottom-left': 'cursor-nesw-resize -bottom-1 -left-1 w-2 h-2',
        'bottom-right': 'cursor-nwse-resize -bottom-1 -right-1 w-2 h-2'
      }
    }
  });
  export type HandlePosition = VariantProps<typeof handleVariants>['position'];
  export type DragDropProps = WithElementRef<HTMLButtonAttributes> & {
    position: HandlePosition;
    onmousedrag: (e: MouseEvent, position: HandlePosition) => void;
  };

</script>

<script lang="ts">
  import { cn } from '../manager';

  let { position, onmousedrag }: DragDropProps = $props();

  let isDragging = $state(false);

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleMouseUp(e: MouseEvent) {
    isDragging = false;
  }
  function handleMouseOut(e: MouseEvent) {
    if (!e.relatedTarget) {
      isDragging = false;
    }
  }
  function handleMouseMove(e: MouseEvent) {
    if (isDragging) {
      onmousedrag(e, position);
    }
  }

  $effect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      // window.addEventListener('mouseout', handleMouseOut);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      // window.removeEventListener('mouseout', handleMouseOut);
    };
  });
</script>

<button
  aria-label="handle"
  class={cn(handleVariants({ position }))}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
>
</button>
