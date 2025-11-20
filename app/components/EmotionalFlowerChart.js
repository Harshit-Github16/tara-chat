"use client";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Plutchik's 8 basic emotions with colors
const EMOTIONS = [
    { name: "Joy", color: "#FFD700", emoji: "😊" },
    { name: "Trust", color: "#90EE90", emoji: "🤝" },
    { name: "Fear", color: "#9370DB", emoji: "😨" },
    { name: "Surprise", color: "#87CEEB", emoji: "😲" },
    { name: "Sadness", color: "#4682B4", emoji: "😢" },
    { name: "Disgust", color: "#9ACD32", emoji: "🤢" },
    { name: "Anger", color: "#FF6347", emoji: "😠" },
    { name: "Anticipation", color: "#FFA500", emoji: "🤔" }
];

export default function EmotionalFlowerChart() {
    const [emotionData, setEmotionData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJournalData();
    }, []);

    const fetchJournalData = async () => {
        try {
            setLoading(true);

            // Fetch both mood entries and journals from user data
            const response = await api.get('/api/user-data');

            if (response.ok) {
                const data = await response.json();
                const moods = data.moods || [];
                const journals = data.journals || [];

                console.log('Fetched moods:', moods.length, 'journals:', journals.length);

                // Analyze emotions from both moods and journals
                const emotions = analyzeEmotions(moods, journals);
                setEmotionData(emotions);
            } else {
                // Silently handle error - user might not be logged in
                console.log('Could not fetch user data - user may not be logged in');
                setEmotionData({});
            }
        } catch (error) {
            // Silently handle error - user might not be logged in
            console.log('Error fetching journal data - user may not be logged in');
            setEmotionData({});
        } finally {
            setLoading(false);
        }
    };

    const analyzeEmotions = (moods, journals) => {
        // Initialize emotion counts
        const emotionCounts = {
            Joy: 0,
            Trust: 0,
            Fear: 0,
            Surprise: 0,
            Sadness: 0,
            Disgust: 0,
            Anger: 0,
            Anticipation: 0
        };

        // Mood to emotion mapping with weights
        const moodToEmotion = {
            'happy': { emotion: 'Joy', weight: 2 },
            'grateful': { emotion: 'Joy', weight: 2 },
            'motivated': { emotion: 'Anticipation', weight: 2 },
            'calm': { emotion: 'Trust', weight: 2 },
            'healing': { emotion: 'Trust', weight: 1 },
            'sad': { emotion: 'Sadness', weight: 3 },
            'lonely': { emotion: 'Sadness', weight: 3 },
            'stressed': { emotion: 'Fear', weight: 2 },
            'anxious': { emotion: 'Fear', weight: 2 },
            'overwhelmed': { emotion: 'Fear', weight: 3 },
            'angry': { emotion: 'Anger', weight: 3 },
            'lost': { emotion: 'Sadness', weight: 2 }
        };

        // Count emotions from mood entries with weights
        moods.forEach(mood => {
            const moodValue = mood.mood?.toLowerCase();
            const moodMapping = moodToEmotion[moodValue];

            if (moodMapping) {
                emotionCounts[moodMapping.emotion] += moodMapping.weight;
            }

            // Analyze mood note for emotion keywords if available
            if (mood.note) {
                const text = mood.note.toLowerCase();

                // Sadness keywords (check first as it's most common)
                const sadnessMatches = text.match(/\b(sad|sadness|depressed|depression|down|unhappy|miserable|lonely|loneliness|hurt|hurting|grief|grieve|grieving|loss|lost|cry|crying|tears|heartbroken|heartbreak|sorrow|despair|hopeless|empty|numb)\b/g);
                if (sadnessMatches) emotionCounts.Sadness += sadnessMatches.length;

                // Fear keywords (includes overwhelmed, anxious, etc)
                const fearMatches = text.match(/\b(fear|scared|worried|worry|anxious|anxiety|nervous|afraid|panic|panicking|overwhelmed|overwhelming|stress|stressed|stressful|terrified|dread)\b/g);
                if (fearMatches) emotionCounts.Fear += fearMatches.length;

                // Joy keywords
                const joyMatches = text.match(/\b(happy|happiness|joy|joyful|excited|excitement|great|wonderful|amazing|fantastic|love|loving|loved|blessed|delighted|cheerful|pleased|content|glad)\b/g);
                if (joyMatches) emotionCounts.Joy += joyMatches.length;

                // Trust keywords
                const trustMatches = text.match(/\b(trust|trusting|safe|safety|secure|security|confident|confidence|comfortable|peaceful|peace|calm|calming|relaxed|serene)\b/g);
                if (trustMatches) emotionCounts.Trust += trustMatches.length;

                // Anger keywords
                const angerMatches = text.match(/\b(angry|anger|mad|furious|rage|irritated|irritation|frustrated|frustration|annoyed|annoying|pissed|upset|outraged)\b/g);
                if (angerMatches) emotionCounts.Anger += angerMatches.length;

                // Disgust keywords
                const disgustMatches = text.match(/\b(disgust|disgusted|disgusting|hate|hatred|awful|terrible|horrible|sick|revolting|repulsed|gross)\b/g);
                if (disgustMatches) emotionCounts.Disgust += disgustMatches.length;

                // Surprise keywords
                const surpriseMatches = text.match(/\b(surprise|surprised|surprising|unexpected|unexpectedly|shock|shocked|shocking|amaze|amazed|amazing|astonish|wow|sudden|suddenly)\b/g);
                if (surpriseMatches) emotionCounts.Surprise += surpriseMatches.length;

                // Anticipation keywords
                const anticipationMatches = text.match(/\b(hope|hopeful|hoping|expect|expecting|anticipate|anticipating|looking forward|excited|eager|eagerly|optimistic|planning)\b/g);
                if (anticipationMatches) emotionCounts.Anticipation += anticipationMatches.length;
            }
        });

        // Analyze detailed journal entries (with more weight as they have more content)
        journals.forEach(journal => {
            if (journal.content) {
                const text = journal.content.toLowerCase();

                // Sadness keywords (weight x2 for journal content)
                const sadnessMatches = text.match(/\b(sad|sadness|depressed|depression|down|unhappy|miserable|lonely|loneliness|hurt|hurting|grief|grieve|grieving|loss|lost|cry|crying|tears|heartbroken|heartbreak|sorrow|despair|hopeless|empty|numb)\b/g);
                if (sadnessMatches) emotionCounts.Sadness += sadnessMatches.length * 2;

                // Fear keywords (weight x2)
                const fearMatches = text.match(/\b(fear|scared|worried|worry|anxious|anxiety|nervous|afraid|panic|panicking|overwhelmed|overwhelming|stress|stressed|stressful|terrified|dread)\b/g);
                if (fearMatches) emotionCounts.Fear += fearMatches.length * 2;

                // Joy keywords (weight x2)
                const joyMatches = text.match(/\b(happy|happiness|joy|joyful|excited|excitement|great|wonderful|amazing|fantastic|love|loving|loved|blessed|delighted|cheerful|pleased|content|glad)\b/g);
                if (joyMatches) emotionCounts.Joy += joyMatches.length * 2;

                // Trust keywords (weight x2)
                const trustMatches = text.match(/\b(trust|trusting|safe|safety|secure|security|confident|confidence|comfortable|peaceful|peace|calm|calming|relaxed|serene)\b/g);
                if (trustMatches) emotionCounts.Trust += trustMatches.length * 2;

                // Anger keywords (weight x2)
                const angerMatches = text.match(/\b(angry|anger|mad|furious|rage|irritated|irritation|frustrated|frustration|annoyed|annoying|pissed|upset|outraged)\b/g);
                if (angerMatches) emotionCounts.Anger += angerMatches.length * 2;

                // Disgust keywords (weight x2)
                const disgustMatches = text.match(/\b(disgust|disgusted|disgusting|hate|hatred|awful|terrible|horrible|sick|revolting|repulsed|gross)\b/g);
                if (disgustMatches) emotionCounts.Disgust += disgustMatches.length * 2;

                // Surprise keywords (weight x2)
                const surpriseMatches = text.match(/\b(surprise|surprised|surprising|unexpected|unexpectedly|shock|shocked|shocking|amaze|amazed|amazing|astonish|wow|sudden|suddenly)\b/g);
                if (surpriseMatches) emotionCounts.Surprise += surpriseMatches.length * 2;

                // Anticipation keywords (weight x2)
                const anticipationMatches = text.match(/\b(hope|hopeful|hoping|expect|expecting|anticipate|anticipating|looking forward|excited|eager|eagerly|optimistic|planning)\b/g);
                if (anticipationMatches) emotionCounts.Anticipation += anticipationMatches.length * 2;
            }
        });

        console.log('Emotion counts:', emotionCounts);

        // Normalize to percentages (0-100)
        const total = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);
        const normalized = {};

        if (total > 0) {
            Object.keys(emotionCounts).forEach(emotion => {
                normalized[emotion] = Math.round((emotionCounts[emotion] / total) * 100);
            });
        } else {
            // Default values if no data
            Object.keys(emotionCounts).forEach(emotion => {
                normalized[emotion] = 0;
            });
        }

        return normalized;
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Analyzing your emotions...</p>
            </div>
        );
    }

    return <FlowerChart emotionData={emotionData} />;
}

