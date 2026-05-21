import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import toast from "react-hot-toast"

export default function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext)

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)
        toast.success("Added to cart!")
    }

    return (
        <Link to={`/product/${product._id}`} className="group block">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">

                {/* IMAGE */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* INFO */}
                <div className="p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                        {product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-gray-900">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {product.stock === 0 ? "Sold out" : "Add to cart"}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}
