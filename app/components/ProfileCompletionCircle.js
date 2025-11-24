"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";
import { useMemo } from "react";

export default function ProfileCompletionCircle({ size = "md", showPercentage = false }) {
    const { user } = useAuth();

    // Calculate profile completion percentage
    const completionData = useMemo(() => {
        if (!user) return { percentage: 0, completedFields: 0, totalFields: 0 };

        const fields = [
            { key: 'name', value: user.name },
            { key: 'nickname', value: user.nickname },
            { key: 'email', value: user.email },
            { key: 'phone', value: user.phone },
            { key: 'location', value: user.location },
            { key: 'profession', value: user.profession },
            { key: 'bio', value: user.bio },
            { key: 'interests', value: user.interests, isArray: true },
            { key: 'personalityTraits', value: user.personalityTraits, isArray: true },
            { key: 'gender', value: user.gender },
            { key: 'ageRange', value: user.ageRange },
        ];

        const completedFields = fields.filter(field => {
            if (field.isArray) {
                return field.value && Array.isArray(field.value) && field.value.length > 0;
            }
            return field.value && field.value.trim() !== '';
        }).length;

        const totalFields = fields.length;
        const percentage = Math.round((completedFields / totalFields) * 100);

        return { percentage, completedFields, totalFields };
    }, [user]);

    // Size configurations
    const sizeConfig = {
        sm: {
            container: "w-6 h-6",
            icon: "h-3 w-3",
            stroke: 2,
            radius: 14,
            text: "text-[8px]"
        },
        md: {
            container: "w-9 h-9",
            icon: "h-4 w-4",
            stroke: 2.5,
            radius: 18,
            text: "text-[9px]"
        },
        lg: {
            container: "w-10 h-10",
            icon: "h-6 w-6",
            stroke: 3,
            radius: 28,
            text: "text-[8px]"
        }
    };

    const config = sizeConfig[size];
    const circumference = 2 * Math.PI * config.radius;
    const strokeDashoffset = circumference - (completionData.percentage / 100) * circumference;

    // Color based on completion percentage
    const getColor = () => {
        if (completionData.percentage >= 80) return "#10b981"; // green
        if (completionData.percentage >= 50) return "#f59e0b"; // orange
        return "#f43f5e"; // rose
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            {/* SVG Circle Progress */}
            <svg
                className={`${config.container} transform -rotate-90`}
                viewBox="0 0 40 40"
            >
                {/* Background circle */}
                <circle
                    cx="20"
                    cy="20"
                    r={config.radius}
                    fill="none"
                    stroke="#fee2e2"
                    strokeWidth={config.stroke}
                />
                {/* Progress circle */}
                <circle
                    cx="20"
                    cy="20"
                    r={config.radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={config.stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dashoffset 0.5s ease-in-out'
                    }}
                />
            </svg>

            {/* Icon in center */}
            <div className="absolute inset-0 flex items-center justify-center">
                <FontAwesomeIcon
                    icon={faUser}
                    className={`${config.icon} text-rose-600`}
                />
            </div>

            {/* Optional percentage badge */}
            {showPercentage && (
                <div
                    className={`absolute -bottom-1 -right-1 ${config.text} font-bold text-white rounded-full px-1.5 py-0.5 shadow-sm`}
                    style={{ backgroundColor: getColor() }}
                >
                    {completionData.percentage}%
                </div>
            )}
        </div>
    );
}
