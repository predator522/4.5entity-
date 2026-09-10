const keyboards = require('../bot/keyboards');
const users = require('../services/users');
const conversation = require('../services/conversation');
const config = require('../config');

module.exports = (bot) => {
    bot.onText(/^\/settings$/, async (msg) => {
        users.registerUser(msg.from.id, msg.from);
        const settings = users.getSettings(msg.from.id);
        await bot.sendMessage(msg.chat.id, '⚙️ <b>Entity Settings</b>\n\nChoose how Entity should respond.', {
            parse_mode: 'HTML',
            reply_markup: keyboards.settingsMenu(settings)
        });
    });

    bot.onText(/^\/reset$/, async (msg) => {
        conversation.clearContext(msg.from.id);
        await bot.sendMessage(msg.chat.id, '↻ <b>Conversation cleared.</b>\n\nEntity is starting fresh.', { parse_mode: 'HTML' });
    });
};
