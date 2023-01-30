async function streamToArrayBuffer(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
	let result = new Uint8Array(0);
	const reader = stream.getReader();
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}

		const newResult = new Uint8Array(result.length + value.length);
		newResult.set(result);
		newResult.set(value, result.length);
		result = newResult;
	}
	return result;
}

const SUPPORTED_TYPE = ['application/json'];
function decodeBuffer(buffer: Uint8Array, contentType: string): object | string {
	if (!SUPPORTED_TYPE.includes(contentType))
		throw new Error(`unsupported response type ${contentType}`);
	const text = new TextDecoder().decode(buffer);
	if (contentType === 'application/text') return text;
	return JSON.parse(text);
}

function getHeaders(headers: Headers): object {
	const headerObj: { [key: string]: unknown } = {};
	const keys = headers.keys();
	let header = keys.next();
	while (header.value) {
		headerObj[header.value] = headers.get(header.value);
		header = keys.next();
	}

	return headerObj;
}

function getQuery(searchParams: URLSearchParams): object {
	const queryObject: { [key: string]: unknown } = {};
	const queryKeys = searchParams.keys();
	let query = queryKeys.next();
	while (query.value) {
		queryObject[query.value] = searchParams.get(query.value);
		query = queryKeys.next();
	}

	return queryObject;
}

export { streamToArrayBuffer, decodeBuffer, getHeaders, getQuery };
