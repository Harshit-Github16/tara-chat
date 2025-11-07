'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function TaraChat({ userId, onMessagesUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load chat history when component mounts
    useEffect(() => {
        if (userId) {
            loadChatHistory();
        }
    }, [userId]);

    const loadChatHistory = async () => {
        try {
            // Load from unified users API
            const response = await api.get(`/api/users/conversations?userId=${userId}&chatUserId=tara-ai`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.conversations) {
                    onMessagesUpdate(data.conversations);
                }
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };

    const sendMessage = async (message, userDetails = {}) => {
        if (!message.trim() || !userId) {
            console.error('TaraChat: Missing message or userId', { message, userId });
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('TaraChat: Sending message to /api/chat', {
                userId,
                chatUserId: 'tara-ai',
                message: message.trim(),
                userDetails
            });

            // Use unified chat API
            const response = await api.post('/api/chat', {
                userId: userId,
                chatUserId: 'tara-ai',
                message: message.trim(),
                userDetails: userDetails
            });

            console.log('TaraChat: Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('TaraChat: Response data:', data);

                if (data.success) {
                    // Update messages in parent component
                    onMessagesUpdate(data.chatHistory);
                    return {
                        userMessage: data.userMessage,
                        aiMessage: data.aiMessage
                    };
                } else {
                    console.error('TaraChat: API returned success=false', data);
                    throw new Error(data.error || 'Failed to send message');
                }
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('TaraChat: API request failed', { status: response.status, errorData });
                throw new Error(errorData.error || `Failed to send message (${response.status})`);
            }
        } catch (error) {
            console.error('Send message error:', error);
            setError(error.message);
            throw error; // Re-throw to handle in parent
        } finally {
            setIsLoading(false);
        }
    };

    return {
        sendMessage,
        isLoading,
        error,
        loadChatHistory
    };
}