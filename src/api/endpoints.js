const endpoints = [
    {
        name: 'DeepSeek V3',
        path: 'deepseek-v3',
        method: 'GET',
        queryParameter: 'q',
        responseField: 'response',
        description: 'Advanced reasoning and coding AI model',
        enabled: true,
        isDefault: true
    },
    {
        name: 'DeepSeek R1',
        path: 'deepseek-r1',
        method: 'GET',
        queryParameter: 'q',
        responseField: 'response',
        description: 'DeepSeek reasoning model for complex tasks',
        enabled: true,
        isDefault: false
    },
    {
        name: 'Gemini Flash',
        path: 'gemini-flash',
        method: 'GET',
        queryParameter: 'q',
        responseField: 'response',
        description: 'Fast multimodal AI by Google',
        enabled: true,
        isDefault: false
    },
    {
        name: 'Gemini Pro',
        path: 'gemini-pro',
        method: 'GET',
        queryParameter: 'q',
        responseField: 'response',
        description: 'Advanced multimodal AI by Google',
        enabled: true,
        isDefault: false
    },
    {
        name: 'Claude Sonnet',
        path: 'claude-sonnet',
        method: 'GET',
        queryParameter: 'q',
        responseField: 'response',
        description: 'Balanced performance AI by Anthropic',
        enabled: true,
        isDefault: false
    },
    {
        name: 'Claude Haiku',
        path: 'claude-haiku',
        method: 'GET',
        queryParameter: 'q',
        responseField: 'response',
        description: 'Fast and efficient AI by Anthropic',
        enabled: true,
        isDefault: false
    },
    {
        name: 'GPT-4o',
        path: 'gpt-4o',
        method: 'GET',
        queryParameter: 'q',
        responseField: 'response',
        description: 'OpenAI GPT-4o multimodal model',
        enabled: true,
        isDefault: false
    },
    {
        name: 'GPT-4o Mini',
        path: 'gpt-4o-mini',
        method: 'GET',
        queryParameter: 'q',
        responseField: 'response',
        description: 'Lightweight OpenAI model',
        enabled: true,
        isDefault: false
    },
    {
        name: 'Llama 3.3',
        path: 'llama-3.3',
        method: 'GET',
        queryParameter: 'q',
        responseField: 'response',
        description: 'Open-source Llama model by Meta',
        enabled: true,
        isDefault: false
    },
    {
        name: 'Qwen 2.5',
        path: 'qwen-2.5',
        method: 'GET',
        queryParameter: 'q',
        responseField: 'response',
        description: 'Alibaba Qwen model',
        enabled: true,
        isDefault: false
    }
];

class EndpointManager {
    constructor() {
        this.endpoints = [...endpoints];
    }

    getAll() {
        return this.endpoints;
    }

    getEnabled() {
        return this.endpoints.filter(e => e.enabled);
    }

    getByPath(path) {
        return this.endpoints.find(e => e.path === path);
    }

    getByName(name) {
        return this.endpoints.find(e => e.name === name);
    }

    getDefault() {
        return this.endpoints.find(e => e.isDefault) || this.endpoints[0];
    }

    getUserEndpoint(userSettings) {
        if (userSettings && userSettings.endpoint) {
            const endpoint = this.getByPath(userSettings.endpoint);
            if (endpoint && endpoint.enabled) return endpoint;
        }
        return this.getDefault();
    }

    addEndpoint(endpoint) {
        const exists = this.getByPath(endpoint.path);
        if (exists) {
            Object.assign(exists, endpoint);
            return exists;
        }
        this.endpoints.push(endpoint);
        return endpoint;
    }

    removeEndpoint(path) {
        const index = this.endpoints.findIndex(e => e.path === path);
        if (index > -1) {
            return this.endpoints.splice(index, 1)[0];
        }
        return null;
    }

    toggleEndpoint(path) {
        const endpoint = this.getByPath(path);
        if (endpoint) {
            endpoint.enabled = !endpoint.enabled;
        }
        return endpoint;
    }

    updateEndpoint(path, updates) {
        const endpoint = this.getByPath(path);
        if (endpoint) {
            Object.assign(endpoint, updates);
        }
        return endpoint;
    }

    setDefault(path) {
        this.endpoints.forEach(e => e.isDefault = false);
        const endpoint = this.getByPath(path);
        if (endpoint) {
            endpoint.isDefault = true;
        }
        return endpoint;
    }
}

module.exports = new EndpointManager();
