class EntityError extends Error {
    constructor(message, type, userMessage) {
        super(message);
        this.type = type;
        this.userMessage = userMessage;
    }
}

const errorHandler = {
    handle(error, { bot, chatId, userId } = {}) {
        console.error(`[${error.type || 'ERROR'}] user=${userId || 'unknown'} ${error.message}`);
        if (bot && chatId) bot.sendMessage(chatId, error.userMessage || '❌ Entity could not complete that request right now.').catch(() => {});
    },
    apiUnavailable() {
        return new EntityError('AI API unavailable', 'API_UNAVAILABLE', '❌ The AI engine is unavailable right now. Please try again shortly.');
    },
    apiTimeout() {
        return new EntityError('AI API timeout', 'API_TIMEOUT', '❌ The AI engine did not respond. Please try again.');
    },
    rateLimited() {
        return new EntityError('Rate limited', 'RATE_LIMITED', '⏳ Slow down a little and try again shortly.');
    },
    invalidResponse() {
        return new EntityError('Invalid AI response', 'INVALID_RESPONSE', '❌ The AI engine returned an invalid response.');
    }
};

module.exports = { EntityError, errorHandler };
