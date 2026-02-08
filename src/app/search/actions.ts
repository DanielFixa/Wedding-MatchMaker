'use server'

import { createClient } from '@/lib/supabase/server'

export async function searchSuppliers(filters: {
    category?: string
    location?: string
    priceRange?: string
}) {
    const supabase = await createClient()

    let query = supabase.from('suppliers').select('*')

    if (filters.category) {
        query = query.eq('category', filters.category)
    }

    if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters.priceRange) {
        query = query.eq('price_range', filters.priceRange)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching suppliers:', error)
        return { error: 'Failed to fetch suppliers' }
    }

    return { data }
}

export async function getUniqueLocations() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('suppliers').select('location')

    if (error) return []

    // Simple dedupe
    const locations = Array.from(new Set(data.map(d => d.location)))
    return locations
}
