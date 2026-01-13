/**
 * Chat Pipeline for Tara
 * Main orchestrator for the multi-step chat response strategy
 * 
 * Pipeline Flow:
 * User Message → Pre-Processing → Intent Detection → Conversation Memory Fetch
 * → Response Strategy Selector → LLM Prompt Builder → LLM Response
 * → Safety Filter + Tone Check → Final Response
 * 
 * This module integrates:
 * - messagePreprocessor.js
 * - intentDetection.js
 * - responseStrategy.js
 */

// Use require for compatibility with Next.js API routes
const messagePreprocessor = require('./messagePreprocessor');
const intentDetectionModule = require('./intentDetection');
const responseStrategyModule = require('./responseStrategy');
const languageDetectionModule = require('./languageDetection');

const { preprocessMessage, quickCrisisCheck, getCrisisResponse } = messagePreprocessor;
const { detectIntent, getConfidenceLevel, INTENT_TYPES } = intentDetectionModule;
const { selectResponseStrategy, generateSystemInstruction, STRATEGIES } = responseStrategyModule;
const { detectLanguage } = languageDetectionModule;

// ============================================
// SAFETY FILTER KEYWORDS
// ============================================
const INAPPROPRIATE_RESPONSES = {
    harmful_advice: [
        'you should hurt',
        'just give up',
        'you deserve this',
        'nobody cares',
        'whats the point'
    ],
    dismissive_phrases: [
        'stop being dramatic',
        'just get over it',
        'man up',
        'youre overreacting',
        'its not a big deal'
    ],
    unprofessional: [
        'thats stupid',
        'youre wrong',
        'i dont care'
    ]
};

// ============================================
// TONE VALIDATION PATTERNS
// ============================================
const TONE_REQUIREMENTS = {
    crisis: {
        must_include: ['here', 'safe', 'care'],
        must_avoid: ['why', 'should', 'wrong']
    },
    validation: {
        must_avoid: ['but', 'however', 'although'],
        prefer: ['understand', 'hear', 'feel', 'sounds']
    },
    greeting: {
        prefer: ['hey', 'hi', 'hello', 'welcome']
    }
};

// ============================================
// LANGUAGE RESPONSE TEMPLATES
// ============================================
const LANGUAGE_INSTRUCTIONS = {
    'english': {
        instruction: 'Respond ONLY in English. Keep it natural and conversational.',
        example_style: 'Natural, warm English'
    },
    'hindi': {
        instruction: 'Respond ONLY in Hindi (Roman script / transliteration). Keep it warm and simple. Example: "Main yahan hoon tumhare liye."',
        example_style: 'Hindi in Roman script'
    },
    'hinglish': {
        instruction: 'Respond in HINGLISH - a natural mix of Hindi and English. Mirror the user\'s style. Example: "Hey, main samajh sakti hoon. It must be really tough."',
        example_style: 'Natural Hindi-English mix'
    }
};

// ============================================
// MAIN CHAT PIPELINE CLASS
// ============================================

class ChatPipeline {
    constructor(options = {}) {
        this.debug = options.debug || false;
        this.userContext = options.userContext || {};
    }