function FlowerChart({ emotionData }) {
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 120;
    const numEmotions = EMOTIONS.length;
    const angleStep = (2 * Math.PI) / numEmotions;

    // Create petal points for each emotion
    const petals = EMOTIONS.map((emotion, index) => {
        const angle = index * angleStep - Math.PI / 2; // Start from top
        const value = emotionData[emotion.name] || 0;

        // Full petal size (always 100%)
        const fullRadius = maxRadius;
        const fullTipX = centerX + fullRadius * Math.cos(angle);
        const fullTipY = centerY + fullRadius * Math.sin(angle);

        // Colored fill size (based on data)
        const fillRadius = (value / 100) * maxRadius;
        const fillTipX = centerX + fillRadius * Math.cos(angle);
        const fillTipY = centerY + fillRadius * Math.sin(angle);

        // Calculate label position (outside the petal)
        const labelRadius = maxRadius + 40;
        const labelX = centerX + labelRadius * Math.cos(angle);
        const labelY = centerY + labelRadius * Math.sin(angle);

        // Calculate control points for smooth petal shape (wider petals)
        const petalWidth = 0.5; // Width of petal in radians (increased for thicker petals)
        const leftAngle = angle - petalWidth;
        const rightAngle = angle + petalWidth;

        // Full petal control points (wider base)
        const fullLeftX = centerX + (fullRadius * 0.4) * Math.cos(leftAngle);
        const fullLeftY = centerY + (fullRadius * 0.4) * Math.sin(leftAngle);
        const fullRightX = centerX + (fullRadius * 0.4) * Math.cos(rightAngle);
        const fullRightY = centerY + (fullRadius * 0.4) * Math.sin(rightAngle);

        // Fill control points (wider base)
        const fillLeftX = centerX + (fillRadius * 0.4) * Math.cos(leftAngle);
        const fillLeftY = centerY + (fillRadius * 0.4) * Math.sin(leftAngle);
        const fillRightX = centerX + (fillRadius * 0.4) * Math.cos(rightAngle);
        const fillRightY = centerY + (fillRadius * 0.4) * Math.sin(rightAngle);

        return {
            ...emotion,
            value,
            fullTipX,
            fullTipY,
            fullLeftX,
            fullLeftY,
            fullRightX,
            fullRightY,
            fillTipX,
            fillTipY,
            fillLeftX,
            fillLeftY,
            fillRightX,
            fillRightY,
            labelX,
            labelY,
            angle
        };
    });

    return (
        <div className="relative w-full">
            <svg
                viewBox="0 0 400 400"
                className="w-full h-auto"
                style={{ maxHeight: '400px' }}
            >
                {/* Background circles for reference */}
                {[25, 50, 75, 100].map((level) => {
                    const r = (level / 100) * maxRadius;
                    return (
                        <circle
                            key={level}
                            cx={centerX}
                            cy={centerY}
                            r={r}
                            fill="none"
                            stroke="#f0f0f0"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                        />
                    );
                })}

                {/* Draw petals */}
                {petals.map((petal, index) => {
                    // Full petal background (light gray)
                    const fullPath = `
                        M ${centerX} ${centerY}
                        Q ${petal.fullLeftX} ${petal.fullLeftY}, ${petal.fullTipX} ${petal.fullTipY}
                        Q ${petal.fullRightX} ${petal.fullRightY}, ${centerX} ${centerY}
                        Z
                    `;

                    // Colored fill (based on data)
                    const fillPath = `
                        M ${centerX} ${centerY}
                        Q ${petal.fillLeftX} ${petal.fillLeftY}, ${petal.fillTipX} ${petal.fillTipY}
                        Q ${petal.fillRightX} ${petal.fillRightY}, ${centerX} ${centerY}
                        Z
                    `;

                    return (
                        <g key={petal.name}>
                            {/* Full petal background (light gray with light border) */}
                            <path
                                d={fullPath}
                                fill="#f3f4f6"
                                stroke="#d1d5db"
                                strokeWidth="1.5"
                                className="transition-all duration-300"
                            />

                            {/* Colored fill (only if value > 0) */}
                            {petal.value > 0 && (
                                <path
                                    d={fillPath}
                                    fill={petal.color}
                                    fillOpacity="0.8"
                                    stroke="none"
                                    className="transition-all duration-300"
                                />
                            )}

                            {/* Petal tip dot (only if value > 0) */}
                            {petal.value > 0 && (
                                <circle
                                    cx={petal.fillTipX}
                                    cy={petal.fillTipY}
                                    r="4"
                                    fill={petal.color}
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            )}
                        </g>
                    );
                })}

                {/* Center circle - simple and clean */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r="25"
                    fill="white"
                    stroke="#d1d5db"
                    strokeWidth="2"
                />

                {/* Labels with emoji and percentage */}
                {petals.map((petal) => {
                    let textAnchor = 'middle';
                    if (petal.labelX < centerX - 10) textAnchor = 'end';
                    if (petal.labelX > centerX + 10) textAnchor = 'start';

                    return (
                        <g key={`label-${petal.name}`}>
                            {/* Emotion name */}
                            <text
                                x={petal.labelX}
                                y={petal.labelY - 8}
                                textAnchor={textAnchor}
                                className="text-xs font-semibold"
                                fill="#374151"
                                fontSize="11"
                            >
                                {petal.emoji} {petal.name}
                            </text>
                            {/* Percentage */}
                            <text
                                x={petal.labelX}
                                y={petal.labelY + 6}
                                textAnchor={textAnchor}
                                className="text-xs"
                                fill="#6b7280"
                                fontSize="10"
                            >
                                {petal.value}%
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="mt-4 text-center text-xs text-gray-500">
                Analyzed from your journal entries and mood check-ins
            </div>
        </div>
    );
}
