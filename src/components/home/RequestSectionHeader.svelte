<script lang="ts">
	import { requests } from 'stores/http.store';
	import { selectedRequest } from 'stores/home.store';

	const clearRequest = () => {
		requests.set([]);
		selectedRequest.set(undefined);
	};
</script>

<div class="container">
	<h2>Incoming Request</h2>
	<a href="#" role="button" class="outline" on:click={clearRequest}>Clear</a>
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		margin-top: 10px;
	}

	.container h2 {
		margin: 0;
	}
</style>