    /**
     * Process a user message through the complete pipeline
     * 
     * @param {string} rawMessage - Original user message
     * @param {Array} chatHistory - Recent conversation history
     * @param {Object} userDetails - User profile information
     * @returns {Object} Complete pipeline output
     */
    async process(rawMessage, chatHistory = [], userDetails = {}) {
        const pipelineStart = Date.now();
        const pipelineOutput = {
            steps: {},
            timing: {}
        };

        try {
            // ============================================
            // STEP 1: PRE-PROCESSING
            // ============================================
            const step1Start = Date.now();

            // Quick crisis check first (fast path)
            const isCrisis = quickCrisisCheck(rawMessage);

            // Full pre-processing
            const preprocessed = preprocessMessage(rawMessage);

            pipelineOutput.steps.preprocessing = preprocessed;
            pipelineOutput.timing.preprocessing = Date.now() - step1Start;

            if (this.debug) {
                console.log('🔍 [STEP 1] Pre-processing:', {
                    normalized: preprocessed.normalized_text,
                    language: preprocessed.language,
                    emoji_hint: preprocessed.emoji_emotion_hint,
                    crisis_flag: preprocessed.crisis_flag,
                    structure: preprocessed.structure
                });
            }

            // ============================================
            // STEP 2: INTENT DETECTION
            // ============================================
            const step2Start = Date.now();

            const intentResult = detectIntent(preprocessed, chatHistory);

            pipelineOutput.steps.intent = intentResult;
            pipelineOutput.timing.intent = Date.now() - step2Start;

            if (this.debug) {
                console.log('🎯 [STEP 2] Intent Detection:', {
                    primary: intentResult.primary_intent,
                    secondary: intentResult.secondary_intent,
                    confidence: intentResult.confidence,
                    action: intentResult.action
                });
            }

            // ============================================
            // STEP 3: RESPONSE STRATEGY SELECTION
            // ============================================
            const step3Start = Date.now();

            const strategyResult = selectResponseStrategy(
                preprocessed,
                intentResult,
                chatHistory
            );

            pipelineOutput.steps.strategy = strategyResult;
            pipelineOutput.timing.strategy = Date.now() - step3Start;

            if (this.debug) {
                console.log('📋 [STEP 3] Strategy Selection:', {
                    strategy: strategyResult.strategy.name,
                    priority: strategyResult.priority,
                    modifiers: Object.keys(strategyResult.modifiers)
                });
            }

            // ============================================
            // STEP 4: LLM PROMPT BUILDER
            // ============================================
            const step4Start = Date.now();

            const userContextString = this._buildUserContext(userDetails);
            const systemInstruction = generateSystemInstruction(strategyResult, userContextString);
            const languageInstruction = this._getLanguageInstruction(preprocessed.language, chatHistory);

            const llmPrompt = {
                systemPrompt: systemInstruction + '\n\n' + languageInstruction,
                preprocessedData: preprocessed,
                intent: intentResult,
                strategy: strategyResult.strategy.code,
                language: preprocessed.language
            };

            pipelineOutput.steps.prompt = llmPrompt;
            pipelineOutput.timing.prompt = Date.now() - step4Start;

            if (this.debug) {
                console.log('📝 [STEP 4] Prompt Built:', {
                    strategyCode: strategyResult.strategy.code,
                    language: preprocessed.language,
                    promptLength: systemInstruction.length
                });
            }

            // ============================================
            // STEP 5: CRISIS CHECK (If applicable)
            // ============================================
            if (preprocessed.crisis_flag === 'immediate' || preprocessed.crisis_flag === 'likely') {
                const crisisResponse = getCrisisResponse(preprocessed.crisis_flag, preprocessed.language);

                pipelineOutput.crisisOverride = true;
                pipelineOutput.crisisResponse = crisisResponse;
                pipelineOutput.steps.crisis = {
                    flag: preprocessed.crisis_flag,
                    response_provided: true
                };

                if (this.debug) {
                    console.log('🚨 [CRISIS] Override activated:', preprocessed.crisis_flag);
                }
            }

            // ============================================
            // FINALIZE OUTPUT
            // ============================================
            pipelineOutput.timing.total = Date.now() - pipelineStart;
            pipelineOutput.success = true;

            return pipelineOutput;

        } catch (error) {
            console.error('❌ Pipeline Error:', error);
            pipelineOutput.success = false;
            pipelineOutput.error = error.message;
            pipelineOutput.timing.total = Date.now() - pipelineStart;

            // Return fallback
            return pipelineOutput;
        }
    }

    /**
     * Build user context string for LLM
     */
    _buildUserContext(userDetails) {
        const parts = [];

        if (userDetails.name) {
            parts.push(`Name: ${userDetails.name}`);
        }
        if (userDetails.gender) {
            parts.push(`Gender: ${userDetails.gender}`);
        }
        if (userDetails.ageRange) {
            parts.push(`Age Range: ${userDetails.ageRange}`);
        }
        if (userDetails.profession) {
            parts.push(`Profession: ${userDetails.profession}`);
        }
        if (userDetails.interests && userDetails.interests.length > 0) {
            parts.push(`Interests: ${userDetails.interests.join(', ')}`);
        }

        return parts.join('\n');
    }

