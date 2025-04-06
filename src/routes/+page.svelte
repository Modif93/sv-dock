<script>
  // import DockLayout from "$lib/DockLayout.svelte";
  import '../rc-dock.css';
  import DragDropDiv from '$lib/dragdrop/DragDropDiv.svelte';
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div class="container">
  <DragDropDiv class="dock-panel-drag-size dock-panel-drag-size-t" />
</div>
