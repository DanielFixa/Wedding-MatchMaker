import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Heart, Trash2, ArrowLeft, RefreshCcw, ThumbsDown } from "lucide-react";
import Link from "next/link";
import { reconsiderVote } from "@/actions/gallery";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch all votes for this user
    const { data: votes } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const matches = votes?.filter(v => v.vote_type === 'like') || [];
    const limbo = votes?.filter(v => v.vote_type === 'nope') || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white pb-20">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
                <Link href="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-serif font-bold text-gold">Couples Memory</h1>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                <GalleryClient matches={matches} limbo={limbo} />
            </main>
        </div>
    );
}
