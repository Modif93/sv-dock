<script lang="ts">
  import { isBoxData, isPanelData, type BoxData, type PanelData } from './dock-data.js';
  import { PaneGroup, Pane, PaneResizer } from 'paneforge';
  import DockBox from './DockBox.svelte';
  import DockPanel from './DockPanel.svelte';

  type DockBoxProps = {
    boxData: BoxData;
  };
  let { boxData = $bindable() }: DockBoxProps = $props();
  let dockId = $props.id();

  let ref = $state(null);
  function handlePanelEmpty(i: number) {
    if (isPanelData(boxData.children[i])) {
      console.log('panel is empty');
      const arr = boxData.children;
      boxData.children = arr.filter(function (_, index) {
        // filter 안에 인자로 함수를 받고, index 만 필요하니 명시해주자
        return index !== i; // 배열을 돌며 인덱스1 이 아닌 나머지만 다시 소집한다
      });
    }
  }
  $effect(() => {
    console.log($inspect(ref));
  });
</script>

<PaneGroup bind:this={ref} data-pane-group="group-{dockId}" direction={boxData.mode}>
  {#each boxData.children as _child, i}
    {#if i > 0}
      <PaneResizer
        class="w-1 bg-gray-200 data-[direction=vertical]:h-1 data-[direction=vertical]:w-full "
      />
    {/if}

    {#if isPanelData(boxData.children[i])}
      <DockPanel bind:panelData={boxData.children[i]} onPanelEmpty={() => handlePanelEmpty(i)} />
    {:else if isBoxData(boxData.children[i])}
      <Pane defaultSize={boxData.children[i].size} minSize={10}>
        <DockBox bind:boxData={boxData.children[i]} />
      </Pane>
    {/if}
  {/each}
</PaneGroup>
