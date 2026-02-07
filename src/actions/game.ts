'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitVote(roomId: string, imageUrl: string, voteType: 'like' | 'nope', description?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 1. Record Vote
    const { error } = await supabase
        .from('votes')
        .insert({
            room_id: roomId,
            user_id: user.id,
            image_url: imageUrl,
            vote_type: voteType,
            item_description: description
        })

    if (error) {
        console.error('Vote Error:', error)
        return { error: error.message }
    }

    // 2. Check for Completion
    // Get room details to know card count
    const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('card_count, guest_id')
        .eq('id', roomId)
        .single()

    if (roomError || !room) return { success: true } // Should verify logic, but safe to continue

    // Count votes for this room
    const { count, error: countError } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', roomId)

    if (countError) return { success: true }

    // Logic: If guest exists, we need 2 * card_count votes. If solo (testing), just card_count.
    const expectedVotes = room.guest_id ? (room.card_count || 0) * 2 : (room.card_count || 0)

    if (count !== null && count >= expectedVotes) {
        await supabase
            .from('rooms')
            .update({ status: 'finished' })
            .eq('id', roomId)
    }

    return { success: true }
}

export async function getMatches(roomId: string) {
    const supabase = await createClient()

    // Get all likes for the room
    const { data: votes, error } = await supabase
        .from('votes')
        .select('image_url, user_id, item_description')
        .eq('room_id', roomId)
        .eq('vote_type', 'like')

    if (error) {
        console.error('Fetch Matches Error:', error)
        return { matches: [] }
    }

    // Group by Image URL
    const voteMap = new Map<string, { count: number, description: string }>();

    votes.forEach(vote => {
        const current = voteMap.get(vote.image_url) || { count: 0, description: vote.item_description || '' }
        voteMap.set(vote.image_url, {
            count: current.count + 1,
            description: current.description
        })
    })

    // Filter for images with 2 likes (or 1 if testing without guest, but requirement implies matching involves 2 people)
    // We'll return images that have more than 1 like if guest exists, or just all likes if single player for visual feedback?
    // Let's stick to "Matches" meaning 2 people liked it.

    const matches: { image_url: string, description: string }[] = [];

    // We need to know if there was a guest to strictly enforce "Match" logic, 
    // but typically a match is > 1 vote in this context. 
    // If strict 2-player mode:

    voteMap.forEach((value, key) => {
        if (value.count > 1) {
            matches.push({ image_url: key, description: value.description })
        }
    })

    return { matches }
}
