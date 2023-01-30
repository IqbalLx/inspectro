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
		const proxiedUrl = new URL(urlPath);

		const requestId = generateUUID();

		// make body
		let requestBody = {};
		if (event.request.body !== null) {
			try {
				const buffer = await streamToArrayBuffer(event.request.body);
				const contentType = event.request.headers.get('Content-Type');
				if (contentType === null) throw error(422, `unsupported Content-Type: ${contentType}`);
				requestBody = decodeBuffer(buffer, contentType);
			} catch (err) {
				throw error(422, (err as Error).message);
			}
		}

		const startDate = new Date();
		const request: HTTPRequest = {
			id: requestId,
			url: proxiedUrl.toString(),
			body: requestBody,
			method: event.request.method,
			headers: getHeaders(event.request.headers),
			query: getQuery(proxiedUrl.searchParams),
			date: startDate
		};
		this.httpEvent.emit('request', request);

		// make response
		let responseProxy: Response;
		try {
			responseProxy = await fetch(proxiedUrl.toString(), {
				// propagate the request method and body
				method: event.request.method,
				headers: event.request.headers,
				body: ['GET', 'HEAD'].includes(request.method) ? undefined : JSON.stringify(request.body)
			});

			console.debug(responseProxy.status);
		} catch (error) {
			console.debug(error);
			responseProxy = new Response('Cant proxied request', {
				status: 406
			});
		}

		const endDate = new Date();
		const responseTime = Math.round(endDate.getTime() - startDate.getTime());

		let responseBody = {};
		try {
			responseBody = await responseProxy.json();
		} catch (error) {
			responseBody = {};
		}
		const response: HTTPResponse = {
			requestId,
			statusCode: responseProxy.status,
			statusText: responseProxy.statusText,
			time: responseTime,
			headers: getHeaders(responseProxy.headers),
			body: responseBody,
			date: endDate
		};
		this.httpEvent.emit('response', response);

		return new Response(JSON.stringify(response.body), {
			headers: {
				...response.headers,
				'X-Inspectro-Request-ID': requestId
			}
		});
	}
}

export { ProxyService };