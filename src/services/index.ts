import { baseUrlRepo } from '../repository';
import { APIService } from './api.service';
import { httpEvent } from './httpEventEmitter';
import { ProxyService } from './proxy.service';

const apiService = new APIService(baseUrlRepo);
const proxyService = new ProxyService(baseUrlRepo, httpEvent);

export { apiService, proxyService };