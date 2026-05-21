const Product = require("../models/Product")

// GET ALL PRODUCTS (search, filter, sort, paginate)
const getProducts = async (req, res) => {
    try {
        const {
            search = "",
            category = "",
            minPrice,
            maxPrice,
            sort = "newest",
            page = 1,
            limit = 8
        } = req.query

        const query = {}

        if (search) query.name = { $regex: search, $options: "i" }
        if (category) query.category = category
        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) query.price.$gte = Number(minPrice)
            if (maxPrice) query.price.$lte = Number(maxPrice)
        }

        const sortMap = {
            newest: { createdAt: -1 },
            "price-low": { price: 1 },
            "price-high": { price: -1 }
        }

        const skip = (Number(page) - 1) * Number(limit)
        const allProducts = await Product.find()

console.log(allProducts)
        const total = await Product.countDocuments(query)

        const products = await Product.find(query)
            .sort(sortMap[sort] || { createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))

        res.status(200).json({
            products,
            total,
            pages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

// GET SINGLE PRODUCT
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: "Product not found" })
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// GET RELATED PRODUCTS (same category, exclude current)
const getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: "Product not found" })

        const related = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(4)

        res.status(200).json(related)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// GET ALL CATEGORIES
const getCategories = async (req, res) => {

    try {

        const categories =
            await Product.distinct("category")

        res.status(200).json(categories)

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            error: error.message
        })
    }
}

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, stock } = req.body

        if (!name || !description || !price || !image || !category || !stock)
            return res.status(400).json({ message: "All fields are required" })

        const product = await Product.create({ name, description, price, image, category, stock })
        res.status(201).json({ message: "Product Added", product })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: "Product not found" })
        await product.deleteOne()
        res.status(200).json({ message: "Product Deleted" })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: "Product not found" })

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({ message: "Product Updated", updatedProduct })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

module.exports = {
    getProducts,
    getSingleProduct,
    getRelatedProducts,
    getCategories,
    createProduct,
    deleteProduct,
    updateProduct
}
