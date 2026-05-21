import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-700 shadow-sm",
    secondary: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-sm",
    ghost: "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
}

const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-7 py-3.5 text-base rounded-xl",
    xl: "px-10 py-4 text-base rounded-2xl"
}

function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    onClick,
    type = "button",
    fullWidth = false
}) {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            className={`
                inline-flex items-center justify-center gap-2 font-medium
                transition-all duration-200 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? "w-full" : ""}
                ${className}
            `}
        >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {children}
        </motion.button>
    )
}

export default Button
