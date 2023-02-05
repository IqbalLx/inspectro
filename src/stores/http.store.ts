import { writable } from 'svelte/store';

import type { HTTPRequest } from '../entities/httpRequest.entity';
import type { HTTPResponse } from '../entities/httpResponse.entity';

export const requests = writable<HTTPRequest[]>([]);
export const responses = writable<HTTPResponse[]>([]);
export const filteredRequests = writable<HTTPRequest[]>([]);
