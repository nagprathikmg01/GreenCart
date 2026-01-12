import { AIPrompts } from '../utils/aiPrompts';

/**
 * GreenCart AI Service
 * Simulates an AI backend for educational purposes.
 * 
 * Features:
 * - Generates "Analysis" for products
 * - "Reasoning" delays to mimic API latency
 * - Returns "Structured Thoughts" to show users how AI works
 */

const SIMULATION_DELAY = 1500; // ms to simulate "thinking"

export const aiService = {

    /**
     * Analyze a product's sustainability
     * @param {Object} product 
     * @returns {Promise<Object>}
     */
    analyzeProduct: async (product) => {
        const prompt = AIPrompts.analyzeProduct(product);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, SIMULATION_DELAY));

        // Simulated "GenAI" Response Logic
        // In a real app, this would be the response from OpenAI/Gemini
        const mockResponse = generateMockAnalysis(product);

        return {
            prompt, // Return the prompt so user can see it (Prompt Engineering Learning)
            response: mockResponse,
            model: "GreenCart-Eco-LLM-v1 (Simulated)"
        };
    },

    /**
     * Get an answer from the RAG system
     * @param {String} query 
     * @param {String} context 
     * @returns {Promise<Object>}
     */
    getAnswer: async (query, context) => {
        const prompt = AIPrompts.answerSustainabilityQuestion(query, context);

        await new Promise(resolve => setTimeout(resolve, SIMULATION_DELAY));

        // Simulated RAG Response
        const mockAnswer = generateMockRAGResponse(query);

        return {
            prompt,
            response: mockAnswer,
            model: "GreenCart-RAG-v1 (Simulated)"
        };
    }
};

// --- Helper Functions to Generate "Smart" Mock Responses ---

function generateMockAnalysis(product) {
    const category = product.category || 'Product';

    // Dynamic templates based on category for realism
    const templates = {
        'Electronics': `buying this used ${product.title} prevents e-waste, which contains toxic materials like lead and mercury. It saves approximately 50kg of CO2 compared to manufacturing a new one. This aligns perfectly with SDG 12 by extending the lifespan of complex electronics!`,
        'Clothing': `Choosing this pre-loved ${product.title} fights fast fashion! It saves roughly 2,700 liters of water (enough for one person to drink for 900 days) that would be used to grow cotton for a new item. A stylish way to support responsible consumption.`,
        'Furniture': `This ${product.title} saves valuable timber resources and prevents bulky waste from entering landfills. By reusing furniture, you're reducing the demand for new raw materials and supporting a circular economy.`,
        'Books': `Re-reading this book saves paper and energy used in the printing process. Sharing knowledge sustainably is a key part of community-driven eco-conscious living!`,
        'default': `By extending the life of this ${product.title}, you are actively reducing landfill waste and the carbon emissions associated with manufacturing new goods. A small choice with a big positive impact!`
    };

    const explanation = templates[category] || templates['default'];
    return `Great choice! ${explanation}`;
}

function generateMockRAGResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('sdg') || q.includes('goal')) {
        return "GreenCart aligns with SDG 12: Responsible Consumption and Production. We aim to halve global food waste and substantially reduce waste generation through prevention, reduction, recycling and reuse.";
    }
    if (q.includes('recycle') || q.includes('bin')) {
        return "Always separate your waste! Rinse plastics and cans. Cardboard should be flattened. Check your local council's guidelines for specific recycling rules in your area.";
    }
    if (q.includes('why') || q.includes('benefit')) {
        return "Buying second-hand reduces demand for new manufacturing, saves water and energy, and prevents usable items from ending up in landfills. It's the most direct way to participate in the circular economy.";
    }

    return "I found some info in our sustainability guide: Focus on 'Refuse, Reduce, Reuse, Recycle'. Buying second-hand is a powerful form of Reuse!";
}
