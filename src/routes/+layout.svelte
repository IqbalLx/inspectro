<script lang="ts">
	import '@picocss/pico';
	import Footer from 'components/commons/Footer.svelte';
	import Nav from 'components/commons/Nav.svelte';
</script>

<main class="container">
	<section>
		<section>
			<Nav />
		</section>

		<slot />
	</section>

	<section>
		<Footer />
	</section>
</main>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100vh;
	}
</style>
