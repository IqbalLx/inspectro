<script lang="ts">
	import RequestCard from 'components/home/RequestCard.svelte';
	import JsonView from 'components/commons/JSONView.svelte';
	import RequestListHeader from 'components/home/RequestSectionHeader.svelte';
	import ResponseHeadersTable from 'components/home/ResponseHeadersTable.svelte';
	import ResponseSectionHeader from 'components/home/ResponseSectionHeader.svelte';

	import type { HTTPResponse } from 'entities/httpResponse.entity';

	import {
		requests,
		responses,
		loadDummyrequest,
		loadDummyResponse,
		getRequest
	} from 'stores/http.store';
	import { selectedRequest, setBaseUrl } from 'stores/home.store';
	import { baseURL } from 'stores/home.store';
	import { browser } from '$app/environment';

	let response: HTTPResponse | undefined;

	$: {
		if ($selectedRequest !== undefined) {
			response = $responses.filter((response) => response.requestId === $selectedRequest?.id)[0];
		} else {
			response = undefined;
		}
	}

	async function getRequests() {
		const eventSource = new EventSource('/stream/request');

		eventSource.onmessage = (event) => {
			requests.update((arr) => {
				arr.push(JSON.parse(event.data));
				return arr;
			});
		};

		eventSource.onerror = (error) => {
			console.error(error);
		};
	}

	async function getResponse() {
		const eventSource = new EventSource('/stream/response');

		eventSource.onmessage = (event) => {
			responses.update((arr) => {
				arr.push(JSON.parse(event.data));
				return arr;
			});
		};

		eventSource.onerror = (error) => {
			console.error(error);
		};
	}

	if (browser) {
		getRequests();
		getResponse();
	}
</script>

<div class="container">
	<div class="baseUrl">
		<label for="search">Base URL</label>
		<input type="text" id="text" name="text" placeholder="localhost:3000" bind:value={$baseURL} />
		<a href="#" role="button" on:click={() => setBaseUrl(fetch, $baseURL)}>Set!</a>
	</div>
	<div class="grid">
		<section class="request">
			<RequestListHeader />
			<div class="container">
				{#if $requests.length === 0}
					<article aria-busy="true">Waiting for a request ...</article>
				{:else}
					<table>
						{#each $requests as request}
							<tr><RequestCard {request} /></tr>
						{/each}
					</table>
				{/if}
			</div>
		</section>
		<section class="response">
			{#if $selectedRequest !== undefined}
				{#if response === undefined}
					<article aria-busy="true">Waiting for response ...</article>
				{:else}
					<ResponseSectionHeader {response} request={$selectedRequest} />

					<ResponseHeadersTable {response} />

					<article>
						<JsonView json={response.body} />
					</article>
				{/if}
			{/if}
		</section>
	</div>
</div>

<button on:click={loadDummyrequest}>Test</button>
<button on:click={loadDummyResponse}>Test Resp</button>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 30px;
		margin-top: 20px;
	}

	.baseUrl {
		display: flex;
		justify-content: center;
		justify-items: flex-start;
		align-items: center;
		gap: 20px;
	}

	.baseUrl input {
		width: 500px;
		margin: 0;
	}

	section {
		margin: 30px 0px;
	}
	.response {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		row-gap: 50px;
	}

	.request {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		row-gap: 50px;
	}

	article {
		margin: 0;
	}
</style>
