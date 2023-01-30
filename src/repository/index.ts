import { BaseURLRepository } from './baseUrl.repository';

const baseUrlRepo = BaseURLRepository.getInstance();

baseUrlRepo.setBaseUrl('http://localhost:3000');

export { baseUrlRepo };
