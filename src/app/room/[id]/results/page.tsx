'use client';

import { useEffect, useState } from 'react';
import { getMatches } from '@/actions/game';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { Heart, Home } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ResultsPage() {
    const { id } = useParams();
    const [matches, setMatches] = useState<{ image_url: string, description: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            const { matches } = await getMatches(id as string);
            setMatches(matches || []);
            setLoading(false);

            if (matches && matches.length > 0) {
                const duration = 3000;
                const end = Date.now() + duration;

                (function frame() {
                    confetti({
                        particleCount: 3,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#D4AF37', '#ffffff'] // Gold and White
                    });
                    confetti({
                        particleCount: 3,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#D4AF37', '#ffffff']
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }
        };

        fetchMatches();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
            <header className="py-8 text-center bg-gold/10">
                <h1 className="text-4xl font-serif text-gold font-bold mb-2">It's a Match!</h1>
                <p className="text-gray-600 dark:text-gray-300">
                    You found {matches.length} matches together.
                </p>
            </header>

            <main className="container mx-auto px-4 py-8">
                {matches.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-500">No matches found this time.</h3>
                        <p className="text-gray-400">Maybe try another category?</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {matches.map((match, idx) => (
                            <div key={idx} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg animate-in slide-in-from-bottom-5 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                                <Image
                                    src={match.image_url}
                                    alt={match.description || 'Match'}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <p className="text-white font-medium capitalize truncate w-full">
                                        {match.description || 'Lovely Choice'}
                                    </p>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 p-2 rounded-full shadow-sm">
                                    <Heart className="w-5 h-5 text-gold" fill="currentColor" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-16 flex justify-center pb-8">
                    <Link href="/dashboard" className="flex items-center gap-2 px-8 py-4 bg-gold hover:bg-[#C5A028] text-white rounded-full font-bold shadow-lg transition-transform hover:-translate-y-1">
                        <Home size={20} />
                        Back to Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
}
