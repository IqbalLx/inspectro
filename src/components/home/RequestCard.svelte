<script lang="ts">
	import type { HTTPRequest } from 'entities/httpRequest.entity';
	import type { HTTPResponse } from 'entities/httpResponse.entity';

	import { responses } from 'stores/http.store';
	import { selectedRequest } from 'stores/home.store';

	export let request: HTTPRequest;

	let isCompleted = false;
	let correspondingResponse: HTTPResponse | undefined = undefined;
	$: {
		correspondingResponse = $responses.find((response) => response.requestId === request.id);
		if (correspondingResponse) isCompleted = true;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class:selected={request.id === $selectedRequest?.id}
	class="container"
	on:click={() => selectedRequest.set(request)}
>
	<p class:completed={isCompleted}>
		<span
			class="method {request.method.toLocaleLowerCase()}"
			class:selected={request.id === $selectedRequest?.id}><strong>{request.method}</strong></span
		>
		to {request.url}
	</p>

	{#if !isCompleted}
		<p aria-busy="true" />
	{:else}
		<p>{correspondingResponse?.statusCode}</p>
	{/if}
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
		cursor: pointer;
		margin-bottom: 10px;
		border-radius: 5px;
	}

	.container p {
		margin: 0;
		padding: 10px;
	}

	.selected {
		background-color: #2894c0;
	}

	.selected p {
		color: white;
	}

	.method.get {
		color: #00ff7f;
	}

	.method.post {
		color: #ffd700;
	}

	.method.put {
		color: #87ceeb;
	}

	.method.patch {
		color: #a9a9a9;
	}

	.method.patch.selected {
		color: #423c3c;
	}

	.method.delete {
		color: #ff7a7a;
	}

	.method.delete.selected {
		color: #f53333;
	}
</style>
