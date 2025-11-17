"use client";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faTimes, faSave, faBrain } from "@fortawesome/free-solid-svg-icons";

// Circular Emotional Wheel Chart Component
function EmotionalWheelChart({ intensityData, lifeAreas }) {
    // Soft, light colors for each life area matching the theme
    const baseColors = [
        '#fb7185',  // rose-400
        '#fb923c',  // orange-400
        '#fbbf24',  // amber-400
        '#34d399',  // emerald-400
        '#22d3ee',  // cyan-400
        '#60a5fa',  // blue-400
        '#a78bfa',  // purple-400
        '#f472b6'   // pink-400
    ];

    const centerX = 200;
    const centerY = 200;
    const maxRadius = 150;
    const minRadius = 30;
    const maxLevels = 5; // Maximum intensity levels

    // Helper function to create petal path
    const createPetalPath = (cx, cy, innerR, outerR, startA, endA, midA, angleStep) => {
        const startX1 = cx + innerR * Math.cos(startA);
        const startY1 = cy + innerR * Math.sin(startA);
        const endX1 = cx + innerR * Math.cos(endA);
        const endY1 = cy + innerR * Math.sin(endA);

        const peakX = cx + outerR * Math.cos(midA);
        const peakY = cy + outerR * Math.sin(midA);

        const controlRadius = (innerR + outerR) / 2;
        const control1X = cx + controlRadius * Math.cos(startA + angleStep * 0.25);
        const control1Y = cy + controlRadius * Math.sin(startA + angleStep * 0.25);
        const control2X = cx + controlRadius * Math.cos(endA - angleStep * 0.25);
        const control2Y = cy + controlRadius * Math.sin(endA - angleStep * 0.25);

        return `
            M ${startX1} ${startY1}
            Q ${control1X} ${control1Y}, ${peakX} ${peakY}
            Q ${control2X} ${control2Y}, ${endX1} ${endY1}
            A ${innerR} ${innerR} 0 0 0 ${startX1} ${startY1}
        `;
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Center circle */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={minRadius}
                    fill="#fff"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                />

                {/* Life area petals - single smooth petal with partial fill */}
                {lifeAreas.map((area, index) => {
                    const intensity = intensityData[area] || 0;
                    const angleStep = (2 * Math.PI) / lifeAreas.length;
                    const startAngle = index * angleStep - Math.PI / 2;
                    const endAngle = startAngle + angleStep;
                    const midAngle = (startAngle + endAngle) / 2;

                    const baseColor = baseColors[index % baseColors.length];

                    // Calculate colored portion radius (based on intensity)
                    const coloredRadius = minRadius + ((intensity / maxLevels) * (maxRadius - minRadius));

                    // Full petal path (gray background)
                    const fullPetalPath = createPetalPath(
                        centerX, centerY, minRadius, maxRadius,
                        startAngle, endAngle, midAngle, angleStep
                    );

                    // Colored portion path (based on intensity)
                    const coloredPetalPath = intensity > 0 ? createPetalPath(
                        centerX, centerY, minRadius, coloredRadius,
                        startAngle, endAngle, midAngle, angleStep
                    ) : null;

                    return (
                        <g key={area}>
                            {/* Full petal - gray background */}
                            <path
                                d={fullPetalPath}
                                fill="#e5e7eb"
                                stroke="#d1d5db"
                                strokeWidth="1.5"
                                opacity="0.5"
                            />

                            {/* Colored portion - overlays on gray */}
                            {coloredPetalPath && (
                                <path
                                    d={coloredPetalPath}
                                    fill={baseColor}
                                    stroke={baseColor}
                                    strokeWidth="1.5"
                                    opacity="0.9"
                                />
                            )}

                            {/* Label */}
                            <text
                                x={centerX + (maxRadius + 30) * Math.cos(midAngle)}
                                y={centerY + (maxRadius + 30) * Math.sin(midAngle)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xs font-semibold fill-gray-700"
                                style={{ fontSize: '12px' }}
                            >
                                {area.length > 12 ? area.substring(0, 10) + '...' : area}
                            </text>

                            {/* Intensity number */}
                            {intensity > 0 && (
                                <text
                                    x={centerX + (coloredRadius * 0.75) * Math.cos(midAngle)}
                                    y={centerY + (coloredRadius * 0.75) * Math.sin(midAngle)}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-sm font-bold fill-white"
                                    style={{ fontSize: '16px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                                >
                                    {intensity}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Center brain icon */}
                <foreignObject
                    x={centerX - 15}
                    y={centerY - 15}
                    width="30"
                    height="30"
                >
                    <div className="flex items-center justify-center w-full h-full">
                        <FontAwesomeIcon icon={faBrain} className="text-rose-500 text-2xl" />
                    </div>
                </foreignObject>
            </svg>

            {/* Legend */}
            {/* <div className="mt-4 flex justify-center gap-3 flex-wrap text-xs text-gray-600">
                <span>Intensity Scale:</span>
                <span className="font-semibold">0 (Low)</span>
                <span>→</span>
                <span className="font-semibold">5 (High)</span>
            </div> */}
        </div>
    );
}

// Add custom styles for slider
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        .slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            border: 3px solid currentColor;
        }
        .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            border: 3px solid currentColor;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
            animation: slideUp 0.3s ease-out;
        }
    `;
    if (!document.querySelector('#emotional-wheel-styles')) {
        style.id = 'emotional-wheel-styles';
        document.head.appendChild(style);
    }
}

export default function EmotionalWheel() {
    const [showModal, setShowModal] = useState(false);
    const [lifeAreas, setLifeAreas] = useState([]);
    const [intensityData, setIntensityData] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Refresh data when modal opens
    useEffect(() => {
        if (showModal) {
            fetchData();
        }
    }, [showModal]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/emotional-wheel');
            if (response.ok) {
                const data = await response.json();
                setLifeAreas(data.lifeAreas || []);

                // Initialize intensity data
                const savedData = data.emotionalWheelData || {};
                const initialData = {};
                (data.lifeAreas || []).forEach(area => {
                    initialData[area] = savedData[area] || 0;
                });
                setIntensityData(initialData);
            }
        } catch (error) {
            console.error('Error fetching emotional wheel data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIntensityChange = (area, value) => {
        setIntensityData(prev => ({
            ...prev,
            [area]: parseInt(value)
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.post('/api/emotional-wheel', {
                emotionalWheelData: intensityData
            });

            if (response.ok) {
                alert('Emotional wheel data saved successfully!');
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error saving emotional wheel data:', error);
            alert('Failed to save data');
        } finally {
            setSaving(false);
        }
    };

    const getColorForIntensity = (intensity) => {
        const colors = [
            '#f3f4f6', // 0 - gray-100
            '#fef3c7', // 1 - amber-100
            '#fed7aa', // 2 - orange-200
            '#fdba74', // 3 - orange-300
            '#fb923c', // 4 - orange-400
            '#f97316'  // 5 - orange-500
        ];
        return colors[intensity] || colors[0];
    };

    // Show chart if user has selected life areas (even with 0 intensity)
    const hasLifeAreas = lifeAreas.length > 0;

    return (
        <>
            {/* Emotional Wheel Visualization */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            ) : hasLifeAreas ? (
                <EmotionalWheelChart intensityData={intensityData} lifeAreas={lifeAreas} />
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">Please complete onboarding to select your life areas</p>
                </div>
            )}

            {/* Update Button */}
            {hasLifeAreas && (
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                    <FontAwesomeIcon icon={faChartPie} className="h-5 w-5" />
                    Check Now
                </button>
            )}

            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-lg border border-rose-100">
                        {/* Simple Header */}
                        <div className="bg-white border-b border-rose-100 px-5 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Rate Your Life Areas</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-rose-500 transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 overflow-y-auto max-h-[calc(85vh-140px)]">
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="w-8 h-8 border-3 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-gray-600 text-sm">Loading...</p>
                                </div>
                            ) : lifeAreas.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 text-sm">No life areas selected</p>
                                </div>
                            ) : (
                                <>
                                    {/* Simple Life Areas with Sliders */}
                                    <div className="space-y-4">
                                        {lifeAreas.map((area) => {
                                            const intensity = intensityData[area] || 0;

                                            return (
                                                <div key={area} className="bg-white rounded-xl p-4 border border-rose-100">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <label className="text-sm font-semibold text-gray-700">
                                                            {area}
                                                        </label>
                                                        <span className="text-xl font-bold text-rose-500">
                                                            {intensity}
                                                        </span>
                                                    </div>

                                                    {/* Simple slider */}
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="5"
                                                        value={intensity}
                                                        onChange={(e) => handleIntensityChange(area, e.target.value)}
                                                        className="w-full h-2 rounded-full appearance-none cursor-pointer slider"
                                                        style={{
                                                            background: `linear-gradient(to right, #fb7185 0%, #fb7185 ${(intensity / 5) * 100}%, #fecdd3 ${(intensity / 5) * 100}%, #fecdd3 100%)`
                                                        }}
                                                    />

                                                    {/* Simple markers */}
                                                    <div className="flex justify-between mt-2">
                                                        {[0, 1, 2, 3, 4, 5].map((mark) => (
                                                            <span
                                                                key={mark}
                                                                className={`text-xs ${mark <= intensity
                                                                    ? 'text-rose-500 font-medium'
                                                                    : 'text-gray-400'
                                                                    }`}
                                                            >
                                                                {mark}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Save Button */}
                                    <div className="mt-5 flex gap-2">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-4 py-2.5 border border-rose-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-rose-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-lg text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faSave} className="h-5 w-5" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
