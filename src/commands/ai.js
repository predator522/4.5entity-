const apiClient = require('../api/client');
const endpointManager = require('../api/endpoints');
const users = require('../services/users');
const conversation = require('../services/conversation');
const rateLimit = require('../services/rateLimit');
const formatting = require('../utils/formatting');
const { errorHandler } = require('../utils/errors');

module.exports = (bot) => {
    bot.onText(/^\/ai\s+(.+)$/i, async (msg, match) => handleAiRequest(bot, msg.chat.id, msg.from.id, match[1]));

    bot.onText(/^\/model$/, async (msg) => {
        users.registerUser(msg.from.id, msg.from);
        const endpoint = endpointManager.getUserEndpoint(users.getSettings(msg.from.id));
        await bot.sendMessage(msg.chat.id, `🐕 <b>Current Entity model</b>\n\n${endpoint.name}\n<code>${endpoint.path}</code>\n\n${endpoint.description}`, { parse_mode: 'HTML' });
    });
};

async function handleAiRequest(bot, chatId, userId, query) {
    if (!rateLimit.isAllowed(userId)) {
        await bot.sendMessage(chatId, '⏳ Slow down a little. You have reached the current request limit.');
        return;
    }
    users.registerUser(userId);
    try {
        bot.sendChatAction(chatId, 'typing').catch(() => {});
        users.updateActivity(userId);
        const settings = users.getSettings(userId);
        const result = await apiClient.request(query, settings.endpoint, conversation.getFormattedContext(userId));
        conversation.addMessage(userId, 'user', query);
        conversation.addMessage(userId, 'assistant', result.response);
        for (const part of formatting.splitMessage(result.response)) {
            await bot.sendMessage(chatId, formatting.escapeHtml(part), { parse_mode: 'HTML', disable_web_page_preview: true });
        }
    } catch (error) {
        errorHandler.handle(error, { bot, chatId, userId });
    }
}

module.exports.handleAiRequest = handleAiRequest;
