import type { HTTPRequest } from 'entities/httpRequest.entity';
import type { HTTPResponse } from 'entities/httpResponse.entity';
import { v4 as generateUUID } from 'uuid';
import { getHeaders } from '../utils/server.util';
import type { HTTPEvent } from './httpEventEmitter';

class ReplayService {
	private httpEvent: HTTPEvent;

	constructor(httpEvent: HTTPEvent) {
		this.httpEvent = httpEvent;
	}

	async replay(request: HTTPRequest) {
		const { id, ...restRequest } = request;

		const newRequestId = generateUUID();

		const startDate = new Date();
		const newRequest: HTTPRequest = {
			id: newRequestId,
			...restRequest
		};
		this.httpEvent.emit('request', newRequest);

		let responseProxy: Response;
		try {
			if (Object.prototype.hasOwnProperty.call(request.headers, 'content-length'))
				delete request.headers['content-length'];

			const reqInit: RequestInit = {
				headers: request.headers as HeadersInit,
				method: request.method
			};
			if (!['HEAD', 'GET'].includes(request.method)) {
				reqInit.body = JSON.stringify(request.body);
			}
			responseProxy = await fetch(request.url, reqInit);
		} catch (err) {
			responseProxy = new Response(`error occured when replaying request with id: ${id}`, {
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
			requestId: newRequestId,
			statusCode: responseClone.status,
			statusText: responseClone.statusText,
			time: responseTime,
			headers: {
				...getHeaders(responseClone.headers),
				'x-inspectro-request-id': newRequestId
			},
			body: responseBody,
			date: endDate
		};
		this.httpEvent.emit('response', response);

		return new Response(
			JSON.stringify({
				message: 'success replay request'
			}),
			{ status: 200 }
		);
	}
}

export { ReplayService };
