const users = require('../services/users');

module.exports = (bot) => {
    bot.onText(/^\/devmode$/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        const user = users.getUser(userId);
        const currentMode = user ? user.settings.developerMode : false;
        const newMode = !currentMode;

        users.updateSettings(userId, { developerMode: newMode });

        const statusText = newMode ? 'ENABLED' : 'DISABLED';
        const statusIcon = newMode ? '●' : '○';

        const devText = `⌘ Developer Mode

Status: ${statusIcon} ${statusText}

${newMode ? 'Entity 4.5 will prioritize technical, implementation-focused responses.' : 'Entity 4.5 will use balanced responses.'}

${newMode ? '◆ Accurate code\n◆ Practical implementation\n◆ Debugging\n◆ Technical explanations\n◆ Architecture\n◆ Performance\n◆ Security\n◆ Clean coding practices' : ''}`;

        await bot.sendMessage(chatId, devText, { parse_mode: 'Markdown' });
    });
};
