const keyboards = {
    mainMenu(owner = false) {
        const rows = [
            [
                { text: '💬 Chat', callback_data: 'menu_chat' },
                { text: '🧠 Memory', callback_data: 'menu_memory' }
            ],
            [
                { text: '👤 Account', callback_data: 'menu_account' },
                { text: '📊 Usage', callback_data: 'menu_usage' }
            ],
            [
                { text: '⚙️ Settings', callback_data: 'menu_settings' },
                { text: '👑 Owners', callback_data: 'menu_owners' }
            ],
            [
                { text: 'ℹ️ About', callback_data: 'menu_about' },
                { text: '◉ Status', callback_data: 'menu_status' }
            ]
        ];
        if (owner) rows.push([{ text: '🛠 Admin Center', callback_data: 'admin_home' }]);
        return { inline_keyboard: rows };
    },

    back() {
        return { inline_keyboard: [[{ text: '‹ Back to Menu', callback_data: 'menu_home' }]] };
    },

    forceJoin(channels) {
        const rows = channels.map((channel, i) => [{
            text: `📢 Join Channel ${i + 1}`,
            url: channel.startsWith('http') ? channel : `https://t.me/${channel.replace(/^@/, '')}`
        }]);
        rows.push([{ text: '✅ I’ve Joined — Check', callback_data: 'force_check' }]);
        return { inline_keyboard: rows };
    },

    settingsMenu(settings = {}) {
        return {
            inline_keyboard: [
                [{ text: `⌘ Developer Mode ${settings.developerMode ? '✓ ON' : '✗ OFF'}`, callback_data: 'settings_devmode' }],
                [{ text: `◈ Response Style: ${settings.responseStyle || 'balanced'}`, callback_data: 'settings_style' }],
                [{ text: '↻ Reset Conversation', callback_data: 'settings_reset' }],
                [{ text: '‹ Back to Menu', callback_data: 'menu_home' }]
            ]
        };
    },

    responseStyleMenu(current = 'balanced') {
        const styles = ['concise', 'balanced', 'detailed', 'technical'];
        return {
            inline_keyboard: [
                ...styles.map(style => [{
                    text: `${current === style ? '◉' : '○'} ${style[0].toUpperCase() + style.slice(1)}`,
                    callback_data: `style_${style}`
                }]),
                [{ text: '‹ Back', callback_data: 'settings_back' }]
            ]
        };
    },

    devToolsMenu() {
        return {
            inline_keyboard: [
                [{ text: '🐍 Python', callback_data: 'dev_python' }, { text: '📜 JavaScript', callback_data: 'dev_javascript' }],
                [{ text: '🟢 Node.js', callback_data: 'dev_nodejs' }, { text: '⚛️ React', callback_data: 'dev_react' }],
                [{ text: '🗄 SQL', callback_data: 'dev_sql' }, { text: '🐳 Docker', callback_data: 'dev_docker' }],
                [{ text: '‹ Back to Menu', callback_data: 'menu_home' }]
            ]
        };
    },

    adminMenu() {
        return {
            inline_keyboard: [
                [{ text: '◈ Statistics', callback_data: 'admin_stats' }, { text: '⌬ Endpoints', callback_data: 'admin_endpoints' }],
                [{ text: '⚙️ Configuration', callback_data: 'admin_config' }, { text: '◇ Maintenance', callback_data: 'admin_maintenance' }],
                [{ text: '📢 Broadcast', callback_data: 'admin_broadcast' }, { text: '↻ Reload', callback_data: 'admin_reload' }],
                [{ text: '‹ Back to Menu', callback_data: 'menu_home' }]
            ]
        };
    },

    adminEndpointsMenu(endpoints) {
        const rows = endpoints.map(e => [{
            text: `${e.enabled ? '◉' : '○'} ${e.name}`,
            callback_data: `admin_toggle_${e.path}`
        }]);
        rows.push([{ text: '‹ Back to Admin', callback_data: 'admin_home' }]);
        return { inline_keyboard: rows };
    },

    confirmBroadcast() {
        return { inline_keyboard: [[{ text: '✅ Confirm', callback_data: 'broadcast_confirm' }, { text: '❌ Cancel', callback_data: 'broadcast_cancel' }]] };
    }
};

module.exports = keyboards;
