const formatting = {
    escapeMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/\\/g, '\\\\')
            .replace(/\*/g, '\\*')
            .replace(/_/g, '\\_')
            .replace(/\[/g, '\\[')
            .replace(/\]/g, '\\]')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)')
            .replace(/~/g, '\\~')
            .replace(/`/g, '\\`')
            .replace(/>/g, '\\>')
            .replace(/#/g, '\\#')
            .replace(/\+/g, '\\+')
            .replace(/-/g, '\\-')
            .replace(/=/g, '\\=')
            .replace(/\|/g, '\\|')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}')
            .replace(/\./g, '\\.');
    },

    escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    splitMessage(text, maxLength = 4096) {
        if (!text || text.length <= maxLength) return [text];

        const parts = [];
        let current = '';
        const lines = text.split('\n');

        for (const line of lines) {
            if ((current + line + '\n').length > maxLength) {
                if (current) parts.push(current.trim());
                current = line + '\n';
            } else {
                current += line + '\n';
            }
        }
        if (current) parts.push(current.trim());

        // If any part is still too long, split by characters
        const finalParts = [];
        for (const part of parts) {
            if (part.length > maxLength) {
                for (let i = 0; i < part.length; i += maxLength) {
                    finalParts.push(part.slice(i, i + maxLength));
                }
            } else {
                finalParts.push(part);
            }
        }

        return finalParts;
    },

    formatCodeBlock(code, language = '') {
        return `\`\`\`${language}\n${code}\n\`\`\``;
    },

    truncate(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    },

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    formatUptime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

        return parts.join(' ');
    }
};

module.exports = formatting;
