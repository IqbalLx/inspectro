<script lang="ts">
	import { requests, filteredRequests } from 'stores/http.store';
	import { selectedRequest } from 'stores/home.store';

	const clearRequest = () => {
		requests.set([]);
		filteredRequests.set([]);
		selectedRequest.set(undefined);
	};

	let requestSearchTerm: string | undefined = undefined;
	let isSearchBarEmpty = true;

	requests.subscribe((value) => {
		filteredRequests.set(value);
	});

	$: {
		isSearchBarEmpty = requestSearchTerm === undefined || requestSearchTerm === '';
		if (!isSearchBarEmpty) {
			const searchRegex = new RegExp(`.*${requestSearchTerm}.*`, 'i');
			const filteredReqs = $requests.filter((request) => searchRegex.test(request.url));
			filteredRequests.set(filteredReqs);
		} else {
			filteredRequests.set($requests);
		}
	}
</script>

<div class="container">
	<div class="header">
		<h2>Incoming Request</h2>
		<a href="#" role="button" class="outline" on:click={clearRequest}>Clear</a>
	</div>
	<div class="search">
		<input type="search" placeholder="Filter Requests" bind:value={requestSearchTerm} />
		<a
			class:non-clickable={isSearchBarEmpty}
			on:click={() => (requestSearchTerm = undefined)}
			href="#"><small>Delete</small></a
		>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		margin-top: 10px;
	}

	.header h2 {
		margin: 0;
	}

	.search {
		display: flex;
		gap: 20px;
		align-items: center;
		justify-content: space-between;
		width: auto;
	}

	.search input {
		margin: 0;
	}

	.non-clickable {
		pointer-events: none;
		cursor: default;
		color: gray;
	}
</style>
