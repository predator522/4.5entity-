const apiClient = require('../api/client');
const endpointManager = require('../api/endpoints');
const users = require('../services/users');
const conversation = require('../services/conversation');
const rateLimit = require('../services/rateLimit');
const formatting = require('../utils/formatting');
const { errorHandler } = require('../utils/errors');

class AIFeature {
    constructor() {
        this.name = 'AI Chat';
        this.enabled = true;
    }

    async processMessage(bot, msg) {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const query = msg.text;

        if (!rateLimit.isAllowed(userId)) {
            const error = errorHandler.rateLimited();
            await bot.sendMessage(chatId, error.userMessage, { parse_mode: 'Markdown' });
            return;
        }

        bot.sendChatAction(chatId, 'typing').catch(() => {});

        const settings = users.getSettings(userId);
        let enhancedQuery = query;

        if (settings.developerMode) {
            enhancedQuery = `[Developer Mode: Prioritize accurate code, practical implementation, debugging, architecture, performance, security, and clean coding practices.]\n\n${query}`;
        }

        if (settings.responseStyle && settings.responseStyle !== 'balanced') {
            const styleHints = {
                concise: 'Provide a concise, brief response.',
                detailed: 'Provide a detailed, thorough response with examples.',
                technical: 'Provide a deeply technical response with implementation details.'
            };
            enhancedQuery = `[${styleHints[settings.responseStyle]}]\n\n${enhancedQuery}`;
        }

        try {
            users.updateActivity(userId);
            const context = conversation.getFormattedContext(userId);
            const result = await apiClient.request(enhancedQuery, settings.endpoint, context);

            conversation.addMessage(userId, 'user', query);
            conversation.addMessage(userId, 'assistant', result.response);

            const parts = formatting.splitMessage(result.response);

            for (let i = 0; i < parts.length; i++) {
                const prefix = parts.length > 1 ? `🐕 ENTITY 4.5 — Part ${i + 1}/${parts.length}\n\n` : '';
                await bot.sendMessage(chatId, prefix + parts[i], {
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                });
            }
        } catch (error) {
            errorHandler.handle(error, { bot, chatId, userId });
        }
    }

    register(bot) {
        // Handled by message handler
    }
}

module.exports = new AIFeature();
