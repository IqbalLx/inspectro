<script lang="ts">
	import type { HTTPResponse } from 'entities/httpResponse.entity';

	export let response: HTTPResponse;
</script>

<div class="container">
	<table>
		<thead>
			<th scope="col">Headers</th>
			<th scope="col" />
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
</div>
