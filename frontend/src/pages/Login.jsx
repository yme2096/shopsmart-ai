import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import api from "../services/api"
import toast from "react-hot-toast"

export default function Login() {
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)

    const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await api.post("/auth/login", form)
            login({ ...data.user, token: data.token })
            toast.success(`Welcome back, ${data.user.name}!`)
            navigate("/")
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
            <div className="w-full max-w-sm">

                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in</h1>
                    <p className="text-sm text-gray-500 mb-6">Welcome back to ShopSmart AI</p>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={onChange}
                                required
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={onChange}
                                required
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-5">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-gray-900 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
