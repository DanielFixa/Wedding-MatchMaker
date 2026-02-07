'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signup } from '../auth/actions';

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signup, null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1511285560982-1351c4a7575b?q=80&w=1776&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-sm" />

            <div className="relative glass-panel p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif text-gold mb-2">Join Us</h1>
                    <p className="text-gray-600 dark:text-gray-200">Start your wedding journey</p>
                </div>

                <form action={formAction} className="space-y-6">
                    {state?.error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                            {state.error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Full Names (Couple)
                        </label>
                        <input
                            name="fullName"
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gold/30 bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-gold focus:outline-none transition-all"
                            placeholder="Romeo & Juliet"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gold/30 bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-gold focus:outline-none transition-all"
                            placeholder="you@wedding.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gold/30 bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-gold focus:outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 px-4 bg-gold hover:bg-[#C5A028] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                    Already have an account?{' '}
                    <Link href="/login" className="text-gold hover:underline font-semibold">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
