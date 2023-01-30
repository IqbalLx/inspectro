import type { RequestHandler } from '@sveltejs/kit';
import { apiService } from '../../services';

export const POST: RequestHandler = (event) => {
	return apiService.setBaseUrl(event);
};
