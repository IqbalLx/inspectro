<script lang="ts">
	import ThemeSwitcher from 'components/commons/ThemeSwitcher.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="container">
	<p>
		Hey it's {year}, check our blog
		<a href="https://www.mbts.dev" target="_blank" rel="noreferrer">here!</a>
	</p>
	<ThemeSwitcher />
</footer>

<style>
	.container {
		display: flex;
		justify-content: space-between;
	}

	.container p {
		margin: 0;
	}
</style>
