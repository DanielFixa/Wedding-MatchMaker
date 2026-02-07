'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function reconsiderVote(voteId: string) {
    const supabase = await createClient();

    // Safety check: ensure the vote belongs to the user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authorized' };

    const { error } = await supabase
        .from('votes')
        .delete()
        .eq('id', voteId)
        .eq('user_id', user.id); // Security: only delete own votes

    if (error) {
        console.error('Reconsider error:', error);
        return { error: 'Failed to remove vote.' };
    }

    revalidatePath('/gallery');
    return { success: true };
}
