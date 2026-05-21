function Input({
    label,
    icon: Icon,
    error,
    className = "",
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-zinc-700">{label}</label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                        <Icon size={16} />
                    </div>
                )}
                <input
                    className={`
                        w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm
                        text-zinc-900 placeholder:text-zinc-400
                        focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent
                        transition-all duration-200
                        ${Icon ? "pl-10" : ""}
                        ${error ? "border-red-400 focus:ring-red-400" : ""}
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

export default Input
