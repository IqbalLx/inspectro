import { error, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import type { HTTPRequest } from 'entities/httpRequest.entity';
import { replayService } from '../../../services';
import { streamToArrayBuffer, decodeBuffer } from '../../../utils/server.util';

export const POST: RequestHandler = async (event: RequestEvent) => {
	if (event.request.body !== null) {
		try {
			const buffer = await streamToArrayBuffer(event.request.body);
			const contentType = event.request.headers.get('Content-Type');
			if (contentType === null) throw error(422, `unsupported Content-Type: ${contentType}`);
			const httpRequest = decodeBuffer(buffer, contentType) as HTTPRequest;

			return replayService.replay(httpRequest);
		} catch (err) {
			throw error(422, (err as Error).message);
		}
	}

	throw error(422, "body can't be empty");
};
