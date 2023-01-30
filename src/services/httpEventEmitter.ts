import type { HTTPRequest } from 'entities/httpRequest.entity';
import type { HTTPResponse } from 'entities/httpResponse.entity';

import { EventEmitter } from 'tsee';

type HTTPEventHandler<T extends HTTPRequest | HTTPResponse> = (val: T) => void;
type HTTPEvent = EventEmitter<{
	request: HTTPEventHandler<HTTPRequest>;
	response: HTTPEventHandler<HTTPResponse>;
}>;
const httpEvent: HTTPEvent = new EventEmitter();

export type { HTTPEventHandler, HTTPEvent };
export { httpEvent };
