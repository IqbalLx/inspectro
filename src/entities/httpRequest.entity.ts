export type HTTPRequest = {
	id: string;
	url: string;
	proxyUrl: string;
	method: string;
	headers: object;
	query: object;
	body: object;
	date: Date;
};
