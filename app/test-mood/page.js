'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export default function TestMoodPage() {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testMoodAPI = async () => {
        setLoading(true);
        setResult('Testing...');

        try {
            // Check if token exists
            const token = localStorage.getItem('authToken');
            setResult(prev => prev + `\nToken exists: ${token ? 'Yes' : 'No'}`);

            if (token) {
                setResult(prev => prev + `\nToken length: ${token.length}`);
                setResult(prev => prev + `\nToken preview: ${token.substring(0, 20)}...`);
            }

            // Test the mood API
            const response = await api.post('/api/mood', {
                mood: 'happy',
                intensity: 7,
                note: 'Test mood entry'
            });

            setResult(prev => prev + `\nResponse status: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                setResult(prev => prev + `\nSuccess: ${JSON.stringify(data, null, 2)}`);
            } else {
                const error = await response.json();
                setResult(prev => prev + `\nError: ${JSON.stringify(error, null, 2)}`);
            }
        } catch (error) {
            setResult(prev => prev + `\nException: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Test Mood API</h1>

                <button
                    onClick={testMoodAPI}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Test Mood API'}
                </button>

                {result && (
                    <div className="mt-4 p-4 bg-white rounded border">
                        <h3 className="font-semibold mb-2">Result:</h3>
                        <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}