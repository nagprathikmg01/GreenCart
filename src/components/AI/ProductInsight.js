import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Info, CheckCircle2 } from 'lucide-react';
import { aiService } from '../../services/aiService';

export default function ProductInsight({ product }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function getInsight() {
            if (!product) return;

            setLoading(true);
            try {
                const result = await aiService.analyzeProduct(product);
                if (mounted) {
                    setAnalysis(result);
                    setLoading(false);
                }
            } catch (err) {
                console.error("AI Analysis failed", err);
                if (mounted) setLoading(false);
            }
        }

        getInsight();
        return () => { mounted = false; };
    }, [product]);

    if (!product) return null;

    return (
        <div className="bg-gradient-to-br from-white to-eco-50 rounded-2xl p-6 shadow-sm border border-eco-100 relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-eco-100/50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>

            <div className="flex items-center gap-2 mb-4 relative z-10">
                <Sparkles className="text-secondary-500 animate-pulse" size={20} />
                <h3 className="font-display font-bold text-lg text-gray-800">
                    AI Sustainability Analysis
                </h3>
                <span className="text-[10px] bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded-full font-medium border border-secondary-200">
                    Beta
                </span>
            </div>

            {loading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            ) : analysis ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    <div className="prose prose-sm text-gray-600 leading-relaxed bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white">
                        <p className="flex items-start gap-2">
                            <CheckCircle2 className="text-eco-600 mt-1 flex-shrink-0" size={16} />
                            {analysis.response}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowPrompt(!showPrompt)}
                        className="mt-4 text-xs flex items-center gap-1 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                        <Info size={12} />
                        {showPrompt ? "Hide Prompt Engineering" : "How was this generated?"}
                    </button>

                    {showPrompt && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-3 overflow-hidden"
                        >
                            <div className="bg-gray-900 rounded-lg p-3 text-left">
                                <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-2">
                                    <span className="text-[10px] text-gray-400 font-mono">PROMPT SENT TO AI</span>
                                </div>
                                <pre className="text-[10px] text-green-400 font-mono whitespace-pre-wrap break-words">
                                    {analysis.prompt}
                                </pre>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            ) : (
                <div className="text-sm text-gray-500">Analysis unavailable at this time.</div>
            )}
        </div>
    );
}
