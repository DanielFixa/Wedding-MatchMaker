'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { submitVote } from '@/actions/game';
import { Heart, X, Check } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface GameInterfaceProps {
    roomId: string;
    images: any[];
    targetVotes: number;
}

export default function GameInterface({ roomId, images, targetVotes }: GameInterfaceProps) {
    const [cards, setCards] = useState(images);
    const [isFinished, setIsFinished] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const [currentVoteCount, setCurrentVoteCount] = useState(0);

    // Initial Data Fetch & Hydration
    useEffect(() => {
        setTimeout(() => setHydrated(true), 0);
        const fetchInitialState = async () => {
            const { count } = await supabase
                .from('votes')
                .select('*', { count: 'exact', head: true })
                .eq('room_id', roomId);

            if (count !== null) {
                console.log(`Game: Initial vote count: ${count}/${targetVotes}`);
                setCurrentVoteCount(count);
            }
        };
        fetchInitialState();
    }, [roomId, supabase, targetVotes]);

    // Navigation Effect
    useEffect(() => {
        if (hydrated && currentVoteCount >= targetVotes) {
            console.log('Game: TARGET REACHED! Redirecting to results...');
            router.push(`/room/${roomId}/results`);
        }
    }, [currentVoteCount, targetVotes, hydrated, roomId, router]);

    // REALTIME SUBSCRIPTION
    useEffect(() => {
        if (!hydrated) return;

        console.log(`Game: Subscribing to votes for room ${roomId}`);
        const channel = supabase
            .channel(`game_sync:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'votes',
                    filter: `room_id=eq.${roomId}`
                },
                (payload) => {
                    console.log('Game: Vote detected!', payload);
                    setCurrentVoteCount(prev => {
                        const newCount = prev + 1;
                        console.log(`Game: Count updated to ${newCount}/${targetVotes}`);
                        return newCount;
                    });
                }
            )
            .subscribe((status) => {
                console.log(`Game: Realtime status: ${status}`);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, supabase, hydrated, targetVotes]);


    // GAME LOGIC
    const activeCard = cards[cards.length - 1];
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const bgLikeOpacity = useTransform(x, [0, 150], [0, 0.5]);
    const bgNopeOpacity = useTransform(x, [-150, 0], [0.5, 0]);

    const handleDragEnd = async (event: unknown, info: PanInfo) => {
        if (info.offset.x > 100) await swipe('like');
        else if (info.offset.x < -100) await swipe('nope');
    };

    const swipe = async (direction: 'like' | 'nope') => {
        const newCards = [...cards];
        newCards.pop();
        setCards(newCards);
        x.set(0);

        // Optimistic UI update could happen here, but we rely on realtime for the counter to be safe
        // However, we MUST submit the vote
        await submitVote(roomId, activeCard.urls.regular, direction, activeCard.alt_description);

        if (newCards.length === 0) {
            setIsFinished(true);
        }
    };

    if (!hydrated) return null;

    if (cards.length === 0 || isFinished) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Heart className="w-12 h-12 text-gold" fill="currentColor" />
                </div>
                <h2 className="text-3xl font-serif text-gray-800 dark:text-gray-100 mb-2">All Done!</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Hold tight! Waiting for your partner to finish...
                </p>

                <div className="mt-8 w-full max-w-xs">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>{currentVoteCount} / {targetVotes}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gold"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((currentVoteCount / targetVotes) * 100, 100)}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <p className="mt-2 text-xs text-gray-400 animate-pulse">
                        Syncing with server...
                    </p>

                    {/* Fallback Button */}
                    <button
                        onClick={() => router.push(`/room/${roomId}/results`)}
                        className="mt-6 w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Stuck? See Results
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-sm h-[600px] flex flex-col items-center justify-center">
            {/* Background Indicators */}
            <motion.div style={{ opacity: bgLikeOpacity }} className="absolute inset-0 bg-green-500/30 rounded-3xl pointer-events-none z-0" />
            <motion.div style={{ opacity: bgNopeOpacity }} className="absolute inset-0 bg-red-500/30 rounded-3xl pointer-events-none z-0" />

            {/* CARD STACK */}
            <div className="relative w-full h-full">
                {cards.map((card, index) => {
                    const isTop = index === cards.length - 1;
                    return (
                        <motion.div
                            key={card.id}
                            style={{
                                x: isTop ? x : 0,
                                rotate: isTop ? rotate : 0,
                                zIndex: index
                            }}
                            drag={isTop ? 'x' : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={handleDragEnd}
                            className="absolute inset-0 bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
                            initial={{ scale: 0.95, y: -10 * (cards.length - index) }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative h-4/5 w-full">
                                <Image src={card.urls.regular} alt="Wedding" fill className="object-cover pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                            </div>
                            <div className="h-1/5 p-6 flex flex-col justify-center bg-white dark:bg-gray-800">
                                <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-white capitalize truncate">
                                    {card.alt_description || 'Inspiration'}
                                </h3>
                            </div>

                            {/* Icons */}
                            <motion.div style={{ opacity: bgLikeOpacity }} className="absolute top-10 left-10 p-4 border-4 border-green-500 rounded-full bg-green-500/20">
                                <Check className="w-12 h-12 text-green-500" />
                            </motion.div>
                            <motion.div style={{ opacity: bgNopeOpacity }} className="absolute top-10 right-10 p-4 border-4 border-red-500 rounded-full bg-red-500/20">
                                <X className="w-12 h-12 text-red-500" />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="flex gap-8 mt-8 z-10 w-full justify-center">
                <button onClick={() => swipe('nope')} className="p-6 rounded-full bg-white dark:bg-gray-800 text-red-500 shadow-lg w-20 h-20 flex items-center justify-center border-2 border-transparent hover:border-red-500/50">
                    <X size={32} />
                </button>
                <button onClick={() => swipe('like')} className="p-6 rounded-full bg-gold text-white shadow-lg w-20 h-20 flex items-center justify-center">
                    <Heart size={32} fill="currentColor" />
                </button>
            </div>
        </div>
    );
}
