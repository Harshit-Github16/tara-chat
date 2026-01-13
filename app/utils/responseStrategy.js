/**
 * Response Strategy Selector for Tara Chat
 * Step 3 of the Chat Response Strategy Pipeline
 * 
 * Determines the optimal response strategy based on:
 * - Pre-processed message signals
 * - Detected intent
 * - Conversation history context
 * - User emotional state
 */

// Use require for Next.js API route compatibility
const { INTENT_TYPES } = require('./intentDetection');

// ============================================
// RESPONSE STRATEGIES
// ============================================
const STRATEGIES = {
    DEEP_VALIDATION: {
        name: 'Deep Validation',
        code: 'VALIDATION',
        description: 'User feels unheard or has intense emotions',
        instruction: `STRATEGY: DEEP VALIDATION
• GOAL: Make them feel truly understood.
• Mirror their feelings naturally without being robotic.
• Avoid phrases like "I hear that you are..." - use natural acknowledgments instead.
• Say things like "That sounds incredibly tough" or "I can't imagine how hard that must be."
• Be a listening ear first, advice second.
• Use empathetic reflections that show you understand their specific situation.`
    },

    EMOTIONAL_CONTAINMENT: {
        name: 'Emotional Containment',
        code: 'CONTAINMENT',
        description: 'User is overwhelmed or anxious',
        instruction: `STRATEGY: EMOTIONAL CONTAINMENT
• GOAL: Be a grounding force and create safety.
• Use calm, steady, and short sentences.
• Validate first: "It's totally okay to feel this way."
• Gently bring them to the present: "I'm right here with you. Just take a breath."
• Avoid overwhelming them with questions or advice.
• Create a safe, calm space in your response.`
    },

    GENTLE_EMPOWERMENT: {
        name: 'Gentle Empowerment',
        code: 'EMPOWERMENT',
        description: 'User is stuck or sad but calm enough for nudging',
        instruction: `STRATEGY: GENTLE EMPOWERMENT
• GOAL: Remind them of their own strength without being preachy.
• Validate their struggle first, then gently nudge forward.
• Ask small, low-pressure questions: "What's one tiny thing you could do for yourself right now?"
• Focus on small wins and achievable steps.
• Don't force positivity - acknowledge their reality while offering hope.`
    },

    SHARED_JOY: {
        name: 'Shared Joy',
        code: 'CELEBRATION',
        description: 'User is happy or proud',
        instruction: `STRATEGY: SHARED JOY
• GOAL: Amplify their happiness genuinely!
• Match their energy with warmth and enthusiasm.
• Celebrate with them: "That is amazing news! I'm so happy for you! 🎉"
• Ask them to share more details about what's making them happy.
• Let them bask in the positive moment.`
    },

    GENTLE_CLARIFICATION: {
        name: 'Gentle Clarification',
        code: 'CLARIFICATION',
        description: 'User seems confused or message is vague',
        instruction: `STRATEGY: GENTLE CLARIFICATION
• GOAL: Help them find clarity without pressure.
• Start soft: "It sounds like a lot is on your mind."
• Ask ONE simple question to help them focus: "What's the main thing bothering you right now?"
• Don't overwhelm with multiple questions.
• Be patient and non-judgmental.`
    },

    CRISIS_SUPPORT: {
        name: 'Crisis Support',
        code: 'CRISIS',
        description: 'User shows signs of severe distress or danger',
        instruction: `STRATEGY: CRISIS SUPPORT (SAFETY FIRST)
• This is a priority response - safety above all else.
• Be direct, compassionate, and prioritize their wellbeing.
• Say: "I am hearing a lot of pain. Please know I care about you. Are you safe right now?"
• Provide crisis helpline information (iCall: 9152987821, Vandrevala: 1860-2662-345)
• Do NOT minimize their feelings or lecture them.
• Stay with them emotionally.`
    },

    GENTLE_RE_ENGAGEMENT: {
        name: 'Gentle Re-engagement',
        code: 'RE_ENGAGEMENT',
        description: 'User is withdrawn or giving short, disengaged responses',
        instruction: `STRATEGY: GENTLE RE-ENGAGEMENT
• GOAL: Gently invite them to share more without being pushy.
• Match their energy level initially.
• Add a warm, open-ended invitation: "I'm here if you want to talk more about that. How's everything else going?"
• Keep it natural, not robotic or interrogative.
• Give them space while showing you care.`
    },

    CASUAL_FLOW: {
        name: 'Casual Flow',
        code: 'CASUAL',
        description: 'Normal conversation, no specific emotional state detected',
        instruction: `STRATEGY: CASUAL FLOW
• GOAL: Match the user's conversational tone naturally.
• Keep it light and engaging.
• Use appropriate humor if the conversation allows.
• Be friendly without forcing emotionality.
• Respond like a supportive friend having a normal chat.`
    },

    GRATITUDE_RESPONSE: {
        name: 'Gratitude Response',
        code: 'GRATITUDE',
        description: 'User is expressing thanks or appreciation',
        instruction: `STRATEGY: GRATITUDE RESPONSE
• Acknowledge their thanks warmly.
• Reflect their appreciation back: "I'm glad I could help! 💛"
• Keep it brief and genuine.
• Optionally invite continued conversation if appropriate.`
    },

    WARM_GREETING: {
        name: 'Warm Greeting',
        code: 'GREETING',
        description: 'User is starting a conversation',
        instruction: `STRATEGY: WARM GREETING
• Respond with genuine warmth and openness.
• Match their greeting style (casual/formal/Hinglish).
• Ask an open-ended question to invite them to share.
• Keep it brief but inviting.
• Example: "Hey! Great to hear from you! How's your day going? 😊"`
    },

    GENTLE_FAREWELL: {
        name: 'Gentle Farewell',
        code: 'FAREWELL',
        description: 'User is ending the conversation',
        instruction: `STRATEGY: GENTLE FAREWELL
• Acknowledge the goodbye warmly.
• Leave them with something positive.
• Remind them you're always here.
• Example: "Take care! I'm always here whenever you need to talk. 💛"`
    },

    REFLECTIVE_SUPPORT: {
        name: 'Reflective Support',
        code: 'REFLECTION',
        description: 'User is sharing insights or realizations',
        instruction: `STRATEGY: REFLECTIVE SUPPORT
• Honor their reflection with acknowledgment.
• Validate their insight: "That's a really important realization."
• Ask if they'd like to explore this thought further.
• Be a thoughtful companion in their self-discovery.`
    },

    GOAL_SUPPORT: {
        name: 'Goal Support',
        code: 'GOAL',
        description: 'User is setting goals or expressing intentions',
        instruction: `STRATEGY: GOAL SUPPORT
• Celebrate their intention and initiative.
• Help break down their goal into smaller steps if appropriate.
• Be encouraging without creating pressure.
• Ask about their first small step.`
    }
};

