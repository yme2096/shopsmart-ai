import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, SlidersHorizontal, X } from "lucide-react"
import api from "../services/api"
import ProductCard from "../components/ProductCard"
import Pagination from "../components/Pagination"
import Spinner from "../components/Spinner"
import { ProductCardSkeleton } from "../components/ui/Skeleton"
import useDebounce from "../hooks/useDebounce"

const SORT_OPTIONS = [
    { value: "newest",     label: "Newest" },
    { value: "price-low",  label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
]

export default function Home() {
    const [searchParams] = useSearchParams()

    const [products,    setProducts]    = useState([])
    const [categories,  setCategories]  = useState([])
    const [loading,     setLoading]     = useState(true)
    const [search,      setSearch]      = useState(searchParams.get("search") || "")
    const [category,    setCategory]    = useState("")
    const [minPrice,    setMinPrice]    = useState("")
    const [maxPrice,    setMaxPrice]    = useState("")
    const [sort,        setSort]        = useState("newest")
    const [page,        setPage]        = useState(1)
    const [totalPages,  setTotalPages]  = useState(1)
    const [total,       setTotal]       = useState(0)
    const [showFilters, setShowFilters] = useState(false)

    const debouncedSearch = useDebounce(search, 400)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const params = { search: debouncedSearch, category, sort, page, limit: 12 }
            if (minPrice) params.minPrice = minPrice
            if (maxPrice) params.maxPrice = maxPrice
            const { data } = await api.get("/products", { params })
            setProducts(data.products)
            setTotalPages(data.pages)
            setTotal(data.total)
        } catch {
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, category, sort, page, minPrice, maxPrice])

    useEffect(() => {

    setCategories([
        "Mobiles",
        "Laptops",
        "Electronics"
    ])

}, [])

    useEffect(() => { setPage(1) }, [debouncedSearch, category, minPrice, maxPrice, sort])
    useEffect(() => { fetchProducts() }, [fetchProducts])

    const clearFilters = () => {
        setSearch("")
        setCategory("")
        setMinPrice("")
        setMaxPrice("")
        setSort("newest")
        setPage(1)
    }

    const hasFilters = !!(search || category || minPrice || maxPrice || sort !== "newest")

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">

            {/* PAGE HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Products</h1>
                    {!loading && (
                        <p className="text-sm text-gray-500 mt-0.5">
                            {total} product{total !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* SORT */}
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
                    >
                        {SORT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>

                    {/* FILTER TOGGLE — mobile */}
                    <button
                        onClick={() => setShowFilters(v => !v)}
                        className={`lg:hidden flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border transition-colors ${
                            showFilters || hasFilters
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                        }`}
                    >
                        <SlidersHorizontal size={15} />
                        Filters
                    </button>
                </div>
            </div>

            <div className="flex gap-6">

                {/* SIDEBAR */}
                <aside className={`${showFilters ? "block" : "hidden"} lg:block w-52 shrink-0`}>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20 space-y-5">

                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                                >
                                    <X size={12} />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* SEARCH */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                                Search
                            </label>
                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* CATEGORY */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                                Category
                            </label>
                            <div className="space-y-0.5">
                                {["", ...categories].map(c => (
                                    <button
                                        key={c || "all"}
                                        onClick={() => setCategory(c)}
                                        className={`w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                                            category === c
                                                ? "bg-gray-900 text-white font-medium"
                                                : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {c || "All Categories"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* PRICE */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                                Price Range (₹)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={e => setMinPrice(e.target.value)}
                                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(e.target.value)}
                                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* PRODUCT GRID */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                                <Search size={20} className="text-gray-400" />
                            </div>
                            <p className="text-base font-semibold text-gray-900">No products found</p>
                            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.map(p => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
