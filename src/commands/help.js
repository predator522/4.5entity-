const keyboards = require('../bot/keyboards');
const config = require('../config');

module.exports = (bot) => {
    bot.onText(/^\/help$/, async (msg) => {
        const text =
            '🐕 <b>ENTITY 4.5 — HELP</b>\n\n' +
            '<b>General</b>\n/start — Open Entity\n/help — Show this help\n/about — About Entity\n/status — System status\n/reset — Clear conversation\n\n' +
            '<b>AI</b>\n/ai &lt;prompt&gt; — Ask Entity\n/model — Current AI model\n\n' +
            '<b>Preferences</b>\n/settings — Configure responses\n/devmode — Toggle developer mode\n\n' +
            '<b>Admin</b>\n/admin — Admin center\n/stats — Statistics\n/users — User list\n/broadcast &lt;message&gt; — Announcement\n/endpoints — Endpoint manager\n/setendpoint &lt;path&gt; — Default endpoint\n/reload — Reload settings\n/maintenance — Maintenance mode\n\n' +
            '<i>Or simply send a normal message.</i>';

        await bot.sendMessage(msg.chat.id, text, {
            parse_mode: 'HTML',
            reply_markup: keyboards.mainMenu(config.isOwner(msg.from.id))
        });
    });
};
