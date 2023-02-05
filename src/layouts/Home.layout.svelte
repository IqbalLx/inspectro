<script lang="ts">
	import RequestCard from 'components/home/RequestCard.svelte';
	import JsonView from 'components/commons/JSONView.svelte';
	import RequestListHeader from 'components/home/RequestSectionHeader.svelte';
	import ResponseHeadersTable from 'components/home/ResponseHeadersTable.svelte';
	import ResponseSectionHeader from 'components/home/ResponseSectionHeader.svelte';

	import type { HTTPResponse } from 'entities/httpResponse.entity';

	import { requests, responses, filteredRequests } from 'stores/http.store';
	import { selectedRequest, baseURL, setBaseUrl, getBaseUrl } from 'stores/home.store';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let response: HTTPResponse | undefined;

	let inputBaseUrlMessage = 'Your Base URL seems empty. Enter valid URL then press set';
	let baseUrlState: 'error' | 'neutral' | 'set' = 'neutral';
	let inputInvalidValue: 'true' | 'false' | null = null;
	let baseUrlSubmitting = false;

	$: {
		switch (baseUrlState) {
			case 'neutral':
				inputInvalidValue = null;
				break;

			case 'error':
				inputInvalidValue = 'true';
				break;

			case 'set':
				inputInvalidValue = 'false';
				break;

			default:
				inputInvalidValue = null;
				break;
		}

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

	function isValidURL(url: string) {
		const regex = /^(https?:\/\/)([\da-z\.-]+)(?::(\d+))?(\/[\w \.-]*)*\/?$/;
		return regex.test(url);
	}

	async function doSetBaseUrl() {
		if ($baseURL === undefined || $baseURL === '') {
			inputBaseUrlMessage = "You haven't typed any base URL yet";
			baseUrlState = 'error';
			return;
		}

		if (!isValidURL($baseURL)) {
			inputBaseUrlMessage = 'Please input valid base URL';
			baseUrlState = 'error';
			return;
		}

		try {
			baseUrlSubmitting = true;
			await setBaseUrl(fetch, $baseURL);
			baseUrlSubmitting = false;

			inputBaseUrlMessage = 'Base URL settled. Try making request to /proxy';
			baseUrlState = 'set';
			return;
		} catch (error) {
			inputBaseUrlMessage = 'Something wrong happened';
			baseUrlState = 'error';
			return;
		}
	}

	onMount(async () => {
		baseUrlSubmitting = true;
		const savedBaseUrl = await getBaseUrl(fetch);
		baseUrlSubmitting = false;
		if (savedBaseUrl !== undefined) {
			baseURL.set(savedBaseUrl);

			inputBaseUrlMessage = 'Base URL settled. Try making request to /proxy';
			baseUrlState = 'set';
		}

		getRequestsStream();
		getResponseStream();
	});
</script>

<div class="container">
	<div class="baseUrl">
		<label for="search">Base URL</label>
		<span class="input">
			<input
				aria-busy={baseUrlSubmitting ? 'true' : 'false'}
				aria-invalid={inputInvalidValue}
				type="text"
				id="text"
				name="text"
				placeholder="http://localhost:3000"
				bind:value={$baseURL}
			/>
			<small>{inputBaseUrlMessage}</small>
		</span>
		<a href="#" role="button" on:click={doSetBaseUrl}>Set!</a>
	</div>
	<div class="grid">
		<section class="request">
			<RequestListHeader />
			<div class="container">
				{#if $filteredRequests.length === 0}
					<article aria-busy="true">Waiting for a request ...</article>
				{:else}
					<table class="requestTable">
						{#each $filteredRequests as request}
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
		justify-items: center;
		align-items: flex-start;
		gap: 20px;
	}

	.baseUrl label {
		margin-top: 20px;
	}

	.baseUrl input {
		width: 500px;
		margin: 0;
	}

	.baseUrl .input {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	section {
		margin: 30px 0px;
	}
	.response {
		display: flex;
		flex-direction: column;
		row-gap: 20px;
		justify-content: flex-start;
		align-content: flex-start;
	}

	.response .container {
		display: flex;
		gap: 20px;
		max-height: 100vh;
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
		max-height: 100vh;
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
