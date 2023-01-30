export type HTTPResponse = {
	requestId: string;
	statusCode: number;
	statusText: string;
	time: number; // miliseconds
	headers: object;
	body: object;
	date: Date;
};
