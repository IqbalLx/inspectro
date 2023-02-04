import type { HTTPRequest } from 'entities/httpRequest.entity';
import type { HTTPResponse } from 'entities/httpResponse.entity';
import { httpEvent } from '../../services/httpEventEmitter';

function createCallback<T extends HTTPRequest | HTTPResponse>(
	ctr: ReadableStreamDefaultController
) {
	return (val: T) => ctr.enqueue(`data: ${JSON.stringify(val)}\n\n`);
}

export function sentEvent(type: 'request' | 'response'): Response {
	const ac = new AbortController();

	let callback: (val: HTTPRequest | HTTPResponse) => void;
	httpEvent.on(type, (val: HTTPRequest | HTTPResponse) => callback(val));

	const readable = new ReadableStream({
		start(ctr) {
			console.debug(`${type} stream start`);

			callback = createCallback(ctr);
		},
		cancel() {
			console.debug(`${type} stream cancel`);

			httpEvent.off(type, callback);
			ac.abort();
		}
	});

	return new Response(readable, {
		headers: {
			'content-type': 'text/event-stream',
			'Cache-control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
}
