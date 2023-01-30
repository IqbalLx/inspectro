<script lang="ts">
	import '@picocss/pico';
	import Footer from 'components/commons/Footer.svelte';
	import Nav from 'components/commons/Nav.svelte';
</script>

<Nav />

<main class="container">
	<slot />
</main>

<Footer />
