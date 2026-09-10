const apiClient = require('../api/client');
const endpointManager = require('../api/endpoints');
const users = require('../services/users');
const formatting = require('../utils/formatting');

module.exports = (bot) => {
    bot.onText(/^\/status$/, async (msg) => {
        const loading = await bot.sendMessage(msg.chat.id, '◌ Checking Entity systems...');
        try {
            const apiStatus = await apiClient.checkStatus();
            const stats = users.getStats();
            const endpoint = endpointManager.getDefault();
            const text =
                '🐕 <b>ENTITY 4.5 STATUS</b>\n\n' +
                `Bot ............ 🟢 ONLINE\nAI Engine ...... ${apiStatus.online ? '🟢 ONLINE' : '🔴 OFFLINE'}\nEndpoint ....... ${endpoint.name}\nResponse ....... ${apiStatus.online ? 'NORMAL' : 'DEGRADED'}\n\n` +
                '<b>Statistics</b>\n' +
                `Users: ${formatting.formatNumber(stats.totalUsers)}\nRequests: ${formatting.formatNumber(stats.totalRequests)}\nToday: ${formatting.formatNumber(stats.requestsToday)}\nUptime: ${formatting.formatUptime(stats.uptime / 1000)}`;
            await bot.editMessageText(text, { chat_id: msg.chat.id, message_id: loading.message_id, parse_mode: 'HTML' });
        } catch (error) {
            await bot.editMessageText('❌ Entity could not retrieve status right now.', { chat_id: msg.chat.id, message_id: loading.message_id });
        }
    });
};
