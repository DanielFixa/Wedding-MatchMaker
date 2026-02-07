'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Heart, RefreshCcw, ThumbsDown, Trash2 } from 'lucide-react';
import { reconsiderVote } from '@/actions/gallery';

interface GalleryClientProps {
    matches: any[];
    limbo: any[];
}

export default function GalleryClient({ matches, limbo }: GalleryClientProps) {
    const [activeTab, setActiveTab] = useState<'matches' | 'limbo'>('matches');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleReconsider = async (voteId: string) => {
        setDeletingId(voteId);
        await reconsiderVote(voteId);
        setDeletingId(null);
        // Optimistic update effectively handled by server revalidate but UI might lag slightly without local filter
        // We rely on Props update from server component re-render in NextJS or we can force refresh.
        // revalidatePath usually triggers a refresh.
    };

    const displayItems = activeTab === 'matches' ? matches : limbo;

    return (
        <div>
            {/* TABS */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('matches')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${activeTab === 'matches'
                            ? 'bg-gold text-white shadow-lg scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    <Heart className="w-4 h-4" fill={activeTab === 'matches' ? "currentColor" : "none"} />
                    Matches ({matches.length})
                </button>
                <button
                    onClick={() => setActiveTab('limbo')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${activeTab === 'limbo'
                            ? 'bg-gray-800 dark:bg-white text-white dark:text-black shadow-lg scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    <ThumbsDown className="w-4 h-4" />
                    Limbo ({limbo.length})
                </button>
            </div>

            {/* GRID */}
            {displayItems.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p>No memories here yet.</p>
                </div>
            ) : (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {displayItems.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            key={item.id}
                            className="relative break-inside-avoid group rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-900"
                        >
                            <div className="relative w-full aspect-[3/4]">
                                <Image
                                    src={item.image_url}
                                    alt="Memory"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </div>

                            {/* Overlay Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs truncate font-medium">{item.item_description || 'Inspiration'}</p>
                            </div>

                            {/* RECONSIDER BUTTON (Limbo Only) */}
                            {activeTab === 'limbo' && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleReconsider(item.id);
                                    }}
                                    disabled={deletingId === item.id}
                                    className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                                    title="Reconsider (Delete Vote)"
                                >
                                    {deletingId === item.id ? (
                                        <RefreshCcw className="w-4 h-4 animate-spin text-gray-500" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
