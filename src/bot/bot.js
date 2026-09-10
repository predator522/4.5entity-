const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');

function createBot() {
    const token = config.bot.token;

    if (!token) {
        console.error('❌ TELEGRAM_BOT_TOKEN is not set!');
        console.error('Please set your bot token in the .env file.');
        process.exit(1);
    }

    const bot = new TelegramBot(token, { polling: true });

    // Error handling for polling
    bot.on('polling_error', (error) => {
        console.error('Polling error:', error.message);
    });

    bot.on('webhook_error', (error) => {
        console.error('Webhook error:', error.message);
    });

    return bot;
}

module.exports = { createBot };
