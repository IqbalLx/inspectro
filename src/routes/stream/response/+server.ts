import type { RequestHandler } from '@sveltejs/kit';
import { sentEvent } from '../stream';

export const GET: RequestHandler = () => {
	const ac = new AbortController();
	return sentEvent('response', ac);
};
