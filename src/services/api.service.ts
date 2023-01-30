import { error, type RequestEvent } from '@sveltejs/kit';
import type { BaseURLRepository } from '../repository/baseUrl.repository';
import { decodeBuffer, streamToArrayBuffer } from '../utils/server.util';

class APIService {
	private baseUrlRepo: BaseURLRepository;

	constructor(baseUrlRepo: BaseURLRepository) {
		this.baseUrlRepo = baseUrlRepo;
	}

	async setBaseUrl(event: RequestEvent): Promise<Response> {
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

		if (!Object.prototype.hasOwnProperty.call(requestBody, 'base_url'))
			throw error(422, 'base_url not found');

		this.baseUrlRepo.setBaseUrl((requestBody as { base_url: string }).base_url);

		return new Response(JSON.stringify({ message: 'OK' }), { status: 200 });
	}
}

export { APIService };
