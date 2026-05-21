import { useState, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { ShoppingCart, Menu, X } from "lucide-react"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"

export default function Navbar() {
    const { cart } = useContext(CartContext)
    const { user, logout } = useContext(AuthContext)
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
            <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">

                {/* LOGO */}
                <Link to="/" className="text-lg font-bold text-gray-900 hover:text-gray-700 transition-colors">
                    ShopSmart AI
                </Link>

                {/* DESKTOP LINKS */}
                <div className="hidden md:flex items-center gap-1">
                    <NavLink to="/" active={isActive("/")}>Home</NavLink>
                    {user && <NavLink to="/orders" active={isActive("/orders")}>My Orders</NavLink>}
                    {user?.isAdmin && <NavLink to="/admin" active={isActive("/admin")}>Admin</NavLink>}
                </div>

                {/* RIGHT SIDE */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/cart"
                        className="relative flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                        <ShoppingCart size={18} />
                        Cart
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {cart.length > 9 ? "9+" : cart.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 font-medium">{user.name}</span>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Sign in
                        </Link>
                    )}
                </div>

                {/* MOBILE TOGGLE */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-1">
                    <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
                    {user && <MobileLink to="/orders" onClick={() => setMenuOpen(false)}>My Orders</MobileLink>}
                    {user?.isAdmin && <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</MobileLink>}
                    <MobileLink to="/cart" onClick={() => setMenuOpen(false)}>
                        Cart ({cart.length})
                    </MobileLink>
                    {user ? (
                        <button
                            onClick={() => { logout(); setMenuOpen(false) }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    ) : (
                        <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Sign in</MobileLink>
                    )}
                </div>
            )}
        </nav>
    )
}

function NavLink({ to, active, children }) {
    return (
        <Link
            to={to}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
        >
            {children}
        </Link>
    )
}

function MobileLink({ to, onClick, children }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
            {children}
        </Link>
    )
}
