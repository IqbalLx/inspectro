import { writable } from 'svelte/store';

import type { HTTPRequest } from '../entities/httpRequest.entity';
import type { HTTPResponse } from '../entities/httpResponse.entity';

export const requests = writable<HTTPRequest[]>([]);
export const responses = writable<HTTPResponse[]>([]);

export function loadDummyrequest() {
	requests.set([
		{
			id: '1',
			url: 'http://a.com',
			method: 'GET',
			headers: {
				Authorization: 'Bearer something'
			},
			query: {
				page: 1,
				limit: 10
			},
			body: {},
			date: new Date()
		},
		{
			id: '2',
			url: 'http://a.com',
			method: 'POST',
			headers: {
				Authorization: 'Bearer something'
			},
			query: {
				page: 1,
				limit: 10
			},
			body: {},
			date: new Date()
		},
		{
			id: '3',
			url: 'http://a.com',
			method: 'PUT',
			headers: {
				Authorization: 'Bearer something'
			},
			query: {
				page: 1,
				limit: 10
			},
			body: {},
			date: new Date()
		},
		{
			id: '4',
			url: 'http://a.com',
			method: 'PATCH',
			headers: {
				Authorization: 'Bearer something'
			},
			query: {
				page: 1,
				limit: 10
			},
			body: {},
			date: new Date()
		},
		{
			id: '5',
			url: 'http://a.com',
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer something'
			},
			query: {
				page: 1,
				limit: 10
			},
			body: {},
			date: new Date()
		}
	]);
}

export function loadDummyResponse() {
	const now = new Date();
	now.setMilliseconds(now.getMilliseconds() + 100);
	responses.set([
		{
			requestId: '1',
			statusCode: 200,
			statusText: 'OK',
			time: 121.2,
			headers: {
				Authorization: 'Bearer something'
			},
			body: {
				id: '4',
				url: 'http://a.com',
				method: 'GET',
				headers: {
					Authorization: 'Bearer something'
				},
				query: {
					page: 1,
					limit: 10
				},
				body: {
					number: [{ hellpo: 'world' }, 2, 3, 4, 5, 6, 7, 8]
				},
				date: new Date()
			},
			date: now
		}
	]);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function getRequest(fetch: Function): Promise<void> {
	const response = await fetch('/stream/request', {
		method: 'GET'
	});
	const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const { value, done } = await reader.read();
		console.log('resp', done, value);
		if (done) break;

		console.debug(value);
	}
}
