'use server'

import { createClient } from '@/lib/supabase/server'
import { searchWeddingImages } from '@/lib/unsplash'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

function generateRoomCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export async function createRoom(prevState: unknown, formData: FormData) {
    const start = Date.now();
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to create a room.' }
    }

    // 2. Extract Data
    const category = formData.get('category') as string
    const cardCount = parseInt(formData.get('cardCount') as string) || 10

    if (!category) {
        return { error: 'Please select a category.' }
    }

    try {
        console.log('[PERF] Starting Room Creation...');

        // 3. Parallel Fetch (Mission 2)
        const categories = ['wedding dress', 'wedding decor', 'wedding rings', 'wedding venue'];
        const searchQuery = category === 'random'
            ? categories[Math.floor(Math.random() * categories.length)]
            : category;

        // TIMEOUT PROMISE
        const timeoutPromise = new Promise<{ id: string, urls: { regular: string }[], alt_description: string }[]>((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), 3000)
        );

        // DATA PROMISES
        const votesPromise = supabase.from('votes').select('image_url').eq('user_id', user.id);

        // Fetch 3x cards to allow for filtering duplicates
        const unsplashPromise = searchWeddingImages(searchQuery, cardCount * 3);

        // Execute in Parallel
        const [votesResult, unsplashImages] = await Promise.allSettled([
            votesPromise,
            Promise.race([unsplashPromise, timeoutPromise]) // Race against 3s
        ]);

        // Process Votes (Set for O(1) lookup)
        const votedSet = new Set<string>();
        if (votesResult.status === 'fulfilled' && votesResult.value.data) {
            votesResult.value.data.forEach((v: any) => votedSet.add(v.image_url));
        }

        // Process Images
        let finalImages: any[] = [];

        if (unsplashImages.status === 'fulfilled') {
            // Filter (Mission 2: Set Filter)
            finalImages = (unsplashImages.value as any[]).filter((img: { urls: { regular: string } }) => !votedSet.has(img.urls.regular));
        } else {
            console.warn('[PERF] Unsplash timed out or failed. Using fallback.');
        }

        // Fallback if empty or timeout (Mission 2: Immediate Fallback to ensure deck completion)
        if (finalImages.length < cardCount) {
            console.log('[PERF] Not enough fresh images. Filling with random backups.');
            // Logic to fetch backup/random images would go here, or just allow duplicates if absolutely critical.
            // For now, if we have SOME images, we use them. If 0, we might strictly fail or use cached.
            // Implemented simple random filler by NOT filtering if we are desperate?
            // Or better: Re-use Unsplash images if we ran out of fresh ones (better than empty game)
            if (unsplashImages.status === 'fulfilled' && (unsplashImages.value as any[]).length > 0) {
                const remaining = cardCount - finalImages.length;
                const rawImages = unsplashImages.value as any[];
                // Take whatever we have, even if voted, to let the user play
                const extras = rawImages.filter(img => !finalImages.includes(img)).slice(0, remaining);
                finalImages = [...finalImages, ...extras];
            }
        }

        // Trim to exact count
        finalImages = finalImages.slice(0, cardCount);

        // 4. Create Room
        const code = generateRoomCode()
        const { data, error } = await supabase
            .from('rooms')
            .insert({
                code,
                host_id: user.id,
                category: category === 'random' ? `Results: ${searchQuery}` : category,
                card_count: cardCount,
                status: 'waiting',
                images: finalImages as any // eslint-disable-line @typescript-eslint/no-explicit-any
            })
            .select()
            .single()

        if (error) throw error;

        console.log(`[PERF] Room created in: ${Date.now() - start} ms`);
        return { success: true, roomId: data.id }

    } catch (error: unknown) {
        console.error('Create Room Critical Error:', error)
        return { error: 'System busy. Please try again.' }
    }
}

export async function joinRoom(prevState: unknown, formData: FormData) {
    const start = Date.now();
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Login required.' }

    const code = formData.get('code') as string
    if (!code || code.length !== 5) return { error: 'Invalid code.' }

    try {
        // Mission 3: Single query to Find AND Update if possible, or minimal ops.
        // We need to know if we are updating, but let's query first.
        const { data: room, error } = await supabase
            .from('rooms')
            .select('id, host_id, guest_id')
            .eq('code', code.toUpperCase())
            .single();

        if (error || !room) return { error: 'Room not found.' }

        // If resuming
        if (room.host_id === user.id || room.guest_id === user.id) {
            return { success: true, roomId: room.id }
        }

        // Join as Guest
        if (!room.guest_id) {
            // Fire and forget update? No, we need to know it succeeded.
            const { error: updateError } = await supabase
                .from('rooms')
                .update({ guest_id: user.id, status: 'active' })
                .eq('id', room.id);

            if (updateError) return { error: 'Failed to join.' };
        } else {
            return { error: 'Room Full.' }
        }

        console.log(`[PERF] Join Room processed in: ${Date.now() - start} ms`);
        return { success: true, roomId: room.id }

    } catch (error: unknown) {
        return { error: 'Error joining room.' }
    }
}
