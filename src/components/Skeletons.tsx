import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 p-8 w-full max-w-6xl">
            <div className="w-full max-w-xl space-y-6">
                <Skeleton className="h-12 w-3/4 mx-auto rounded-xl bg-white/10" />
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl bg-white/10" />
                    ))}
                </div>
                <Skeleton className="h-20 w-full rounded-xl bg-white/10" />
                <Skeleton className="h-14 w-full rounded-xl bg-gold/50" />
            </div>
            <div className="w-full max-w-md h-64 rounded-3xl bg-white/5 border border-white/10" />
        </div>
    )
}

export function GameCardSkeleton() {
    return (
        <div className="relative w-full max-w-sm h-[600px] bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
        </div>
    )
}
