import type { HTTPRequest } from 'entities/httpRequest.entity';
import type { HTTPResponse } from 'entities/httpResponse.entity';
import { httpEvent } from '../../services/httpEventEmitter';

export function sentEvent(type: 'request' | 'response', ac: AbortController): Response {
	const readable = new ReadableStream({
		start(ctr) {
			httpEvent.on(type, (val: HTTPRequest | HTTPResponse) =>
				ctr.enqueue(`data: ${JSON.stringify(val)}\n\n`)
			);
		},
		cancel() {
			console.debug('request cancel');
			ac.abort();
		}
	});

	return new Response(readable, {
		headers: {
			'content-type': 'text/event-stream'
		}
	});
}
