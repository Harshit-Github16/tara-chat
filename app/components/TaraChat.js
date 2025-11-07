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
            const response = await api.get(`/api/tara-chat?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.messages) {
                    onMessagesUpdate(data.messages);
                }
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };

    const sendMessage = async (message) => {
        if (!message.trim() || !userId) return null;

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/tara-chat', {
                userId: userId,
                message: message.trim()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Update messages in parent component
                    onMessagesUpdate(data.chatHistory);
                    return {
                        userMessage: data.userMessage,
                        taraMessage: data.taraMessage
                    };
                } else {
                    throw new Error(data.error || 'Failed to send message');
                }
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Send message error:', error);
            setError(error.message);
            return null;
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