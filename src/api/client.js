const axios = require('axios');
const config = require('../config');
const endpointManager = require('./endpoints');
const users = require('../services/users');
const { errorHandler } = require('../utils/errors');

class ApiClient {
    constructor() {
        this.baseUrl = config.api.baseUrl;
        this.defaultEndpoint = config.api.defaultEndpoint;
    }

    async request(query, endpointPath = null, userContext = '') {
        const endpoint = endpointPath ? endpointManager.getByPath(endpointPath) : endpointManager.getDefault();
        if (!endpoint || !endpoint.enabled) throw errorHandler.apiUnavailable();

        const url = `${this.baseUrl}${endpoint.path}`;
        const parts = [];
        if (userContext) parts.push(userContext);
        parts.push(query);
        const requestUrl = `${url}?${endpoint.queryParameter}=${encodeURIComponent(parts.join('\n\n'))}`;

        try {
            const response = await axios.get(requestUrl, {
                headers: { Accept: 'application/json', 'User-Agent': 'Entity-4.5-Bot/1.0' }
            });

            const data = response.data;
            let aiResponse = null;
            if (data && endpoint.responseField && data[endpoint.responseField]) aiResponse = data[endpoint.responseField];
            else if (data?.response) aiResponse = data.response;
            else if (data?.message) aiResponse = data.message;
            else if (data?.text) aiResponse = data.text;
            else if (typeof data === 'string') aiResponse = data;

            if (!aiResponse) throw errorHandler.invalidResponse();

            return {
                response: String(aiResponse),
                endpoint: endpoint.name,
                model: data?.model || endpoint.name,
                usage: data?.usage || null,
                raw: data
            };
        } catch (error) {
            if (error instanceof Error && error.type) throw error;
            if (error.response) {
                console.error(`AI API ${error.response.status}: ${String(error.response.data || '').slice(0, 500)}`);
                users.incrementApiErrors();
                throw errorHandler.apiUnavailable();
            }
            users.incrementApiErrors();
            throw errorHandler.apiUnavailable();
        }
    }

    async checkStatus(endpointPath = null) {
        const endpoint = endpointPath ? endpointManager.getByPath(endpointPath) : endpointManager.getDefault();
        if (!endpoint) return { online: false, endpoint: 'Unknown' };
        try {
            const url = `${this.baseUrl}${endpoint.path}?${endpoint.queryParameter}=Hello`;
            const response = await axios.get(url, { headers: { Accept: 'application/json' } });
            return { online: response.status >= 200 && response.status < 300, endpoint: endpoint.name, statusCode: response.status };
        } catch (error) {
            return { online: false, endpoint: endpoint.name, error: error.message };
        }
    }
}

module.exports = new ApiClient();
