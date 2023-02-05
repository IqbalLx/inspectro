<script lang="ts">
	import type { HTTPRequest } from 'entities/httpRequest.entity';
	import type { HTTPResponse } from 'entities/httpResponse.entity';

	export let request: HTTPRequest;
	export let response: HTTPResponse;

	let isReplaying = false;

	async function doReplayRequest() {
		try {
			isReplaying = true;
			await fetch('/api/replay', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(request)
			});
			isReplaying = false;
		} catch (error) {
			alert(`Error occured when trying to replay request. ${error}`);
		}
	}
</script>

<div class="container">
	<div>
		<p><span class="statusCode">{response.statusCode} {response.statusText}</span></p>
		<p>
			{response.statusCode >= 200 && response.statusCode < 400 ? 'Success' : 'Failed'} after {response.time}ms
		</p>
	</div>

	<a
		href="#"
		role="button"
		class:disable={isReplaying}
		aria-busy={isReplaying ? 'true' : 'false'}
		aria-invalid="true"
		on:click={doReplayRequest}>{isReplaying ? '' : 'Replay'}</a
	>
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.container p {
		margin: 0;
	}

	.statusCode {
		font-size: 32px;
	}
</style>
