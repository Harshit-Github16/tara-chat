"use client";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

const ADMIN_EMAILS = [
    "harshit0150@gmail.com",
    "hello.tara4u@gmail.com",
    "ruchika.dave91@gmail.com"
];

export default function AdminCheckPage() {
    const { user, loading } = useAuth();
    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        if (user && !loading) {
            const info = {
                userEmail: user.email,
                userEmailType: typeof user.email,
                userEmailLength: user.email?.length,
                adminEmails: ADMIN_EMAILS,
                isMatch: ADMIN_EMAILS.includes(user.email),
                exactMatches: ADMIN_EMAILS.map(adminEmail => ({
                    adminEmail,
                    matches: adminEmail === user.email,
                    adminLength: adminEmail.length,
                    comparison: `"${adminEmail}" === "${user.email}"`
                })),
                fullUser: user
            };
            setDebugInfo(info);
        }
    }, [user, loading]);

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    if (!user) {
        return <div className="p-8">Not logged in</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Admin Access Debug</h1>

            {debugInfo && (
                <div className="space-y-4">
                    <div className="bg-white rounded-lg border p-4">
                        <h2 className="font-bold mb-2">User Email</h2>
                        <p className="font-mono text-sm">"{debugInfo.userEmail}"</p>
                        <p className="text-xs text-gray-500">Type: {debugInfo.userEmailType}</p>
                        <p className="text-xs text-gray-500">Length: {debugInfo.userEmailLength}</p>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <h2 className="font-bold mb-2">Is Admin?</h2>
                        <p className={`text-lg font-bold ${debugInfo.isMatch ? 'text-green-600' : 'text-red-600'}`}>
                            {debugInfo.isMatch ? 'YES ✓' : 'NO ✗'}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <h2 className="font-bold mb-2">Email Comparisons</h2>
                        <div className="space-y-2">
                            {debugInfo.exactMatches.map((match, idx) => (
                                <div key={idx} className="text-sm">
                                    <p className="font-mono">{match.comparison}</p>
                                    <p className={match.matches ? 'text-green-600' : 'text-red-600'}>
                                        {match.matches ? '✓ Match' : '✗ No match'}
                                    </p>
                                    <p className="text-xs text-gray-500">Admin email length: {match.adminLength}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <h2 className="font-bold mb-2">Full User Object</h2>
                        <pre className="text-xs overflow-auto bg-gray-50 p-2 rounded">
                            {JSON.stringify(debugInfo.fullUser, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
