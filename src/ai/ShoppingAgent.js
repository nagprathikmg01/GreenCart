import { storage } from '../utils/storage';
import { calculateItemSustainability } from '../utils/sustainability';

/**
 * GreenCart Shopping Agent
 * A simple state-machine agent to help users find products.
 */

export const AGENT_STATES = {
    IDLE: 'IDLE',
    ANALYZING: 'ANALYZING', // Understanding intent
    SEARCHING: 'SEARCHING', // Looking up data
    EVALUATING: 'EVALUATING', // Checking sustainability
    RESPONDING: 'RESPONDING'
};

export class ShoppingAgent {
    constructor() {
        this.state = AGENT_STATES.IDLE;
        this.memory = []; // Conversation history (not fully used in this simple demo)
    }

    /**
     * Process a user message and return a response
     * @param {String} message 
     * @returns {Promise<Object>}
     */
    async processMessage(message) {
        this.state = AGENT_STATES.ANALYZING;
        const intent = this.parseIntent(message);

        // Simulate thinking time
        await this.delay(800);

        if (intent.type === 'FIND_PRODUCT') {
            this.state = AGENT_STATES.SEARCHING;
            const products = storage.getAvailableProducts();
            await this.delay(800);

            this.state = AGENT_STATES.EVALUATING;
            const matches = this.findMatches(products, intent.keywords);
            await this.delay(800);

            this.state = AGENT_STATES.RESPONDING;
            return this.generateProductResponse(matches, intent.keywords);
        }

        // Default / Chat type
        this.state = AGENT_STATES.RESPONDING;
        return {
            text: "I specialize in finding sustainable products! Try asking me 'Find me a reusable bottle' or 'I need a cheap laptop'.",
            products: []
        };
    }

    parseIntent(message) {
        const m = message.toLowerCase();

        // Basic Keyword Intent Parsing
        if (m.includes('find') || m.includes('need') || m.includes('buy') || m.includes('searching') || m.includes('looking')) {
            // Extract potential keywords (very naive extraction for demo)
            const keywords = m.replace(/find|need|buy|searching|looking|for|a|me|i/g, '').trim();
            return { type: 'FIND_PRODUCT', keywords };
        }

        return { type: 'CHAT' };
    }

    findMatches(products, keywordString) {
        if (!keywordString) return [];

        const terms = keywordString.split(' ').map(t => t.trim()).filter(t => t.length > 2);

        return products.filter(p => {
            const titleMatch = terms.some(term => p.title.toLowerCase().includes(term));
            const descMatch = terms.some(term => p.description.toLowerCase().includes(term));
            const catMatch = terms.some(term => p.category.toLowerCase().includes(term));
            return titleMatch || descMatch || catMatch;
        }).map(p => ({
            ...p,
            sustainability: calculateItemSustainability(p)
        })).sort((a, b) => b.sustainability.contribution - a.sustainability.contribution); // Sort by most sustainable
    }

    generateProductResponse(matches, query) {
        if (matches.length === 0) {
            return {
                text: `I looked through our inventory but couldn't find any sustainable "${query}" right now. Check back later!`,
                products: []
            };
        }

        const topPick = matches[0];
        return {
            text: `I found ${matches.length} sustainable options for "${query}"! \n\nTop Pick: **${topPick.title}** (Reused Item). \nReason: ${topPick.sustainability.explanation}`,
            products: matches.slice(0, 3) // Return top 3
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const shoppingAgent = new ShoppingAgent();
