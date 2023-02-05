<script lang="ts">
	import type { HTTPResponse } from 'entities/httpResponse.entity';

	export let response: HTTPResponse;
</script>

<section id="accordion">
	<details open>
		<summary><strong>Response Headers</strong></summary>
		<table role="grid">
			<thead>
				<th scope="col">Key</th>
				<th scope="col">Value</th>
			</thead>
			<tbody>
				{#each Object.entries(response.headers) as [key, value]}
					<tr>
						<th scope="row"><b>{key}</b></th>
						<td>{value}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</details>
</section>

<style>
	section {
		margin: 0;
	}
	section table tbody tr td {
		max-width: 400px;
	}
</style>
