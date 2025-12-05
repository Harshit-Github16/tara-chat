'use client';

// Helper function to calculate average mood score
export function calculateAverageMoodScore(moodData) {
    if (!moodData || moodData.length === 0) return { score: 0, emoji: '😐' };

    const moodValence = {
        'calm': +1, 'happy': +1, 'grateful': +1, 'motivated': +1,
        'healing': 0, 'lost': -1, 'lonely': -1, 'sad': -1,
        'stressed': -1, 'anxious': -1, 'overwhelmed': -1, 'angry': -1
    };

    const moodsWithData = [];
    moodData.forEach(m => {
        const valence = moodValence[m.mood] || 0;
        const weightedScore = (m.intensity || 3) * valence;
        moodsWithData.push({ weightedScore });
    });

    const avgScore = moodsWithData.length > 0
        ? (moodsWithData.reduce((sum, m) => sum + m.weightedScore, 0) / moodsWithData.length)
        : 0;

    // Get emoji based on score
    let emoji = '😐';
    if (avgScore >= 3) emoji = '😊';
    else if (avgScore >= 1.5) emoji = '🙂';
    else if (avgScore >= 0.5) emoji = '😌';
    else if (avgScore >= -0.5) emoji = '😐';
    else if (avgScore >= -1.5) emoji = '😔';
    else if (avgScore >= -3) emoji = '😢';
    else emoji = '😰';

    return { score: avgScore.toFixed(1), emoji };
}

