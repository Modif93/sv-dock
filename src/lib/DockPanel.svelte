<script lang="ts">
  import { Pane } from 'paneforge';
  import type { PanelData } from './dock-data.js';
  import DockTabs from './DockTabs.svelte';

  type DockPanelProps = {
    panelData: PanelData;
    onPanelEmpty: () => void;
  };
  let { panelData = $bindable(), onPanelEmpty }: DockPanelProps = $props();

  function handleTabEmpty() {
    // console.log('panel is Empty');
    onPanelEmpty();
  }
</script>

<Pane defaultSize={panelData.size} minSize={10}>
  <DockTabs bind:tabs={panelData.tabs} onTabEmpty={() => handleTabEmpty()} />
</Pane>