// ============================================
// INTENT TO STRATEGY MAPPING
// ============================================
const INTENT_STRATEGY_MAP = {
    [INTENT_TYPES.EMOTIONAL_EXPRESSION]: {
        default: STRATEGIES.DEEP_VALIDATION,
        byEmotion: {
            'joy': STRATEGIES.SHARED_JOY,
            'happiness': STRATEGIES.SHARED_JOY,
            'celebration': STRATEGIES.SHARED_JOY,
            'anxiety': STRATEGIES.EMOTIONAL_CONTAINMENT,
            'overwhelm': STRATEGIES.EMOTIONAL_CONTAINMENT,
            'fear': STRATEGIES.EMOTIONAL_CONTAINMENT,
            'distress': STRATEGIES.EMOTIONAL_CONTAINMENT,
            'sadness': STRATEGIES.DEEP_VALIDATION,
            'anger': STRATEGIES.DEEP_VALIDATION,
            'numbness': STRATEGIES.GENTLE_RE_ENGAGEMENT
        }
    },
    [INTENT_TYPES.UNDERSTANDING_EMOTIONS]: STRATEGIES.REFLECTIVE_SUPPORT,
    [INTENT_TYPES.ASKING_FOR_ADVICE]: STRATEGIES.GENTLE_EMPOWERMENT,
    [INTENT_TYPES.HELP_SEEKING]: STRATEGIES.DEEP_VALIDATION,
    [INTENT_TYPES.VENTING]: STRATEGIES.DEEP_VALIDATION,
    [INTENT_TYPES.CASUAL_CHAT]: STRATEGIES.CASUAL_FLOW,
    [INTENT_TYPES.GREETING]: STRATEGIES.WARM_GREETING,
    [INTENT_TYPES.GRATITUDE]: STRATEGIES.GRATITUDE_RESPONSE,
    [INTENT_TYPES.CRISIS]: STRATEGIES.CRISIS_SUPPORT,
    [INTENT_TYPES.WITHDRAWAL]: STRATEGIES.GENTLE_RE_ENGAGEMENT,
    [INTENT_TYPES.SEEKING_VALIDATION]: STRATEGIES.DEEP_VALIDATION,
    [INTENT_TYPES.GOAL_SETTING]: STRATEGIES.GOAL_SUPPORT,
    [INTENT_TYPES.REFLECTION]: STRATEGIES.REFLECTIVE_SUPPORT,
    [INTENT_TYPES.FAREWELL]: STRATEGIES.GENTLE_FAREWELL
};

