import type { RequestHandler } from '@sveltejs/kit';
import { proxyService } from '../../../services';

export const GET: RequestHandler = async (event) => {
	return proxyService.handle(event);
};

export const POST: RequestHandler = async (event) => {
	return proxyService.handle(event);
};

export const PUT: RequestHandler = async (event) => {
	return proxyService.handle(event);
};

export const PATCH: RequestHandler = async (event) => {
	return proxyService.handle(event);
};

export const DELETE: RequestHandler = async (event) => {
	return proxyService.handle(event);
};
