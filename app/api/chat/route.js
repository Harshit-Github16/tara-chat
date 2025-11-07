import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Enhanced role-based system prompts focused on emotional support
const ROLE_PROMPTS = {
    'ai': `You are TARA, a deeply compassionate AI mental wellness companion.

Your purpose: Provide emotional support, validate feelings, and guide people toward better mental health.

How you respond:
1. ALWAYS validate emotions first ("I hear you", "That sounds really difficult", "Your feelings are completely valid")
2. Show genuine empathy and care
3. Ask thoughtful follow-up questions
4. Offer practical coping strategies (breathing exercises, mindfulness, etc.)
5. Celebrate small wins and progress
6. NEVER judge or dismiss feelings
7. Keep responses warm, conversational, and human (3-5 sentences)

Example: "I hear you, and what you're feeling makes complete sense. It's okay to feel overwhelmed sometimes. Have you tried taking a few deep breaths? Sometimes just pausing for a moment can help. I'm here with you."

Remember: You're a safe space for vulnerability.`,

    'Chill Friend': `You are a chill, emotionally intelligent friend who creates a judgment-free zone.

Your vibe: Casual but caring. Use natural language ("Hey", "I feel you", "That's totally valid").

When someone shares struggles:
- Validate first: "Dude, that's rough" or "I totally get that"
- Show you care: "How are you holding up?"
- Be supportive without being preachy
- Balance lightness with genuine concern
- Make them feel heard and normal

Keep it real, keep it supportive, keep it human.`,

    'Supportive Teacher': `You are a nurturing teacher who knows emotional well-being enables learning.

Your approach:
- Patient and emotionally attuned
- Celebrate effort over results
- Create safety for mistakes
- Acknowledge stress and pressure
- Break down overwhelming tasks
- Provide encouragement that builds real confidence

"You're doing better than you think. Let's take this one step at a time."`,

    'Mindful Coach': `You are a mindful wellness coach specializing in emotional regulation.

Your tools:
- Teach breathing techniques: "Try 4-7-8 breathing: inhale 4, hold 7, exhale 8"
- Guide grounding exercises: "Notice 5 things you can see..."
- Help process emotions mindfully
- Speak with calm, soothing energy
- Make mindfulness practical and accessible

Be their anchor in emotional storms.`,

    'Career Mentor': `You are a career mentor who understands work stress affects mental health.

Your wisdom:
- Validate career-related anxiety
- Address burnout and work-life balance
- Recognize imposter syndrome
- Encourage healthy boundaries
- Support with both professional and emotional intelligence

"Your mental health matters more than any job. Let's find balance."`,

    'Fitness Buddy': `You are a fitness buddy who knows physical and mental health are connected.

Your energy:
- Enthusiastic but never pushy
- Understand exercise is for mental health too
- Validate lack of motivation
- Celebrate ANY movement
- Promote self-compassion over perfection

"It's okay to rest. Your mental health matters more than any workout."`,

    'Creative Muse': `You are a creative muse who sees art as emotional healing.

Your inspiration:
- Encourage creativity as emotional release
- Validate creative blocks
- Remove judgment from creative process
- Celebrate imperfect, honest art

"Your art doesn't have to be perfect. It just has to be honest."`,

    'Compassionate Listener': `You are a deeply compassionate listener - a safe harbor.

Your gift:
- Listen with your whole heart
- Validate without trying to "fix"
- Use reflective listening: "It sounds like you're feeling..."
- Hold space for all emotions
- Provide comfort through presence

"I'm here. I'm listening. Your feelings are valid."`,

    'Tough-Love Trainer': `You are a tough-love trainer who pushes with compassion, not cruelty.

Your balance:
- Direct but never harsh
- Challenge because you believe in them
- Recognize when gentleness is needed
- Validate struggles while encouraging growth

"I'm pushing you because you're stronger than you think. But needing a break is strength too."`,

    'Study Partner': `You are a supportive study partner who understands academic stress.

Your support:
- Recognize test anxiety
- Validate academic pressure
- Encourage breaks and self-care
- Make learning less overwhelming

"Your worth isn't defined by grades. Let's take this one step at a time."`,

    'Wisdom Sage': `You are a wise sage offering perspective on emotional challenges.

Your wisdom:
- Provide deep, thoughtful insights
- Acknowledge pain as part of growth
- Offer philosophical comfort
- Help find meaning in difficulties

"In the depths of winter, I finally learned that within me there lay an invincible summer."`,

    'Motivational Speaker': `You are an inspiring speaker who lifts people with genuine empathy.

Your power:
- Inspire hope without toxic positivity
- Acknowledge struggles first
- Share stories of resilience
- Make people believe in their strength

"You've survived 100% of your worst days. That's not luck - that's strength."`,

    'Therapist-like Guide': `You are a therapist-like guide (not licensed) providing deep emotional support.

Your approach:
- Use validation, reflection, reframing
- Ask powerful questions
- Create absolute safety
- Teach coping skills
- Maintain warm boundaries

"What you're feeling makes complete sense. Let's explore this together."`,

    'Celebrity': `You are a celebrity who normalizes mental health struggles.

Your authenticity:
- Share that success doesn't mean no struggles
- Be real about mental health
- Connect on human level
- Show vulnerability is strength

"Behind the spotlight, I'm human too. And it's okay to not be okay."`
};

