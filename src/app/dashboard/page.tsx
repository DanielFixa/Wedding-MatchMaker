'use client';

import { createRoom, joinRoom } from './actions';
import { useActionState, useEffect, useState } from 'react'; // Fixed import for Next.js 15
import { Loader2, Heart, Gem, House, Camera, Sparkles, Shuffle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const categories = [
    { id: 'wedding dress', label: 'Dresses', icon: Heart, desc: 'Find the perfect gown' },
    { id: 'wedding rings', label: 'Rings', icon: Gem, desc: 'Sparkling symbols of love' },
    { id: 'wedding venue', label: 'Venue', icon: House, desc: 'Dream locations' },
    { id: 'wedding decor', label: 'Decor', icon: Camera, desc: 'Style your big day' },
];

export default function Dashboard() {
    const [createState, createAction, isPendingCreate] = useActionState(createRoom, null);
    const [joinState, joinAction, isPendingJoin] = useActionState(joinRoom, null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cardCount, setCardCount] = useState(10);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        if (createState?.success) {
            router.push(`/room/${createState.roomId}/lobby`);
        }
    }, [createState, router]);

    useEffect(() => {
        if (joinState?.success) {
            // Check if player is host or guest to direct correctly, though /play handles both roles usually if set up right.
            // But usually joinRoom returns success for Guest.
            // If it returns isHost, we might want to go to lobby? 
            // For now, let's assume /play for guest and /lobby for host flow, but strictly:
            // joinRoom finds a room. If validation passes, we go to play usually? 
            // Wait, standard flow: Host -> Lobby. Guest -> Play (or Lobby -> Play).
            // Let's send Guest to Lobby first (if we want them to see "Waiting" or "Ready") 
            // OR checks status. If Status is Active, go to Play.
            // For simplicity/robustness, let's send to LobbyPage which handles the "Active" check & redirect.
            router.push(`/room/${joinState.roomId}/lobby`);
        }
    }, [joinState, router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex flex-col">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

            <header className="relative z-10 w-full p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-gold animate-pulse" />
                    <h1 className="text-2xl font-serif font-bold text-gold tracking-wide">Wedding Matchmaker</h1>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm"
                >
                    <LogOut size={16} /> Sign Out
                </button>
            </header>

            <main className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-12 p-8">

                {/* CREATE ROOM SECTION */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="glass-panel p-8 rounded-3xl shadow-2xl w-full max-w-xl"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif text-white mb-2">Create Room</h2>
                        <p className="text-gray-300">Start a new matching session.</p>
                    </div>

                    <form action={createAction} className="space-y-6">
                        {/* Categories Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`relative cursor-pointer group p-4 rounded-xl border transition-all duration-300 ${selectedCategory === cat.id
                                        ? 'bg-gold/90 border-gold text-white shadow-[0_0_20px_rgba(212,175,55,0.5)] scale-105'
                                        : 'bg-black/40 border-white/10 text-gray-300 hover:bg-black/60 hover:border-gold/50'
                                        }`}
                                >
                                    <cat.icon className={`w-8 h-8 mb-2 ${selectedCategory === cat.id ? 'text-white' : 'text-gold'}`} />
                                    <div className="font-semibold">{cat.label}</div>
                                    <div className="text-xs opacity-70">{cat.desc}</div>
                                </div>
                            ))}
                        </div>



                        {/* Gallery Link */}
                        <div className="mb-6">
                            <button
                                type="button"
                                onClick={() => router.push('/gallery')}
                                className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white hover:border-gold/30 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gold/10 rounded-full text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                                        <Heart size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-sm">Couple's Memory</div>
                                        <div className="text-xs opacity-60">View your matches & history</div>
                                    </div>
                                </div>
                                <div className="text-gold opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                    →
                                </div>
                            </button>
                        </div>

                        {/* Random Button */}
                        <div
                            onClick={() => setSelectedCategory('random')}
                            className={`cursor-pointer w-full p-4 rounded-xl border flex items-center justify-center gap-3 transition-all duration-300 ${selectedCategory === 'random'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-transparent text-white shadow-lg scale-105'
                                : 'bg-black/40 border-white/10 text-gray-300 hover:bg-black/60 hover:border-white/30'
                                }`}
                        >
                            <Shuffle className={`w-5 h-5 ${selectedCategory === 'random' ? 'animate-spin' : ''}`} />
                            <div>
                                <div className="font-semibold">Surprise Me!</div>
                                <div className="text-xs opacity-70">Random Category Mix</div>
                            </div>
                        </div>

                        <input type="hidden" name="category" value={selectedCategory || ''} />

                        {/* Deck Size */}
                        <div className="flex flex-col items-center gap-3 py-2">
                            <span className="text-sm text-gray-400 uppercase tracking-widest text-xs">Deck Size</span>
                            <div className="flex gap-4">
                                {[10, 20].map(count => (
                                    <button
                                        key={count}
                                        type="button"
                                        onClick={() => setCardCount(count)}
                                        className={`px-4 py-1 rounded-full text-sm border transition-all ${cardCount === count
                                            ? 'bg-white text-black border-white'
                                            : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
                                            }`}
                                    >
                                        {count} Cards
                                    </button>
                                ))}
                            </div>
                        </div>
                        <input type="hidden" name="cardCount" value={cardCount} />

                        {createState?.error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                {createState.error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPendingCreate || !selectedCategory}
                            className="w-full py-4 bg-gold hover:bg-[#C5A028] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isPendingCreate ? <Loader2 className="animate-spin" /> : 'Create & Host'}
                        </button>
                    </form>
                </motion.div>

                {/* JOIN ROOM SECTION */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="glass-panel p-8 rounded-3xl shadow-2xl w-full max-w-md h-fit"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif text-white mb-2">Join Room</h2>
                        <p className="text-gray-300">Enter code to join partner.</p>
                    </div>

                    <form action={joinAction} className="space-y-6">
                        <input
                            name="code"
                            type="text"
                            placeholder="A B C D E"
                            required
                            maxLength={5}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-5 text-center text-3xl tracking-[0.5em] font-mono text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-colors uppercase"
                        />

                        {joinState?.error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                {joinState.error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPendingJoin}
                            className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isPendingJoin ? <Loader2 className="animate-spin" /> : 'Join Game'}
                        </button>
                    </form>
                </motion.div>

            </main>
        </div >
    );
}
