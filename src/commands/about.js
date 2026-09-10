const config = require('../config');

module.exports = (bot) => {
    bot.onText(/^\/about$/, async (msg) => {
        const text =
            '🐕 <b>ENTITY 4.5</b>\n\n' +
            '<b>The dog without limits.</b>\n\n' +
            'Entity 4.5 is a general AI assistant built for Telegram. It can help with coding, debugging, writing, reasoning, research and technical work.\n\n' +
            '<b>Creators / Owners</b>\n' +
            '👑 Escanor — @Lion_sin_aboveall\n' +
            '👑 Lucifer — @W0rm_h0le\n\n' +
            `⚙️ Endpoint: ${config.api.defaultEndpoint}`;
        await bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
    });
};
