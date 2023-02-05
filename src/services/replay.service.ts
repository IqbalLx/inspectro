import { error } from '@sveltejs/kit';
import type { HTTPRequest } from 'entities/httpRequest.entity';

class ReplayService {
	async replay(request: HTTPRequest) {
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
			await fetch(request.proxyUrl, reqInit);
		} catch (err) {
			throw error(500, (err as Error).message);
			/* ignoring http error */
		}

		return new Response(
			JSON.stringify({
				message: 'success replay request'
			}),
			{ status: 200 }
		);
	}
}

export { ReplayService };
