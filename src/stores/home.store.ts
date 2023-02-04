import type { HTTPRequest } from 'entities/httpRequest.entity';
import { writable } from 'svelte/store';

export const selectedRequest = writable<HTTPRequest | undefined>();
export const baseURL = writable<string | undefined>();

export async function setBaseUrl(
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	baseUrl: string
): Promise<void> {
	await fetch('/api/base_url', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			base_url: baseUrl
		})
	});
}

export async function getBaseUrl(
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
	const res = await fetch('/api/base_url', { method: 'GET' });
	if (res.status === 200) {
		const json = (await res.json()) as { message: { base_url: string } };

		console.log(json);
		baseURL.set(json.message.base_url);
	}
}
