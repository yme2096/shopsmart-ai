import { useEffect, useState, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Heart, ArrowLeft, Star, Shield, Truck, RotateCcw } from "lucide-react"
import { CartContext } from "../context/CartContext"
import api from "../services/api"
import Spinner from "../components/Spinner"
import toast from "react-hot-toast"

const REVIEWS = [
    { name: "Rahul S.", rating: 5, text: "Excellent quality, exactly as described.", date: "2 days ago" },
    { name: "Priya M.", rating: 4, text: "Great product, fast delivery.",            date: "1 week ago" },
    { name: "Amit K.", rating: 5, text: "Worth every rupee. Premium feel.",          date: "2 weeks ago" },
]

export default function ProductDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useContext(CartContext)

    const [product,  setProduct]  = useState(null)
    const [related,  setRelated]  = useState([])
    const [loading,  setLoading]  = useState(true)
    const [wished,   setWished]   = useState(false)
    const [qty,      setQty]      = useState(1)

    useEffect(() => {
        window.scrollTo(0, 0)
        setLoading(true)
        setQty(1)
        Promise.all([
            api.get(`/products/${id}`),
           api.get(`/products/related/${id}`)
        ])
            .then(([p, r]) => { setProduct(p.data); setRelated(r.data) })
            .catch(() => toast.error("Failed to load product"))
            .finally(() => setLoading(false))
    }, [id])

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) addToCart(product)
        toast.success(`${product.name} added to cart!`)
    }

    if (loading) return <Spinner />

    if (!product) return (
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
            <p className="text-gray-500">Product not found.</p>
            <button onClick={() => navigate("/")} className="mt-3 text-sm text-gray-900 hover:underline">
                ← Back to shop
            </button>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">

            {/* BREADCRUMB */}
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
                <ArrowLeft size={15} />
                Back to products
            </button>

            {/* MAIN */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                {/* IMAGE */}
                <div className="relative">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden aspect-square">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {product.stock === 0 && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <span className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setWished(w => !w)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-red-300 transition-colors shadow-sm"
                    >
                        <Heart
                            size={16}
                            className={wished ? "fill-red-500 text-red-500" : "text-gray-400"}
                        />
                    </button>
                </div>

                {/* DETAILS */}
                <div>
                    <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full mb-3">
                        {product.category}
                    </span>

                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {product.name}
                    </h1>

                    {/* STARS */}
                    <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={13}
                                    className={i < 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">4.5 (3 reviews)</span>
                    </div>

                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                        {product.description}
                    </p>

                    {/* PRICE */}
                    <div className="flex items-center gap-3 mt-5">
                        <span className="text-3xl font-bold text-gray-900">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span className={`flex items-center gap-1.5 text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                    </div>

                    {/* QTY + ADD */}
                    {product.stock > 0 && (
                        <div className="flex items-center gap-3 mt-5">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg"
                                >
                                    −
                                </button>
                                <span className="w-9 text-center text-sm font-semibold text-gray-900">
                                    {qty}
                                </span>
                                <button
                                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
                            >
                                <ShoppingCart size={16} />
                                Add to Cart
                            </button>

                            <button
                                onClick={() => setWished(w => !w)}
                                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all"
                            >
                                <Heart
                                    size={16}
                                    className={wished ? "fill-red-500 text-red-500" : "text-gray-400"}
                                />
                            </button>
                        </div>
                    )}

                    {/* TRUST */}
                    <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100">
                        {[
                            { icon: Truck,     text: "Free delivery ₹999+" },
                            { icon: RotateCcw, text: "7-day returns" },
                            { icon: Shield,    text: "Secure payment" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Icon size={14} className="text-gray-600" />
                                </div>
                                <span className="text-xs text-gray-500 leading-tight">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* REVIEWS */}
            <section className="mt-10">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Customer Reviews</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                    {REVIEWS.map((r, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-semibold text-gray-600">{r.name[0]}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{r.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">{r.date}</span>
                            </div>
                            <div className="flex gap-0.5 mb-2">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} size={11} className={j < r.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">{r.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* RELATED */}
            {related.length > 0 && (
                <section className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-900">You Might Also Like</h2>
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                            View all →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {related.map(item => (
                            <Link
                                key={item._id}
                                to={`/product/${item._id}`}
                                className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-3">
                                    <p className="text-xs text-gray-400 mb-0.5">{item.category}</p>
                                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                                    <p className="text-sm font-bold text-gray-900 mt-1">
                                        ₹{item.price.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