export default function MoodMeterChart({ moodData = [], loading }) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Updated mood emoji mapping
    const moodEmojis = {
        'calm': '😌',
        'happy': '😊',
        'grateful': '🙏',
        'motivated': '💪',
        'healing': '🌱',
        'lost': '🤔',
        'lonely': '😔',
        'sad': '😢',
        'stressed': '😰',
        'anxious': '😟',
        'overwhelmed': '😵',
        'angry': '😠'
    };

    // Mood valence mapping: positive moods = +1, negative moods = -1, neutral = 0
    const moodValence = {
        'calm': +1,
        'happy': +1,
        'grateful': +1,
        'motivated': +1,
        'healing': 0,      // Growth phase - neutral to slightly positive
        'lost': -1,        // Negative
        'lonely': -1,      // Negative
        'sad': -1,         // Negative
        'stressed': -1,    // Negative
        'anxious': -1,     // Negative
        'overwhelmed': -1, // Negative
        'angry': -1        // Negative
    };

    // Create chart data for last 7 days
    const chartData = [];
    const moodsWithData = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = dayNames[date.getDay()];

        const dayMoods = moodData.filter(m => m.date === dateStr);

        let avgDayMood = 0;
        let hasData = false;
        let dominantMood = null;

        if (dayMoods.length > 0) {
            // Calculate Overall Mood Score using valence
            // Formula: Sum(Intensity × Valence) / total entries
            const weightedSum = dayMoods.reduce((sum, m) => {
                const intensity = m.intensity || 3;
                const valence = moodValence[m.mood] || 0;
                return sum + (intensity * valence);
            }, 0);

            avgDayMood = weightedSum / dayMoods.length;
            hasData = true;
            dominantMood = dayMoods[dayMoods.length - 1].mood;

            dayMoods.forEach(m => {
                const valence = moodValence[m.mood] || 0;
                const weightedScore = (m.intensity || 3) * valence;
                moodsWithData.push({
                    ...m,
                    actualIntensity: m.intensity || 3,
                    weightedScore: weightedScore
                });
            });
        }

        chartData.push({
            day: dayName,
            mood: avgDayMood,
            hasData: hasData,
            dominantMood: dominantMood
        });
    }

    // Calculate overall average weighted score
    const avgIntensity = moodsWithData.length > 0
        ? (moodsWithData.reduce((sum, m) => sum + m.weightedScore, 0) / moodsWithData.length).toFixed(1)
        : 0;

    if (loading) {
        return <div className="text-center text-gray-500 py-8">Loading...</div>;
    }

    if (moodData.length === 0) {
        return <div className="text-center text-gray-500 py-8">No mood data yet. Start checking in!</div>;
    }



    // SVG dimensions
    const width = 600;
    const height = 200;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 20;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Create points - map weighted mood score to -5 to +5 scale
    // Weighted score range: -5 (very negative) to +5 (very positive)
    const points = chartData.map((item, i) => {
        const x = paddingLeft + (i * (chartWidth / 6));
        // item.mood is already the weighted average score (-5 to +5)
        const scaledValue = item.hasData ? item.mood : 0;
        // Y coordinate: top is positive (+5), center is 0, bottom is negative (-5)
        const y = (height / 2) - (scaledValue * (chartHeight / 10));
        return { x, y, hasData: item.hasData };
    });

    // Create smooth bezier curve
    const createSmoothPath = (pts) => {
        if (pts.length === 0) return '';

        // Find first and last point with data
        let firstDataIndex = pts.findIndex(p => p.hasData);
        let lastDataIndex = -1;
        for (let i = pts.length - 1; i >= 0; i--) {
            if (pts[i].hasData) {
                lastDataIndex = i;
                break;
            }
        }

        if (firstDataIndex === -1 || lastDataIndex === -1) return '';

        // Only draw curve from first data point to last data point
        const relevantPoints = pts.slice(firstDataIndex, lastDataIndex + 1);

        let path = `M ${relevantPoints[0].x},${relevantPoints[0].y}`;

        for (let i = 0; i < relevantPoints.length - 1; i++) {
            const current = relevantPoints[i];
            const next = relevantPoints[i + 1];
            const prev = i > 0 ? relevantPoints[i - 1] : current;
            const afterNext = i < relevantPoints.length - 2 ? relevantPoints[i + 2] : next;

            const tension = 0.3;
            const cp1x = current.x + (next.x - prev.x) * tension;
            const cp1y = current.y + (next.y - prev.y) * tension;
            const cp2x = next.x - (afterNext.x - current.x) * tension;
            const cp2y = next.y - (afterNext.y - current.y) * tension;

            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
        }

        return path;
    };

    const pathD = createSmoothPath(points);

    return (
        <div className="space-y-4">
            {/* Title */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Weekly Mood</h3>
            </div>

            {/* SVG Chart */}
            <div className="relative px-2">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full"
                    style={{ height: '180px' }}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a5b4fc" />
                            <stop offset="50%" stopColor="#5eead4" />
                            <stop offset="100%" stopColor="#86efac" />
                        </linearGradient>
                    </defs>

                    {/* Center line (0 reference) */}
                    <line
                        x1={paddingLeft}
                        y1={height / 2}
                        x2={width - paddingRight}
                        y2={height / 2}
                        stroke="#e5e7eb"
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                    />

                    {/* Y-axis labels */}
                    <text x="10" y={paddingTop + 5} fontSize="13" fill="#9ca3af" fontFamily="system-ui">+5</text>
                    <text x="15" y={height / 2 + 5} fontSize="13" fill="#9ca3af" fontFamily="system-ui">0</text>
                    <text x="10" y={height - paddingBottom} fontSize="13" fill="#9ca3af" fontFamily="system-ui">−5</text>

                    {/* Smooth curve */}
                    {pathD && (
                        <path
                            d={pathD}
                            fill="none"
                            stroke="url(#moodGradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* Data points - show dots for each entry */}
                    {points.map((point, i) => (
                        point.hasData && (
                            <circle
                                key={`point-${i}`}
                                cx={point.x}
                                cy={point.y}
                                r="6"
                                fill="url(#moodGradient)"
                                stroke="white"
                                strokeWidth="2"
                            />
                        )
                    ))}
                </svg>
            </div>

            {/* Day labels with emojis */}
            <div className="flex justify-around items-center px-6 mt-4">
                {chartData.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className="text-2xl sm:text-3xl">
                            {item.hasData && item.dominantMood ? moodEmojis[item.dominantMood] || '😐' : '😐'}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 font-medium">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
