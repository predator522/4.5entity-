const keyboards = require('../bot/keyboards');
const users = require('../services/users');
const endpointManager = require('../api/endpoints');
const formatting = require('../utils/formatting');

let broadcastPending = new Map();

module.exports = (bot) => {
    bot.onText(/^\/admin$/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (!users.isAdmin(userId)) {
            await bot.sendMessage(chatId, '◇ Access denied. Administrator privileges required.');
            return;
        }

        const stats = users.getStats();

        const adminText = `🐕 ENTITY 4.5 — ADMIN

◈ System
Bot: ONLINE
AI API: ONLINE
Mode: ACTIVE

⌘ Statistics
Users: ${formatting.formatNumber(stats.totalUsers)}
Active: ${formatting.formatNumber(stats.activeUsers)}
Requests: ${formatting.formatNumber(stats.totalRequests)}
Today: ${formatting.formatNumber(stats.requestsToday)}
Errors: ${formatting.formatNumber(stats.apiErrors)}
Uptime: ${formatting.formatUptime(stats.uptime / 1000)}`;

        await bot.sendMessage(chatId, adminText, {
            parse_mode: 'Markdown',
            reply_markup: keyboards.adminMenu()
        });
    });

    bot.onText(/^\/stats$/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (!users.isAdmin(userId)) {
            await bot.sendMessage(chatId, '◇ Access denied.');
            return;
        }

        const stats = users.getStats();
        const endpoint = endpointManager.getDefault();

        const statsText = `◈ Statistics

Total Users: ${formatting.formatNumber(stats.totalUsers)}
Active Users (24h): ${formatting.formatNumber(stats.activeUsers)}
Total Requests: ${formatting.formatNumber(stats.totalRequests)}
Requests Today: ${formatting.formatNumber(stats.requestsToday)}
API Errors: ${formatting.formatNumber(stats.apiErrors)}
Uptime: ${formatting.formatUptime(stats.uptime / 1000)}
Default Endpoint: ${endpoint.name}`;

        await bot.sendMessage(chatId, statsText, { parse_mode: 'Markdown' });
    });

    bot.onText(/^\/users$/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (!users.isAdmin(userId)) {
            await bot.sendMessage(chatId, '◇ Access denied.');
            return;
        }

        const allUsers = users.getAllUsers();
        const activeUsers = users.getActiveUsers();

        let usersText = `◈ Users\n\nTotal: ${allUsers.length}\nActive (24h): ${activeUsers.length}\n\n`;

        activeUsers.slice(0, 20).forEach(u => {
            const username = u.username ? `@${u.username}` : 'N/A';
            usersText += `ID: ${u.id} | ${username} | ${u.requestCount} reqs\n`;
        });

        if (activeUsers.length > 20) {
            usersText += `\n... and ${activeUsers.length - 20} more`;
        }

        await bot.sendMessage(chatId, usersText, { parse_mode: 'Markdown' });
    });

    bot.onText(/^\/broadcast (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (!users.isAdmin(userId)) {
            await bot.sendMessage(chatId, '◇ Access denied.');
            return;
        }

        const message = match[1];
        broadcastPending.set(userId, message);

        await bot.sendMessage(chatId, `📢 Broadcast Preview:\n\n${message}\n\nSend to all users?`, {
            reply_markup: keyboards.confirmBroadcast()
        });
    });

    bot.onText(/^\/endpoints$/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (!users.isAdmin(userId)) {
            await bot.sendMessage(chatId, '◇ Access denied.');
            return;
        }

        const endpoints = endpointManager.getAll();

        let endpointsText = '◆ Endpoint Manager\n\n';
        endpoints.forEach(e => {
            const status = e.enabled ? '◉ ENABLED' : '○ DISABLED';
            endpointsText += `${status} — ${e.name}\n`;
        });

        await bot.sendMessage(chatId, endpointsText, {
            parse_mode: 'Markdown',
            reply_markup: keyboards.adminEndpointsMenu(endpoints)
        });
    });

    bot.onText(/^\/setendpoint (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (!users.isAdmin(userId)) {
            await bot.sendMessage(chatId, '◇ Access denied.');
            return;
        }

        const path = match[1].trim();
        const endpoint = endpointManager.getByPath(path);

        if (!endpoint) {
            await bot.sendMessage(chatId, `◇ Endpoint '${path}' not found.`);
            return;
        }

        endpointManager.setDefault(path);
        await bot.sendMessage(chatId, `◆ Default endpoint set to: ${endpoint.name}`);
    });

    bot.onText(/^\/reload$/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (!users.isAdmin(userId)) {
            await bot.sendMessage(chatId, '◇ Access denied.');
            return;
        }

        await bot.sendMessage(chatId, '↻ Configuration reloaded successfully.');
    });

    bot.onText(/^\/maintenance$/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (!users.isAdmin(userId)) {
            await bot.sendMessage(chatId, '◇ Access denied.');
            return;
        }

        const config = require('../config');
        config.maintenance.enabled = !config.maintenance.enabled;

        const status = config.maintenance.enabled ? 'ENABLED' : 'DISABLED';
        await bot.sendMessage(chatId, `◇ Maintenance mode: ${status}`);
    });
};

module.exports.broadcastPending = broadcastPending;
