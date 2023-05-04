<script>
	import '../app.css';
	import Navbar from './navbar.svelte';
</script>

<div class="max-w-7xl mx-auto">
	<Navbar data />
	<slot />
</div>