// ============================================
// MAIN STRATEGY SELECTOR
// ============================================

/**
 * Select the optimal response strategy based on all available signals
 * 
 * @param {Object} preprocessedData - Output from messagePreprocessor
 * @param {Object} intentResult - Output from intentDetection
 * @param {Array} chatHistory - Recent conversation history
 * @returns {Object} Selected strategy with context
 */
function selectResponseStrategy(preprocessedData, intentResult, chatHistory = []) {
    const { primary_intent, secondary_intent, confidence, action, crisis_override } = intentResult;
    const { emoji_emotion_hint, structure, message_length, crisis_flag, language } = preprocessedData;

    // CRITICAL: Crisis override
    if (crisis_override || crisis_flag === 'immediate' || crisis_flag === 'likely') {
        return {
            strategy: STRATEGIES.CRISIS_SUPPORT,
            priority: 'critical',
            modifiers: {
                language,
                provide_helplines: true,
                skip_normal_flow: true
            },
            reasoning: 'Crisis flag detected - safety protocol activated'
        };
    }

    // Get base strategy from intent
    let selectedStrategy;
    const strategyConfig = INTENT_STRATEGY_MAP[primary_intent];

    if (strategyConfig) {
        if (typeof strategyConfig === 'object' && strategyConfig.default) {
            // Intent has emotion-specific strategies
            selectedStrategy = strategyConfig.default;

            // Check for emotion-specific override
            if (emoji_emotion_hint && strategyConfig.byEmotion?.[emoji_emotion_hint]) {
                selectedStrategy = strategyConfig.byEmotion[emoji_emotion_hint];
            }
        } else {
            selectedStrategy = strategyConfig;
        }
    } else {
        selectedStrategy = STRATEGIES.CASUAL_FLOW;
    }

    // Apply modifiers based on confidence and action
    const modifiers = {
        language,
        confidence_level: confidence >= 0.75 ? 'high' : confidence >= 0.5 ? 'medium' : 'low'
    };

    // Low confidence modifier
    if (action === 'clarify') {
        modifiers.add_clarification = true;
        modifiers.clarification_type = 'open_ended';
    } else if (action === 'soft_clarify') {
        modifiers.add_clarification = true;
        modifiers.clarification_type = 'gentle';
    }

    // Monitor mode for possible crisis
    if (action === 'monitor' || crisis_flag === 'possible') {
        modifiers.heightened_sensitivity = true;
        modifiers.check_wellbeing = true;
    }

    // Structure-based modifiers
    if (structure === 'fragmented') {
        modifiers.use_shorter_sentences = true;
        modifiers.extra_gentle = true;
    } else if (structure === 'rambling') {
        modifiers.be_concise = true;
        modifiers.help_organize_thoughts = true;
    }

    // Length-based modifiers
    if (message_length === 'very_short') {
        modifiers.invite_more_sharing = true;
    } else if (message_length === 'very_long') {
        modifiers.acknowledge_volume = true;
    }

    // Priority determination
    let priority = 'normal';
    if (crisis_flag === 'possible') priority = 'elevated';
    if (selectedStrategy.code === 'CONTAINMENT') priority = 'elevated';

    return {
        strategy: selectedStrategy,
        priority,
        modifiers,
        intent_context: {
            primary: primary_intent,
            secondary: secondary_intent,
            confidence
        },
        reasoning: generateStrategyReasoning(selectedStrategy, intentResult, preprocessedData)
    };
}

