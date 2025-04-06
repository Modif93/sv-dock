<script lang="ts">
  import DragDropDiv from './dragdrop/DragDropDiv.svelte';

  const { onDragStart, onDragMove, onDragEnd, TabNavList, isMaximized, ...restProps } = $props();

  const layout = React.useContext(DockContextType);

  const ref = React.useRef<HTMLDivElement>();
  const getRef = (div: HTMLDivElement) => {
    ref.current = div;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.startsWith('Arrow')) {
      if (!checkLocalTabMove(e.key, ref.current) && !isMaximized) {
        layout.navigateToPanel(ref.current, e.key);
      }
      e.stopPropagation();
      e.preventDefault();
    }
  };
</script>

<DragDropDiv
  onDragStartT={onDragStart}
  onDragMoveT={onDragMove}
  onDragEndT={onDragEnd}
  role="tablist"
  className="dock-bar"
  {onKeyDown}
  {getRef}
  tabIndex={-1}
>
  <TabNavList {...restProps} />
</DragDropDiv>
