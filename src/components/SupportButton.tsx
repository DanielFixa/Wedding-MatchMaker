'use client'

import { Heart } from 'lucide-react'

export default function SupportButton() {
    return (
        <a
            href="https://ko-fi.com/weddingmatchmaker"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full 
        backdrop-blur-md bg-black/30 hover:bg-black/40 border border-white/10 
        shadow-lg transition-all duration-300 hover:scale-105 group"
            aria-label="Support this project on Ko-fi"
        >
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500/20 group-hover:fill-pink-500 transition-colors duration-300" />
            <span className="text-sm font-medium text-white/90">
                <span className="hidden sm:inline">Support this project </span>
                <span className="inline">($1, $3 or $5)</span>
            </span>
        </a>
    )
}
