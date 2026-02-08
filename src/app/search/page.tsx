'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchSuppliers, getUniqueLocations } from './actions';
import { Loader2, Search, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Database } from '@/types/database.types';

type Supplier = Database['public']['Tables']['suppliers']['Row'];

// Fallback image if unsplash url fails or is missing
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070';

export default function SearchPage() {
    const router = useRouter();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState<string[]>([]);

    // Filters
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [priceRange, setPriceRange] = useState('');

    const fetchLocations = useCallback(async () => {
        const locs = await getUniqueLocations();
        setLocations(locs);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const res = await searchSuppliers({ category, location, priceRange });
        if (res.data) {
            setSuppliers(res.data as Supplier[]);
        }
        setLoading(false);
    }, [category, location, priceRange]);

    useEffect(() => {
        // Initial load
        fetchData();
        fetchLocations();
    }, [fetchData, fetchLocations]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <ArrowLeft className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <h1 className="text-xl font-serif font-bold text-gold">Find Suppliers</h1>
                    </div>
                </div>
            </header>

            {/* Search Controls */}
            <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4">
                <div className="max-w-7xl mx-auto">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* Category Select */}
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 border rounded-lg appearance-none bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-gold focus:border-gold"
                            >
                                <option value="">All Categories</option>
                                <option value="Venue">Venue</option>
                                <option value="Photographer">Photographer</option>
                                <option value="Catering">Catering</option>
                                <option value="Florist">Florist</option>
                                <option value="Transport">Transport</option>
                            </select>
                        </div>

                        {/* Location Select */}
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-gold focus:border-gold"
                            >
                                <option value="">Any Location</option>
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Select */}
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-gold focus:border-gold"
                            >
                                <option value="">Any Price</option>
                                <option value="$">$ (Budget)</option>
                                <option value="$$">$$ (Moderate)</option>
                                <option value="$$$">$$$ (Premium)</option>
                                <option value="$$$$">$$$$ (Luxury)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="bg-gold hover:bg-[#C5A028] text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Search className="h-4 w-4" />
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Results */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 text-gold animate-spin" />
                    </div>
                ) : suppliers.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No suppliers found</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suppliers.map((supplier) => (
                            <div key={supplier.id} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                <div className="aspect-video relative overflow-hidden bg-gray-200">
                                    <Image
                                        src={supplier.image_url || FALLBACK_IMAGE}
                                        alt={supplier.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-xs font-bold text-gray-900 dark:text-white">
                                        {supplier.rating} ★
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">{supplier.name}</h3>
                                            <p className="text-sm text-gold font-medium">{supplier.category}</p>
                                        </div>
                                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{supplier.price_range}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {supplier.location}
                                    </div>
                                    <button className="hidden w-full mt-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-white transition-colors text-sm font-semibold">
                                        Shortlist
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
