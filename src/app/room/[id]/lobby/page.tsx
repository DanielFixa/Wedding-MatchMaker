'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Copy, Users } from 'lucide-react';

export default function LobbyPage() {
    const { id } = useParams();
    const router = useRouter();
    const supabase = createClient();
    const [roomCode, setRoomCode] = useState<string>('...');
    const [copied, setCopied] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (isRedirecting) return;

        // 1. Initial Check & Auto-Join
        const fetchRoom = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log('Lobby: No user found. Redirecting to login...');
                // Optional: Pass current URL as 'next' param if login supports it
                const returnUrl = encodeURIComponent(window.location.pathname);
                router.push(`/login?next=${returnUrl}`);
                return;
            }

            const { data } = await supabase.from('rooms').select('code, guest_id, status, host_id').eq('id', id as string).single();

            if (data) {
                setRoomCode(data.code);

                // REDIRECT: Game Active OR Guest Already Set (and I'm one of them)
                if (data.status === 'active' || data.guest_id) {
                    console.log('Lobby: Room active. Redirecting...');
                    setIsRedirecting(true);
                    router.replace(`/room/${id}/play`);
                    return;
                }

                // AUTO-JOIN: If I am NOT host, and room is waiting, JOIN ME.
                if (user && data.host_id !== user.id && !data.guest_id) {
                    console.log('Lobby: Detected Guest visiting via Link. Auto-joining...');
                    const { error } = await supabase
                        .from('rooms')
                        .update({ guest_id: user.id, status: 'active' })
                        .eq('id', id as string);

                    if (!error) {
                        console.log('Lobby: Auto-join success! Redirecting...');
                        setIsRedirecting(true);
                        router.replace(`/room/${id}/play`);
                    } else {
                        console.error('Lobby: Auto-join failed', error);
                    }
                }
            }
        };

        fetchRoom();

        // 2. Realtime Subscription
        console.log(`Lobby: Subscribing to room:${id}`);
        const channel = supabase
            .channel(`lobby:${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'rooms',
                    filter: `id=eq.${id}`
                },
                (payload) => {
                    console.log('Lobby: Realtime update received!', payload);
                    const newRoom = payload.new as { status: string, guest_id: string };

                    if (newRoom.status === 'active' || newRoom.guest_id) {
                        console.log('Lobby: Realtime Trigger! Redirecting...');
                        setIsRedirecting(true);
                        router.replace(`/room/${id}/play`);
                    }
                }
            )
            .subscribe((status) => {
                console.log(`Lobby: Subscription status: ${status}`);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id, router, supabase, isRedirecting]);

    // 3. Fallback Polling (3s)
    useEffect(() => {
        if (isRedirecting) return;

        const interval = setInterval(async () => {
            const { data } = await supabase.from('rooms').select('guest_id, status').eq('id', id as string).single();
            if (data?.status === 'active' || data?.guest_id) {
                console.log('Lobby: Poll Trigger! Redirecting...');
                setIsRedirecting(true);
                router.replace(`/room/${id}/play`);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [id, router, supabase, isRedirecting]);

    const copyToClipboard = () => {
        // Copy the full URL instead of just the code
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1522673607200-1645062cd495?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md" />

            <div className="relative glass-panel p-10 rounded-2xl shadow-2xl max-w-lg w-full text-center animate-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gold/10 rounded-full">
                        <Users className="w-12 h-12 text-gold animate-pulse" />
                    </div>
                </div>

                {isRedirecting ? (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <h2 className="text-3xl font-serif mb-4 text-gray-800 dark:text-gray-100">Partner Found!</h2>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-600 dark:text-gray-300">Entering the room...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-serif mb-2 text-gray-800 dark:text-gray-100">Waiting for Partner</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Share this link with your partner to start matching.
                        </p>

                        <div className="bg-white dark:bg-black/50 border-2 border-dashed border-gold/50 rounded-xl p-6 mb-8 flex flex-col items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">Room Code</span>
                            <span className="text-5xl font-mono tracking-widest text-gray-900 dark:text-white font-bold">{roomCode}</span>
                        </div>

                        <button
                            onClick={copyToClipboard}
                            className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-gold hover:bg-[#C5A028] text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
                        >
                            <Copy size={20} />
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>

                        <p className="mt-6 text-sm text-gray-500 animate-pulse">
                            The game will start automatically when they join...
                        </p>

                        <div className="mt-4 text-xs text-gray-400 font-mono">
                            Status: Listening for updates...
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
