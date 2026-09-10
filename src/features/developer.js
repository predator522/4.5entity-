class DeveloperFeature {
    constructor() {
        this.name = 'Developer Tools';
        this.enabled = true;
        this.commands = [
            { name: 'python', description: 'Python programming help' },
            { name: 'javascript', description: 'JavaScript programming help' },
            { name: 'typescript', description: 'TypeScript programming help' },
            { name: 'react', description: 'React development help' },
            { name: 'nodejs', description: 'Node.js development help' },
            { name: 'sql', description: 'SQL and database help' },
            { name: 'docker', description: 'Docker and DevOps help' },
            { name: 'git', description: 'Git and version control help' }
        ];
    }

    getPrompt(tech) {
        const prompts = {
            python: 'You are a Python expert. Provide clean, PEP8-compliant code with explanations.',
            javascript: 'You are a JavaScript expert. Provide modern ES6+ code with best practices.',
            typescript: 'You are a TypeScript expert. Provide type-safe code with proper interfaces.',
            react: 'You are a React expert. Provide component-based code with hooks and modern patterns.',
            nodejs: 'You are a Node.js expert. Provide server-side code with Express and async patterns.',
            sql: 'You are a SQL expert. Provide optimized queries with indexing recommendations.',
            docker: 'You are a Docker and DevOps expert. Provide containerization and deployment guidance.',
            git: 'You are a Git expert. Provide version control workflows and best practices.'
        };
        return prompts[tech] || 'You are a programming expert. Provide high-quality code and guidance.';
    }

    register(bot) {
        // Developer tools are handled via callbacks and inline keyboards
    }
}

module.exports = new DeveloperFeature();
