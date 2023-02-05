import { baseUrlRepo } from '../repository';
import { APIService } from './baseUrl.service';
import { httpEvent } from './httpEventEmitter';
import { ProxyService } from './proxy.service';
import { ReplayService } from './replay.service';

const apiService = new APIService(baseUrlRepo);
const proxyService = new ProxyService(baseUrlRepo, httpEvent);
const replayService = new ReplayService(httpEvent);

export { apiService, proxyService, replayService };
