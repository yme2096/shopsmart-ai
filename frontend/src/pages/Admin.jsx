import { useEffect, useState } from "react"
import api from "../services/api"
import toast from "react-hot-toast"
import Spinner from "../components/Spinner"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts"

const TABS = ["Analytics", "Products", "Orders"]

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"]

function Admin() {
    const [tab, setTab] = useState("Analytics")
    const [analytics, setAnalytics] = useState(null)
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        name: "", description: "", price: "", image: "", category: "", stock: ""
    })

    const fetchAnalytics = async () => {
        const res = await api.get("/orders/analytics")
        setAnalytics(res.data)
    }

    const fetchProducts = async () => {
        const res = await api.get("/products?limit=100")
        setProducts(res.data.products)
    }

    const fetchOrders = async () => {
        const res = await api.get("/orders/all")
        setOrders(res.data)
    }

    useEffect(() => {
        setLoading(true)
        Promise.all([fetchAnalytics(), fetchProducts(), fetchOrders()])
            .finally(() => setLoading(false))
    }, [])

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const imageData = new FormData()
            imageData.append("image", formData.image)

            let imageUrl = formData.image
            if (formData.image instanceof File) {
                const uploadRes = await api.post("/upload", imageData)
                imageUrl = uploadRes.data.imageUrl
            }

            const productData = { ...formData, image: imageUrl }

            if (editingId) {
                await api.put(`/products/${editingId}`, productData)
                toast.success("Product updated!")
                setEditingId(null)
            } else {
                await api.post("/products", productData)
                toast.success("Product added!")
            }

            setFormData({ name: "", description: "", price: "", image: "", category: "", stock: "" })
            fetchProducts()
        } catch {
            toast.error("Something went wrong")
        }
    }

    const editHandler = (product) => {
        setEditingId(product._id)
        setFormData({
            name: product.name, description: product.description,
            price: product.price, image: product.image,
            category: product.category, stock: product.stock
        })
        setTab("Products")
    }

    const deleteHandler = async (id) => {
        if (!confirm("Delete this product?")) return
        try {
            await api.delete(`/products/${id}`)
            toast.success("Product deleted!")
            fetchProducts()
        } catch {
            toast.error("Delete failed")
        }
    }

    const updateStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status })
            toast.success("Status updated!")
            fetchOrders()
        } catch {
            toast.error("Update failed")
        }
    }

    if (loading) return <Spinner />

    return (
        <div className="p-6 md:p-10">
            <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

            {/* TABS */}
            <div className="flex gap-2 mb-8 border-b">
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-6 py-2 font-semibold transition ${
                            tab === t ? "border-b-2 border-black" : "text-gray-500 hover:text-black"
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* ANALYTICS TAB */}
            {tab === "Analytics" && analytics && (
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: "Total Products", value: analytics.totalProducts },
                            { label: "Total Orders", value: analytics.totalOrders },
                            { label: "Total Users", value: analytics.totalUsers },
                            { label: "Total Revenue", value: `₹ ${analytics.totalRevenue}` }
                        ].map((stat) => (
                            <div key={stat.label} className="border rounded-lg p-5 text-center">
                                <p className="text-gray-500 text-sm">{stat.label}</p>
                                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border rounded-lg p-5">
                            <h2 className="font-bold mb-4">Revenue (Last 7 Days)</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={analytics.revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="border rounded-lg p-5">
                            <h2 className="font-bold mb-4">Orders (Last 7 Days)</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={analytics.revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="orders" fill="#000" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* PRODUCTS TAB */}
            {tab === "Products" && (
                <div>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-10 border p-6 rounded-lg">
                        <h2 className="md:col-span-2 text-xl font-bold">
                            {editingId ? "Edit Product" : "Add Product"}
                        </h2>
                        {["name", "description", "category"].map((field) => (
                            <input
                                key={field}
                                type="text"
                                name={field}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                className="border p-3 rounded"
                            />
                        ))}
                        <input type="number" name="price" placeholder="Price" value={formData.price}
                            onChange={handleChange} required className="border p-3 rounded" />
                        <input type="number" name="stock" placeholder="Stock" value={formData.stock}
                            onChange={handleChange} required className="border p-3 rounded" />
                        <input type="file" className="border p-3 rounded"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                        <div className="md:col-span-2 flex gap-3">
                            <button className="bg-black text-white py-3 px-8 rounded hover:bg-gray-800 transition">
                                {editingId ? "Update Product" : "Add Product"}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => { setEditingId(null); setFormData({ name: "", description: "", price: "", image: "", category: "", stock: "" }) }}
                                    className="border py-3 px-8 rounded hover:bg-gray-100 transition">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="space-y-3">
                        {products.map((product) => (
                            <div key={product._id} className="border p-4 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded" />
                                    <div>
                                        <h2 className="font-bold">{product.name}</h2>
                                        <p className="text-gray-500 text-sm">₹ {product.price} · {product.category} · Stock: {product.stock}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => editHandler(product)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                                        Edit
                                    </button>
                                    <button onClick={() => deleteHandler(product._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ORDERS TAB */}
            {tab === "Orders" && (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <p className="text-gray-500">No orders yet</p>
                    ) : (
                        orders.map((order) => (
                            <div key={order._id} className="border rounded-lg p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-semibold">{order.user?.name}</p>
                                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                                        <p className="text-xs text-gray-400 font-mono">{order._id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">₹ {order.totalPrice}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <label className="text-sm font-semibold">Status:</label>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className="border p-1 rounded text-sm"
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default Admin
