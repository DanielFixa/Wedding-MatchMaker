import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GameInterface from "@/components/GameInterface";

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    const { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !room) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Room not found.
            </div>
        );
    }

    if (!room.images) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                No images loaded for this room.
            </div>
        );
    }

    const targetVotes = room.guest_id ? (room.card_count || 0) * 2 : (room.card_count || 0);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1520025178923-a55e2d5746b1?q=80&w=1968&auto=format&fit=crop')] bg-cover bg-center overflow-hidden">
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md" />

            <div className="relative z-10 w-full flex flex-col items-center">
                <h1 className="text-2xl font-serif text-gold font-bold mb-8 uppercase tracking-widest">
                    {room.category}
                </h1>

                <GameInterface
                    roomId={room.id}
                    images={room.images as any[]}
                    targetVotes={targetVotes}
                />
            </div>
        </div>
    );
}
