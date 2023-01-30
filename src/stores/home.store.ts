import type { HTTPRequest } from 'entities/httpRequest.entity';
import { writable } from 'svelte/store';

export const selectedRequest = writable<HTTPRequest | undefined>();
export const baseURL = writable<string | undefined>();

// eslint-disable-next-line @typescript-eslint/ban-types
export async function setBaseUrl(fetch: Function, baseUrl: string): Promise<void> {
	await fetch('/api', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			base_url: baseUrl
		})
	});
}
