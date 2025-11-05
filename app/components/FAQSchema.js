export default function FAQSchema({ faqs }) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(faqSchema)
            }}
        />
    );
}

// Common FAQs for Tara
export const COMMON_FAQS = [
    {
        question: "What is Tara and how does it help with mental health?",
        answer: "Tara is an AI-powered mental health and wellness companion that provides emotional support, mindfulness guidance, and personal growth tools. It helps users track their mood, practice meditation, journal their thoughts, and chat with AI personalities for support and motivation."
    },
    {
        question: "Is Tara free to use?",
        answer: "Yes, Tara offers a free tier with basic features including mood tracking, journaling, and limited AI chat sessions. Premium features are available with advanced insights and unlimited conversations."
    },
    {
        question: "How does the celebrity chat feature work?",
        answer: "Tara's celebrity chat feature allows you to have conversations with AI versions of famous personalities. These AI models are trained to respond in the style and personality of celebrities, providing motivation, advice, and entertainment while maintaining appropriate boundaries."
    },
    {
        question: "Is my data safe and private with Tara?",
        answer: "Yes, we take privacy seriously. All conversations and personal data are encrypted and stored securely. We never share your personal information with third parties, and you have full control over your data."
    },
    {
        question: "Can Tara replace professional therapy?",
        answer: "No, Tara is designed to complement, not replace, professional mental health care. While it provides valuable support and tools for daily wellness, we always recommend consulting with licensed mental health professionals for serious concerns."
    },
    {
        question: "How accurate are the mood insights and analytics?",
        answer: "Tara's insights are based on your input patterns, mood tracking, and journal entries. While they provide valuable trends and patterns, they should be used as general guidance alongside professional assessment when needed."
    },
    {
        question: "What devices can I use Tara on?",
        answer: "Tara is a web-based application that works on any device with a modern web browser, including smartphones, tablets, laptops, and desktop computers. No app download is required."
    },

];