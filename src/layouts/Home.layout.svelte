<script lang="ts">
	import RequestCard from 'components/home/RequestCard.svelte';
	import JsonView from 'components/commons/JSONView.svelte';
	import RequestListHeader from 'components/home/RequestSectionHeader.svelte';
	import ResponseHeadersTable from 'components/home/ResponseHeadersTable.svelte';
	import ResponseSectionHeader from 'components/home/ResponseSectionHeader.svelte';

	import type { HTTPResponse } from 'entities/httpResponse.entity';

	import { requests, responses } from 'stores/http.store';
	import { selectedRequest, setBaseUrl, getBaseUrl } from 'stores/home.store';
	import { baseURL } from 'stores/home.store';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';

	let response: HTTPResponse | undefined;

	$: {
		if ($selectedRequest !== undefined) {
			response = $responses.filter((response) => response.requestId === $selectedRequest?.id)[0];
		} else {
			response = undefined;
		}
	}

	async function getRequestsStream() {
		const eventSource = new EventSource('/stream/request');

		eventSource.onmessage = (event) => {
			const { date, ...restData } = JSON.parse(event.data);
			const parsed = {
				...restData,
				date: new Date(date)
			};
			requests.update((arr) => {
				arr.push(parsed);

				return arr;
			});
		};

		eventSource.onerror = (error) => {
			console.error(error);
		};
	}

	async function getResponseStream() {
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
		getRequestsStream();
		getResponseStream();
		getBaseUrl(fetch);
	}
</script>

<div class="container">
	<div class="baseUrl">
		<label for="search">Base URL</label>
		<input
			type="text"
			id="text"
			name="text"
			placeholder="http://localhost:3000"
			bind:value={$baseURL}
		/>
		<a href="#" role="button" on:click={() => setBaseUrl(fetch, $baseURL)}>Set!</a>
	</div>
	<div class="grid">
		<section class="request">
			<RequestListHeader />
			<div class="container">
				{#if $requests.length === 0}
					<article aria-busy="true">Waiting for a request ...</article>
				{:else}
					<table class="requestTable">
						{#each $requests as request}
							<tr transition:fly><RequestCard {request} /></tr>
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
					<div class="container">
						<ResponseHeadersTable {response} />

						<article>
							<JsonView json={response.body} />
						</article>
					</div>
				{/if}
			{/if}
		</section>
	</div>
</div>

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
		flex-direction: row;
		justify-content: space-evenly;
		row-gap: 50px;
		flex-wrap: wrap;
	}

	.response .container {
		max-height: 200vh;
		overflow-y: auto;
	}

	.request {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		row-gap: 20px;
	}

	.request .container {
		max-height: 200vh;
		overflow-y: auto;
	}

	article {
		margin: 0;
	}

	.requestTable {
		display: flex;
		flex-direction: column-reverse;
		gap: 5px;
		padding-right: 20px;
	}
</style>