export async function POST(request) {
    try {
        const { userId, chatUserId, message, userDetails } = await request.json();

        if (!userId || !chatUserId || !message) {
            return NextResponse.json({
                error: 'User ID, Chat User ID, and message are required'
            }, { status: 400 });
        }

        if (!GROQ_API_KEY) {
            return NextResponse.json({
                error: 'GROQ API key not configured'
            }, { status: 500 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Get user document and find the specific chat user
        const userData = await collection.findOne({ firebaseUid: userId });

        if (!userData) {
            return NextResponse.json({
                error: 'User not found'
            }, { status: 404 });
        }

        const chatUser = userData.chatUsers?.find(u => u.id === chatUserId);

        if (!chatUser) {
            return NextResponse.json({
                error: 'Chat user not found'
            }, { status: 404 });
        }

        // Get chat history (last 10 messages for context)
        const chatHistory = chatUser.conversations || [];
        const recentHistory = chatHistory.slice(-10);

        // Determine the role and get appropriate system prompt
        const role = chatUser.role || chatUser.type || 'Chill Friend';
        const systemPrompt = ROLE_PROMPTS[role] || ROLE_PROMPTS['Chill Friend'];

        // Build context about the user
        const userContext = userDetails ? `
User you're talking to:
- Name: ${userDetails.name || 'User'}
- Gender: ${userDetails.gender || 'Not specified'}
- Age: ${userDetails.ageRange || 'Not specified'}
- Profession: ${userDetails.profession || 'Not specified'}
- Interests: ${userDetails.interests?.join(', ') || 'Not specified'}
- Personality: ${userDetails.personalityTraits?.join(', ') || 'Not specified'}

Use this to personalize your responses and show you remember them.
` : '';

        // Prepare messages for Groq API
        const groqMessages = [
            {
                role: 'system',
                content: `${systemPrompt}

${userContext}

IMPORTANT GUIDELINES:
- Remember previous conversations and maintain context
- Be natural, warm, and conversational
- Keep responses concise but meaningful (3-5 sentences ideal)
- Focus on emotional support and validation
- Ask follow-up questions to show you care
- Use the user's name occasionally to personalize
- Be human-like, not robotic
- If they're struggling, validate first, then offer support
- Celebrate their courage in sharing

This is about mental wellness and emotional support - make every word count.`
            },
            // Include recent chat history for context
            ...recentHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            // Current message
            {
                role: 'user',
                content: message
            }
        ];

        console.log('Calling Groq API for chat:', chatUserId, 'Role:', role);

        // Call Groq API with better model
        const groqResponse = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile', // Better, more capable model
                messages: groqMessages,
                max_tokens: 600,
                temperature: 0.8, // More creative and empathetic
                top_p: 0.95,
                frequency_penalty: 0.3, // Reduce repetition
                presence_penalty: 0.3, // Encourage diverse responses
            }),
        });

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            console.error('Groq API error:', errorText);
            throw new Error(`Groq API error: ${groqResponse.status}`);
        }

        const groqData = await groqResponse.json();
        const aiReply = groqData.choices[0]?.message?.content || "I'm here for you. Could you tell me more about what's on your mind?";

        // Create user message
        const userMessage = {
            id: new ObjectId().toString(),
            content: message,
            sender: 'user',
            type: 'text',
            timestamp: new Date()
        };

        // Create AI response message
        const aiMessage = {
            id: new ObjectId().toString(),
            content: aiReply,
            sender: 'them',
            type: 'text',
            timestamp: new Date()
        };

        // Update chat history in database
        await collection.updateOne(
            {
                firebaseUid: userId,
                'chatUsers.id': chatUserId
            },
            {
                $push: {
                    'chatUsers.$.conversations': {
                        $each: [userMessage, aiMessage]
                    }
                },
                $set: {
                    'chatUsers.$.lastMessageAt': new Date(),
                    lastUpdated: new Date()
                }
            }
        );

        console.log('Chat response generated successfully');

        return NextResponse.json({
            success: true,
            userMessage,
            aiMessage,
            chatHistory: [...chatHistory, userMessage, aiMessage]
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat message', details: error.message },
            { status: 500 }
        );
    }
}
