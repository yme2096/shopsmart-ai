import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Package, ShoppingBag, Hash, Calendar } from "lucide-react"
import api from "../services/api"
import { OrderCardSkeleton } from "../components/ui/Skeleton"

const STATUS = {
    pending:    { label: "Pending",    cls: "bg-amber-50 text-amber-700 border-amber-200" },
    processing: { label: "Processing", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    shipped:    { label: "Shipped",    cls: "bg-purple-50 text-purple-700 border-purple-200" },
    delivered:  { label: "Delivered",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    cancelled:  { label: "Cancelled",  cls: "bg-red-50 text-red-700 border-red-200" },
}

export default function MyOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/orders/my").then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="min-h-screen bg-[#f8f8f8] pt-14">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                <div className="skeleton h-6 w-32 rounded mb-1" />
                <div className="skeleton h-3 w-20 rounded mb-6" />
                <div className="space-y-3">{[1,2,3].map(i => <OrderCardSkeleton key={i} />)}</div>
            </div>
        </div>
    )

    if (orders.length === 0) return (
        <div className="min-h-screen bg-[#f8f8f8] pt-14 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package size={24} className="text-zinc-400" />
                </div>
                <p className="text-base font-semibold text-zinc-900">No orders yet</p>
                <p className="text-xs text-zinc-400 mt-1">Your order history will appear here.</p>
                <Link to="/" className="inline-flex items-center gap-1.5 mt-5 bg-zinc-900 text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors">
                    <ShoppingBag size={12} /> Start Shopping
                </Link>
            </motion.div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#f8f8f8] pt-14">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

                <div className="mb-5">
                    <h1 className="text-xl font-bold text-zinc-900">My Orders</h1>
                    <p className="text-xs text-zinc-400 mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
                </div>

                <div className="space-y-3">
                    {orders.map((order, i) => {
                        const s = STATUS[order.status] || STATUS.pending
                        return (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="bg-white border border-zinc-200 rounded-xl overflow-hidden"
                            >
                                {/* HEADER */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                                    <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                                        <span className="flex items-center gap-1">
                                            <Hash size={10} />
                                            <span className="font-mono font-medium text-zinc-600">{order._id.slice(-8).toUpperCase()}</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} />
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${s.cls}`}>{s.label}</span>
                                </div>

                                {/* ITEMS */}
                                <div className="px-4 py-3 space-y-2.5">
                                    {order.items.map((item, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-zinc-50 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-zinc-900 truncate">{item.name}</p>
                                                <p className="text-[11px] text-zinc-400">₹{item.price.toLocaleString()} × {item.quantity}</p>
                                            </div>
                                            <p className="text-xs font-bold text-zinc-900 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* FOOTER */}
                                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 border-t border-zinc-100">
                                    <span className="text-[11px] text-zinc-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                                    <span className="text-xs font-bold text-zinc-900">Total: ₹{order.totalPrice.toLocaleString()}</span>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
