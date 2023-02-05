import type { RequestHandler } from '@sveltejs/kit';
import { apiService } from '../../../services';

export const GET: RequestHandler = () => {
	return apiService.getBaseUrl();
};

export const POST: RequestHandler = (event) => {
	return apiService.setBaseUrl(event);
};
