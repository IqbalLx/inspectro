<script lang="ts">
	import { browser } from '$app/environment';

	let isDarkMode = false;

	const savedThemeKey = 'inspectroTheme';
	if (browser) {
		const savedTheme = window.localStorage.getItem(savedThemeKey);
		if (savedTheme !== null) {
			isDarkMode = savedTheme === 'dark';
		} else {
			isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
	}

	$: {
		if (browser) {
			document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
			window.localStorage.setItem(savedThemeKey, isDarkMode ? 'dark' : 'light');
		}
	}
</script>

<div class="container">
	<input type="checkbox" role="switch" bind:checked={isDarkMode} />
	<p>Turn {isDarkMode ? 'off' : 'on'} dark mode</p>
</div>

<style>
	.container {
		width: fit-content;
		display: flex;
		align-items: center;
		padding: 0;
		margin: 0;
		margin-bottom: 30px;
	}

	.container p {
		margin: 0;
	}
</style>