    /**
     * Get language instruction based on detected language and history
     */
    _getLanguageInstruction(detectedLanguage, chatHistory) {
        // Check history for consistent language
        let confirmedLanguage = detectedLanguage;

        if (chatHistory && chatHistory.length > 0) {
            // Look at last 3 user messages
            const recentUserMsgs = chatHistory
                .filter(m => m.sender === 'user')
                .slice(-3)
                .map(m => m.content)
                .join(' ');

            if (recentUserMsgs) {
                const historyLanguage = detectLanguage(recentUserMsgs);
                // If history suggests different language and is more confident
                if (historyLanguage !== 'english' && detectedLanguage === 'english') {
                    confirmedLanguage = historyLanguage;
                }
            }
        }

        const langConfig = LANGUAGE_INSTRUCTIONS[confirmedLanguage] || LANGUAGE_INSTRUCTIONS.english;

        return `LANGUAGE RULE (CRITICAL):
${langConfig.instruction}
Style: ${langConfig.example_style}`;
    }

    /**
     * Validate AI response safety and tone
     * Call this after getting LLM response
     */
    validateResponse(response, strategyCode) {
        const issues = [];
        const lowerResponse = response.toLowerCase();

        // Check for harmful content
        for (const [category, phrases] of Object.entries(INAPPROPRIATE_RESPONSES)) {
            for (const phrase of phrases) {
                if (lowerResponse.includes(phrase)) {
                    issues.push({
                        type: 'harmful',
                        category,
                        phrase
                    });
                }
            }
        }

        // Check tone requirements based on strategy
        const toneReq = TONE_REQUIREMENTS[strategyCode?.toLowerCase()];
        if (toneReq) {
            if (toneReq.must_avoid) {
                for (const word of toneReq.must_avoid) {
                    if (lowerResponse.includes(word)) {
                        issues.push({
                            type: 'tone',
                            message: `Contains "${word}" which should be avoided in ${strategyCode} responses`
                        });
                    }
                }
            }
        }

        return {
            valid: issues.length === 0,
            issues,
            severity: issues.some(i => i.type === 'harmful') ? 'critical' : 'minor'
        };
    }

    /**
     * Get a safe fallback response
     */
    getFallbackResponse(language = 'english', reason = 'error') {
        const fallbacks = {
            english: "I'm here for you. Would you like to tell me more about what's on your mind?",
            hindi: "Main yahan hoon tumhare liye. Aur batana chahoge kya chal raha hai?",
            hinglish: "Main yahan hoon tumhare liye. Tell me more about what's going on?"
        };

        return fallbacks[language] || fallbacks.english;
    }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Quick pipeline processing for simple cases
 */
async function quickProcess(message, chatHistory = [], userDetails = {}) {
    const pipeline = new ChatPipeline({ debug: false });
    return pipeline.process(message, chatHistory, userDetails);
}

/**
 * Get system prompt for a message (main entry point for API)
 */
async function buildSystemPrompt(message, chatHistory = [], userDetails = {}) {
    const pipeline = new ChatPipeline({ debug: process.env.NODE_ENV === 'development' });
    const result = await pipeline.process(message, chatHistory, userDetails);

    if (!result.success) {
        // Return basic prompt on error
        return {
            systemPrompt: `You are TARA, a compassionate AI wellness companion. Be warm, supportive, and natural.`,
            language: 'english',
            strategy: 'CASUAL'
        };
    }

    // Check for crisis override
    if (result.crisisOverride) {
        return {
            systemPrompt: result.steps.prompt.systemPrompt,
            language: result.steps.preprocessing.language,
            strategy: 'CRISIS',
            crisisResponse: result.crisisResponse,
            skipLLM: result.crisisResponse ? true : false
        };
    }

    return {
        systemPrompt: result.steps.prompt.systemPrompt,
        language: result.steps.preprocessing.language,
        strategy: result.steps.strategy.strategy.code,
        intent: result.steps.intent.primary_intent,
        confidence: result.steps.intent.confidence,
        modifiers: result.steps.strategy.modifiers
    };
}

// CommonJS exports for Next.js API route compatibility
module.exports = {
    ChatPipeline,
    quickProcess,
    buildSystemPrompt,
    preprocessMessage,
    detectIntent,
    selectResponseStrategy,
    STRATEGIES,
    INTENT_TYPES
};
