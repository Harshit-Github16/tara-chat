// Quiz data for all 8 default life areas
export const LIFE_AREA_QUIZZES = {
    "Financial Growth": [
        {
            question: "How satisfied are you with your current financial situation?",
            options: [
                { text: "Very satisfied", score: 5 },
                { text: "Satisfied", score: 4 },
                { text: "Neutral", score: 3 },
                { text: "Dissatisfied", score: 2 },
                { text: "Very dissatisfied", score: 1 }
            ]
        },
        {
            question: "Do you have a clear financial plan for the next 5 years?",
            options: [
                { text: "Yes, very clear", score: 5 },
                { text: "Somewhat clear", score: 4 },
                { text: "Not sure", score: 3 },
                { text: "No plan yet", score: 2 },
                { text: "No plan at all", score: 1 }
            ]
        },
        {
            question: "How often do you save money regularly?",
            options: [
                { text: "Every month", score: 5 },
                { text: "Most months", score: 4 },
                { text: "Sometimes", score: 3 },
                { text: "Rarely", score: 2 },
                { text: "Never", score: 1 }
            ]
        },
        {
            question: "How confident are you about your financial future?",
            options: [
                { text: "Very confident", score: 5 },
                { text: "Confident", score: 4 },
                { text: "Neutral", score: 3 },
                { text: "Not confident", score: 2 },
                { text: "Very worried", score: 1 }
            ]
        },
        {
            question: "Do you have an emergency fund?",
            options: [
                { text: "Yes, 6+ months expenses", score: 5 },
                { text: "Yes, 3-6 months", score: 4 },
                { text: "Yes, 1-3 months", score: 3 },
                { text: "Very little", score: 2 },
                { text: "No emergency fund", score: 1 }
            ]
        }
    ],
    "Family": [
        {
            question: "How would you rate your relationship with your family?",
            options: [
                { text: "Excellent", score: 5 },
                { text: "Good", score: 4 },
                { text: "Okay", score: 3 },
                { text: "Strained", score: 2 },
                { text: "Very difficult", score: 1 }
            ]
        },
        {
            question: "How often do you communicate with your family?",
            options: [
                { text: "Daily", score: 5 },
                { text: "Several times a week", score: 4 },
                { text: "Weekly", score: 3 },
                { text: "Monthly", score: 2 },
                { text: "Rarely", score: 1 }
            ]
        },
        {
            question: "Do you feel supported by your family?",
            options: [
                { text: "Always", score: 5 },
                { text: "Most of the time", score: 4 },
                { text: "Sometimes", score: 3 },
                { text: "Rarely", score: 2 },
                { text: "Never", score: 1 }
            ]
        },
        {
            question: "How comfortable are you sharing your feelings with family?",
            options: [
                { text: "Very comfortable", score: 5 },
                { text: "Comfortable", score: 4 },
                { text: "Neutral", score: 3 },
                { text: "Uncomfortable", score: 2 },
                { text: "Very uncomfortable", score: 1 }
            ]
        },
        {
            question: "Do you spend quality time with your family?",
            options: [
                { text: "Regularly", score: 5 },
                { text: "Often", score: 4 },
                { text: "Sometimes", score: 3 },
                { text: "Rarely", score: 2 },
                { text: "Never", score: 1 }
            ]
        }
    ],
    "Health": [
        {
            question: "How would you rate your overall physical health?",
            options: [
                { text: "Excellent", score: 5 },
                { text: "Good", score: 4 },
                { text: "Fair", score: 3 },
                { text: "Poor", score: 2 },
                { text: "Very poor", score: 1 }
            ]
        },
        {
            question: "How often do you exercise or engage in physical activity?",
            options: [
                { text: "Daily", score: 5 },
                { text: "4-5 times a week", score: 4 },
                { text: "2-3 times a week", score: 3 },
                { text: "Once a week", score: 2 },
                { text: "Rarely or never", score: 1 }
            ]
        },
        {
            question: "How well do you sleep at night?",
            options: [
                { text: "Very well, 7-8 hours", score: 5 },
                { text: "Well, 6-7 hours", score: 4 },
                { text: "Okay, 5-6 hours", score: 3 },
                { text: "Poorly, less than 5 hours", score: 2 },
                { text: "Very poorly, insomnia", score: 1 }
            ]
        },
        {
            question: "How balanced is your diet?",
            options: [
                { text: "Very balanced", score: 5 },
                { text: "Mostly balanced", score: 4 },
                { text: "Somewhat balanced", score: 3 },
                { text: "Not very balanced", score: 2 },
                { text: "Very unbalanced", score: 1 }
            ]
        },
        {
            question: "How often do you feel energetic throughout the day?",
            options: [
                { text: "Always", score: 5 },
                { text: "Most of the time", score: 4 },
                { text: "Sometimes", score: 3 },
                { text: "Rarely", score: 2 },
                { text: "Never", score: 1 }
            ]
        }
    ],
    "Personal Growth": [
        {
            question: "How committed are you to learning new things?",
            options: [
                { text: "Very committed", score: 5 },
                { text: "Committed", score: 4 },
                { text: "Somewhat committed", score: 3 },
                { text: "Not very committed", score: 2 },
                { text: "Not committed at all", score: 1 }
            ]
        },
        {
            question: "Do you set personal development goals?",
            options: [
                { text: "Yes, regularly", score: 5 },
                { text: "Yes, sometimes", score: 4 },
                { text: "Occasionally", score: 3 },
                { text: "Rarely", score: 2 },
                { text: "Never", score: 1 }
            ]
        },
        {
            question: "How often do you step out of your comfort zone?",
            options: [
                { text: "Very often", score: 5 },
                { text: "Often", score: 4 },
                { text: "Sometimes", score: 3 },
                { text: "Rarely", score: 2 },
                { text: "Never", score: 1 }
            ]
        },
        {
            question: "Do you reflect on your personal growth regularly?",
            options: [
                { text: "Yes, daily", score: 5 },
                { text: "Yes, weekly", score: 4 },
                { text: "Yes, monthly", score: 3 },
                { text: "Rarely", score: 2 },
                { text: "Never", score: 1 }
            ]
        },
        {
            question: "How satisfied are you with your personal development?",
            options: [
                { text: "Very satisfied", score: 5 },
                { text: "Satisfied", score: 4 },
                { text: "Neutral", score: 3 },
                { text: "Dissatisfied", score: 2 },
                { text: "Very dissatisfied", score: 1 }
            ]
        }
    ],
    "Love & Relationships": [
        {
            question: "How satisfied are you with your romantic relationship?",
            options: [
                { text: "Very satisfied", score: 5 },
                { text: "Satisfied", score: 4 },
                { text: "Neutral", score: 3 },
                { text: "Dissatisfied", score: 2 },
                { text: "Very dissatisfied / Single", score: 1 }
            ]
        },
        {
            question: "How well do you communicate with your partner?",
            options: [
                { text: "Excellent communication", score: 5 },
                { text: "Good communication", score: 4 },
                { text: "Okay communication", score: 3 },
                { text: "Poor communication", score: 2 },
                { text: "Very poor / Not applicable", score: 1 }
            ]
        },
        {
            question: "Do you feel emotionally connected in your relationships?",
            options: [
                { text: "Very connected", score: 5 },
                { text: "Connected", score: 4 },
                { text: "Somewhat connected", score: 3 },
                { text: "Disconnected", score: 2 },
                { text: "Very disconnected", score: 1 }
            ]
        },
        {
            question: "How much quality time do you spend with your partner?",
            options: [
                { text: "Plenty of quality time", score: 5 },
                { text: "Good amount", score: 4 },
                { text: "Some quality time", score: 3 },
                { text: "Very little", score: 2 },
                { text: "Almost none", score: 1 }
            ]
        },
        {
            question: "How supported do you feel in your relationship?",
            options: [
                { text: "Very supported", score: 5 },
                { text: "Supported", score: 4 },
                { text: "Somewhat supported", score: 3 },
                { text: "Not very supported", score: 2 },
                { text: "Not supported at all", score: 1 }
            ]
        }
    ],
    "Career": [
        {
            question: "How satisfied are you with your current career?",
            options: [
                { text: "Very satisfied", score: 5 },
                { text: "Satisfied", score: 4 },
                { text: "Neutral", score: 3 },
                { text: "Dissatisfied", score: 2 },
                { text: "Very dissatisfied", score: 1 }
            ]
        },
        {
            question: "Do you feel your work is meaningful?",
            options: [
                { text: "Very meaningful", score: 5 },
                { text: "Meaningful", score: 4 },
                { text: "Somewhat meaningful", score: 3 },
                { text: "Not very meaningful", score: 2 },
                { text: "Not meaningful at all", score: 1 }
            ]
        },
        {
            question: "How is your work-life balance?",
            options: [
                { text: "Excellent balance", score: 5 },
                { text: "Good balance", score: 4 },
                { text: "Okay balance", score: 3 },
                { text: "Poor balance", score: 2 },
                { text: "Very poor balance", score: 1 }
            ]
        },
        {
            question: "Do you see growth opportunities in your career?",
            options: [
                { text: "Many opportunities", score: 5 },
                { text: "Some opportunities", score: 4 },
                { text: "Few opportunities", score: 3 },
                { text: "Very few", score: 2 },
                { text: "No opportunities", score: 1 }
            ]
        },
        {
            question: "How stressed do you feel at work?",
            options: [
                { text: "Not stressed at all", score: 5 },
                { text: "Slightly stressed", score: 4 },
                { text: "Moderately stressed", score: 3 },
                { text: "Very stressed", score: 2 },
                { text: "Extremely stressed", score: 1 }
            ]
        }
    ],
    "Social Life": [
        {
            question: "How satisfied are you with your social life?",
            options: [
                { text: "Very satisfied", score: 5 },
                { text: "Satisfied", score: 4 },
                { text: "Neutral", score: 3 },
                { text: "Dissatisfied", score: 2 },
                { text: "Very dissatisfied", score: 1 }
            ]
        },
        {
            question: "How often do you spend time with friends?",
            options: [
                { text: "Very often", score: 5 },
                { text: "Often", score: 4 },
                { text: "Sometimes", score: 3 },
                { text: "Rarely", score: 2 },
                { text: "Never", score: 1 }
            ]
        },
        {
            question: "Do you feel you have meaningful friendships?",
            options: [
                { text: "Yes, many", score: 5 },
                { text: "Yes, a few", score: 4 },
                { text: "Some", score: 3 },
                { text: "Very few", score: 2 },
                { text: "None", score: 1 }
            ]
        },
        {
            question: "How comfortable are you in social situations?",
            options: [
                { text: "Very comfortable", score: 5 },
                { text: "Comfortable", score: 4 },
                { text: "Neutral", score: 3 },
                { text: "Uncomfortable", score: 2 },
                { text: "Very uncomfortable", score: 1 }
            ]
        },
        {
            question: "Do you feel connected to your community?",
            options: [
                { text: "Very connected", score: 5 },
                { text: "Connected", score: 4 },
                { text: "Somewhat connected", score: 3 },
                { text: "Not very connected", score: 2 },
                { text: "Not connected at all", score: 1 }
            ]
        }
    ],
    "Spirituality": [
        {
            question: "How connected do you feel to your spiritual self?",
            options: [
                { text: "Very connected", score: 5 },
                { text: "Connected", score: 4 },
                { text: "Somewhat connected", score: 3 },
                { text: "Not very connected", score: 2 },
                { text: "Not connected at all", score: 1 }
            ]
        },
        {
            question: "Do you practice meditation or mindfulness?",
            options: [
                { text: "Daily", score: 5 },
                { text: "Several times a week", score: 4 },
                { text: "Sometimes", score: 3 },
                { text: "Rarely", score: 2 },
                { text: "Never", score: 1 }
            ]
        },
        {
            question: "How often do you reflect on life's deeper meaning?",
            options: [
                { text: "Very often", score: 5 },
                { text: "Often", score: 4 },
                { text: "Sometimes", score: 3 },
                { text: "Rarely", score: 2 },
                { text: "Never", score: 1 }
            ]
        },
        {
            question: "Do you feel a sense of purpose in life?",
            options: [
                { text: "Very strong sense", score: 5 },
                { text: "Strong sense", score: 4 },
                { text: "Some sense", score: 3 },
                { text: "Weak sense", score: 2 },
                { text: "No sense of purpose", score: 1 }
            ]
        },
        {
            question: "How peaceful do you feel internally?",
            options: [
                { text: "Very peaceful", score: 5 },
                { text: "Peaceful", score: 4 },
                { text: "Somewhat peaceful", score: 3 },
                { text: "Not very peaceful", score: 2 },
                { text: "Very restless", score: 1 }
            ]
        }
    ]
};

// Function to get quiz for a life area
export function getQuizForLifeArea(lifeArea) {
    return LIFE_AREA_QUIZZES[lifeArea] || null;
}

// Function to calculate quiz score
export function calculateQuizScore(answers) {
    if (!answers || answers.length === 0) return 0;
    const total = answers.reduce((sum, score) => sum + score, 0);
    const maxScore = answers.length * 5;
    return Math.round((total / maxScore) * 100);
}
