const endpointManager = require('../api/endpoints');

class EndpointsFeature {
    constructor() {
        this.name = 'Endpoint Manager';
        this.enabled = true;
    }

    getRegistry() {
        return endpointManager.getAll();
    }

    addEndpoint(endpoint) {
        return endpointManager.addEndpoint(endpoint);
    }

    toggleEndpoint(path) {
        return endpointManager.toggleEndpoint(path);
    }

    register(bot) {
        // Endpoint management handled by admin commands
    }
}

module.exports = new EndpointsFeature();
