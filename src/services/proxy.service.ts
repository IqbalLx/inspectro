import { error, type RequestEvent } from '@sveltejs/kit';
import type { HTTPRequest } from 'entities/httpRequest.entity';
import type { HTTPResponse } from 'entities/httpResponse.entity';
import { v4 as generateUUID } from 'uuid';
import type { BaseURLRepository } from '../repository/baseUrl.repository';
import { streamToArrayBuffer, decodeBuffer, getHeaders, getQuery } from '../utils/server.util';
import type { HTTPEvent } from './httpEventEmitter';

class ProxyService {
	private proxyPath = '/proxy';
	private baseUrlRepo: BaseURLRepository;

	private httpEvent: HTTPEvent;

	constructor(baseUrlRepo: BaseURLRepository, httpEvent: HTTPEvent) {
		this.baseUrlRepo = baseUrlRepo;
		this.httpEvent = httpEvent;
	}

	getProxyPath(): string {
		return this.proxyPath;
	}

	async handle(event: RequestEvent): Promise<Response> {
		const baseUrl = this.baseUrlRepo.getBaseUrl();
		if (baseUrl === undefined) throw error(403, 'base url to be proxied not set');

		const strippedPath = event.url.pathname.substring(this.proxyPath.length);

		// build the new URL path with your API base URL, the stripped path and the query string
		const urlPath = `${baseUrl}${strippedPath}${event.url.search}`;
		const destUrl = new URL(urlPath);

		const requestId = generateUUID();

		const requestClone = event.request.clone();

		// make body
		let requestBody = {};
		if (requestClone.body !== null) {
			try {
				const buffer = await streamToArrayBuffer(requestClone.body);
				const contentType = requestClone.headers.get('Content-Type');
				if (contentType === null) throw error(422, `unsupported Content-Type: ${contentType}`);
				requestBody = decodeBuffer(buffer, contentType);
			} catch (err) {
				throw error(422, (err as Error).message);
			}
		}

		const startDate = new Date();
		const request: HTTPRequest = {
			id: requestId,
			url: destUrl.toString(),
			proxyUrl: event.url.toString(),
			body: requestBody,
			method: requestClone.method,
			headers: getHeaders(requestClone.headers),
			query: getQuery(destUrl.searchParams),
			date: startDate
		};
		this.httpEvent.emit('request', request);

		// make response
		let responseProxy: Response;
		try {
			responseProxy = await fetch(destUrl.toString(), event.request);
		} catch (error) {
			responseProxy = new Response('Cant proxied request', {
				status: 406
			});
		}

		const endDate = new Date();
		const responseTime = Math.round(endDate.getTime() - startDate.getTime());

		const responseClone = responseProxy.clone();

		let responseBody = {};
		try {
			responseBody = await responseClone.json();
		} catch (error) {
			responseBody = {};
		}
		const response: HTTPResponse = {
			requestId,
			statusCode: responseClone.status,
			statusText: responseClone.statusText,
			time: responseTime,
			headers: {
				...getHeaders(responseClone.headers),
				'x-inspectro-request-id': requestId
			},
			body: responseBody,
			date: endDate
		};
		this.httpEvent.emit('response', response);

		return responseProxy;
	}
}

export { ProxyService };
