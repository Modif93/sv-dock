<script lang="ts" module>
  import { tv } from 'tailwind-variants';

  const handleVariant = tv({
    base: 'absolute',
    variants: {
      pos: {
        w: 'w-1 top-1 bottom-1 left-0 cursor-ew-resize',
        e: 'w-1 top-1 bottom-1 right-0 cursor-ew-resize',
        n: 'left-1 right-1 h-1  top-0 cursor-ns-resize',
        s: 'left-1 right-1 h-1  bottom-0 cursor-ns-resize',
        nw: 'left-0 top-0 w-1 h-1 cursor-nwse-resize',
        ne: 'w-1 h-1 top-0 right-0 cursor-nesw-resize',
        sw: 'left-0 bottom-0 w-1 h-1 cursor-nesw-resize',
        se: 'right-0 bottom-0 w-1 h-1 cursor-nwse-resize'
      }
    }
  });
</script>

<script lang="ts">
  import type { HandlePosition } from '$lib/dockData.js';
  import { cn } from '$lib/utils.js';

  type ResizeHandleProps = {
    pos: HandlePosition;
    handleClicked: (e: MouseEvent, pos: HandlePosition) => void;
  };
  let { pos, handleClicked }: ResizeHandleProps = $props();
</script>

<button
  aria-label="handle"
  onmousedown={(e) => handleClicked(e, pos)}
  class={cn(handleVariant({ pos }))}
></button>
