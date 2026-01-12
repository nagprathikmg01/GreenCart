import knowledgeBase from '../data/knowledgeBase.json';

/**
 * GreenCart RAG Engine
 * A simple retrieval system for educational purposes.
 */

export const ragEngine = {
    /**
     * Retireve relevant context for a query
     * @param {String} query - User's question
     * @returns {String} Combined context string
     */
    retrieve: (query) => {
        const q = query.toLowerCase();
        const relevantChunks = [];

        // Simple keyword matching (Vector DB simulation)
        knowledgeBase.forEach(chunk => {
            const isRelevant = chunk.keywords.some(keyword => q.includes(keyword));
            if (isRelevant) {
                relevantChunks.push(chunk.content);
            }
        });

        // Fallback if no specific keywords match
        if (relevantChunks.length === 0) {
            return "Sustainability is about meeting our own needs without compromising the ability of future generations to meet their own needs. Reduce, Reuse, Recycle.";
        }

        // Limit to top 3 chunks to fit context window
        return relevantChunks.slice(0, 3).join("\n\n");
    }
};
