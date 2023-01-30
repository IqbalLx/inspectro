export type HTTPRequest = {
	id: string;
	url: string;
	method: string;
	headers: object;
	query: object;
	body: object;
	date: Date;
};
