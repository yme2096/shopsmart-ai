function Skeleton({ className = "" }) {
    return <div className={`skeleton ${className}`} />
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-7 w-24 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export function OrderCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="px-4 py-3 space-y-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
    )
}

export default Skeleton
