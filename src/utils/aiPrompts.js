/**
 * GreenCart AI Prompt Templates
 * These templates are used to generate prompts for the AI service.
 * In a real application, these would be sent to an LLM API.
 * For this educational demo, they are used to show the user "what the AI is thinking".
 */

export const AIPrompts = {
  /**
   * Generates a prompt to analyze a product's sustainability
   * @param {Object} product - The product object
   * @returns {String} The constructed prompt
   */
  analyzeProduct: (product) => {
    return `
You are an expert in sustainability and environmental impact.
Analyze the following product and explain why it is eco-friendly:

Product: ${product.title}
Category: ${product.category}
Price: ₹${product.price}
Description: ${product.description}

Requirements:
1. Identify the key material or usage aspect that makes it sustainable.
2. Estimate the environmental impact (e.g., water saved, carbon footprint reduced) compared to a new item.
3. specific UN Sustainable Development Goal (SDG) it aligns with (e.g., SDG 12).
4. Keep the tone encouraging and educational.
5. Limit the response to 3-4 concise sentences.
    `.trim();
  },

  /**
   * Generates a prompt to find sustainable alternatives
   * @param {String} query - User's search query
   * @returns {String} The constructed prompt
   */
  recommendAlternatives: (query) => {
    return `
User is looking for: "${query}"

Task: Recommend sustainable second-hand alternatives that match this intent.
1. Understand the user's need (e.g., if they want a plastic bottle, suggest a steel one).
2. Search the inventory for matches.
3. Rank by sustainability score.
4. Explain WHY the recommendation is better for the planet.
    `.trim();
  },

  /**
   * Generates a prompt for RAG-based Q&A
   * @param {String} question - User's question
   * @param {String} context - Retrieved context chunks
   * @returns {String} The constructed prompt
   */
  answerSustainabilityQuestion: (question, context) => {
    return `
You are a GreenCart Sustainability Assistant.
Answer the user's question using ONLY the provided context from our knowledge base.

Context:
${context}

User Question: "${question}"

Instructions:
- If the answer is in the context, explain it clearly.
- If the answer is NOT in the context, politely say you only know about GreenCart sustainability guidelines.
- Mention specific tips or facts from the context.
- Keep the answer under 50 words.
    `.trim();
  }
};