/**
 * Generate human-readable reasoning for strategy selection
 */
function generateStrategyReasoning(strategy, intentResult, preprocessedData) {
    const parts = [];

    parts.push(`Detected intent: ${intentResult.primary_intent} (${Math.round(intentResult.confidence * 100)}% confidence)`);

    if (intentResult.secondary_intent) {
        parts.push(`Secondary: ${intentResult.secondary_intent}`);
    }

    if (preprocessedData.emoji_emotion_hint) {
        parts.push(`Emoji signal: ${preprocessedData.emoji_emotion_hint}`);
    }

    if (preprocessedData.structure !== 'simple') {
        parts.push(`Message structure: ${preprocessedData.structure}`);
    }

    parts.push(`Selected strategy: ${strategy.name}`);

    return parts.join(' | ');
}

/**
 * Generate complete system instruction combining strategy and modifiers
 */
function generateSystemInstruction(strategyResult, userContext = '') {
    const { strategy, modifiers, intent_context, reasoning } = strategyResult;

    let instruction = `
=== RESPONSE STRATEGY: ${strategy.name} ===
${strategy.instruction}

`;

    // Add modifiers
    const activeModifiers = [];

    if (modifiers.add_clarification) {
        if (modifiers.clarification_type === 'open_ended') {
            activeModifiers.push('Include an open-ended question to better understand the user');
        } else {
            activeModifiers.push('Gently ask a follow-up to clarify');
        }
    }

    if (modifiers.heightened_sensitivity) {
        activeModifiers.push('Use extra care and gentleness - monitor for distress');
    }

    if (modifiers.check_wellbeing) {
        activeModifiers.push('Check on their wellbeing naturally in your response');
    }

    if (modifiers.use_shorter_sentences) {
        activeModifiers.push('Use shorter, calmer sentences - user seems fragmented');
    }

    if (modifiers.be_concise) {
        activeModifiers.push('Keep response focused and concise - user shared a lot');
    }

    if (modifiers.invite_more_sharing) {
        activeModifiers.push('Gently invite them to share more if comfortable');
    }

    if (modifiers.provide_helplines) {
        activeModifiers.push('CRITICAL: Provide crisis helpline - iCall: 9152987821, Vandrevala: 1860-2662-345');
    }

    if (activeModifiers.length > 0) {
        instruction += `MODIFIERS:
${activeModifiers.map(m => `• ${m}`).join('\n')}

`;
    }

    // Add user context if provided
    if (userContext) {
        instruction += `USER CONTEXT:
${userContext}

`;
    }

    // Add intent context
    instruction += `DETECTED INTENT: ${intent_context.primary}${intent_context.secondary ? ` (${intent_context.secondary})` : ''}
CONFIDENCE: ${Math.round(intent_context.confidence * 100)}%

`;

    instruction += `Follow this strategy for the next response. Stay authentic and natural.`;

    return instruction;
}

/**
 * Get quick strategy for simple cases (optimization)
 */
function getQuickStrategy(intentType) {
    return INTENT_STRATEGY_MAP[intentType] || STRATEGIES.CASUAL_FLOW;
}

// CommonJS exports for Next.js API route compatibility
module.exports = {
    STRATEGIES,
    selectResponseStrategy,
    generateSystemInstruction,
    getQuickStrategy
};
