const config = require('../config');

module.exports = (bot) => {
    bot.onText(/^\/owners$/, async (msg) => {
        await bot.sendMessage(msg.chat.id,
            '👑 <b>ENTITY 4.5 — CREATORS / OWNERS</b>\n\n' +
            '👑 Escanor — @Lion_sin_aboveall\n' +
            '👑 Lucifer — @W0rm_h0le\n\n' +
            `<i>Owner IDs configured: ${config.owners.ids.length ? 'yes' : 'not yet'}</i>`,
            { parse_mode: 'HTML' }
        );
    });
};
