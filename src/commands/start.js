const keyboards = require('../bot/keyboards');
const users = require('../services/users');
const config = require('../config');
const { checkForceJoin } = require('../middleware/forceJoin');

module.exports = (bot) => {
    bot.onText(/^\/start(?:\s+.*)?$/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        users.registerUser(userId, msg.from);

        if (!(await checkForceJoin(bot, msg))) return;

        const text =
            '🐕 <b>ENTITY 4.5</b>\n\n' +
            'Welcome to the illustrious realm of Entity 4.5 metros, where they have unveiled their most recent and undoubtedly spectacular invention: <b>a dog without limits.</b>\n\n' +
            '<b>Creators / Owners</b>\n\n' +
            '👑 Escanor — @Lion_sin_aboveall\n' +
            '👑 Lucifer — @W0rm_h0le\n\n' +
            '💬 Chat with Entity normally.\n' +
            '⌘ Code, debugging, research, writing and more.\n\n' +
            '<i>Built to be useful. Designed without unnecessary friction.</i>';

        await bot.sendMessage(chatId, text, {
            parse_mode: 'HTML',
            reply_markup: keyboards.mainMenu(config.isOwner(userId))
        });
    });
};
