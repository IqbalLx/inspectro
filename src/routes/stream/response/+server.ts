import type { RequestHandler } from '@sveltejs/kit';
import { sentEvent } from '../stream';

export const GET: RequestHandler = () => {
	return sentEvent('response');
};
