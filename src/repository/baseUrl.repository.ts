class BaseURLRepository {
	private baseURL: string | undefined;
	static instance: BaseURLRepository | null;

	static getInstance() {
		if (!BaseURLRepository.instance) {
			BaseURLRepository.instance = new BaseURLRepository();
		}

		return BaseURLRepository.instance;
	}

	getBaseUrl(): string | undefined {
		return this.baseURL;
	}

	setBaseUrl(baseUrl: string): void {
		this.baseURL = baseUrl;
	}
}

export { BaseURLRepository };
