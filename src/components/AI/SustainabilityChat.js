import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Leaf } from 'lucide-react'; // Using Lucide icons if available
import { shoppingAgent, AGENT_STATES } from '../../ai/ShoppingAgent';
import { ragEngine } from '../../utils/ragEngine';
import { aiService } from '../../services/aiService';

export default function SustainabilityChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your Sustainability Assistant. Ask me about SDG 12 or tell me what eco-friendly product you're looking for!", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [agentState, setAgentState] = useState(AGENT_STATES.IDLE);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            // Hybrid Logic: Check if it's a "Find/Buy" intent (Agent) or "Question" (RAG)
            const lowerInput = userMsg.text.toLowerCase();

            if (lowerInput.includes('find') || lowerInput.includes('buy') || lowerInput.includes('looking for') || lowerInput.includes('recommend')) {
                // --- AGENT MODE ---
                setAgentState(AGENT_STATES.ANALYZING);
                const response = await shoppingAgent.processMessage(userMsg.text);

                setIsTyping(false);
                setDescriptorState(shoppingAgent.state); // visual update

                const botMsg = {
                    id: Date.now() + 1,
                    text: response.text,
                    sender: 'bot',
                    products: response.products
                };
                setMessages(prev => [...prev, botMsg]);

            } else {
                // --- RAG MODE ---
                setAgentState(AGENT_STATES.SEARCHING); // Visual Cue

                // 1. Retrieve Context
                const context = ragEngine.retrieve(userMsg.text);

                // 2. Generate Answer (Simulated)
                const aiResult = await aiService.getAnswer(userMsg.text, context);

                setIsTyping(false);
                const botMsg = {
                    id: Date.now() + 1,
                    text: aiResult.response,
                    sender: 'bot',
                    isRag: true,
                    promptUsed: aiResult.prompt // Educational: Show prompt on hover/click?
                };
                setMessages(prev => [...prev, botMsg]);
            }
        } catch (error) {
            console.error(error);
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now(), text: "I had a bit of a glitch. Try asking again!", sender: 'bot' }]);
        }

        setAgentState(AGENT_STATES.IDLE);
    };

    function setDescriptorState(state) {
        setAgentState(state);
        // Reset after a few seconds
        setTimeout(() => setAgentState(AGENT_STATES.IDLE), 2000);
    }

    // Visual text for agent state
    const getStatusText = () => {
        switch (agentState) {
            case AGENT_STATES.ANALYZING: return "Analyzing Intent...";
            case AGENT_STATES.SEARCHING: return "Searching Inventory...";
            case AGENT_STATES.EVALUATING: return "Checking Sustainability...";
            case AGENT_STATES.RESPONDING: return "Typing...";
            default: return "Online";
        }
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 lg:right-10 w-14 h-14 bg-gradient-to-tr from-eco-500 to-primary-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 hover:shadow-green-500/50"
                    >
                        <Bot size={28} />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        className="fixed bottom-6 right-6 lg:right-10 w-full max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100 font-sans"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-eco-500 to-primary-600 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <Leaf size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Eco Assistant</h3>
                                    <p className="text-xs text-white/80 flex items-center gap-1">
                                        <span className={`w-2 h-2 rounded-full ${agentState !== AGENT_STATES.IDLE ? 'bg-yellow-300 animate-pulse' : 'bg-green-300'}`}></span>
                                        {getStatusText()}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user'
                                            ? 'bg-primary-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}

                                        {/* Tiny "Prompt Info" for Demo Purposes */}
                                        {msg.isRag && (
                                            <div className="mt-2 text-[10px] text-gray-400 border-t pt-1 border-gray-100 italic flex items-center gap-1">
                                                <Bot size={10} /> AI Generated using RAG
                                            </div>
                                        )}

                                        {/* Product Recommendations */}
                                        {msg.products && msg.products.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {msg.products.map(prod => (
                                                    <div key={prod.id} className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center gap-2 hover:bg-white transition cursor-pointer" onClick={() => window.location.href = `/product/${prod.id}`}>
                                                        <div className="w-8 h-8 bg-gray-200 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${prod.imageUrl})` }}></div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-xs truncate bg-transparent m-0 p-0 text-gray-700 max-h-4">{prod.title}</p>
                                                            <p className="text-[10px] text-green-600 font-medium">+ {prod.sustainability?.contribution}% Eco Score</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-primary-100 transition">
                                <input
                                    type="text"
                                    value={inputText}
                                    placeholder="Ask about sustainability..."
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 min-w-0"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isTyping}
                                    className="p-1.5 bg-primary-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
