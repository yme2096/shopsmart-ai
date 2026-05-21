const express = require("express")

const router = express.Router()

const {
    getProducts,
    getSingleProduct,
    getRelatedProducts,
    getCategories,
    createProduct,
    deleteProduct,
    updateProduct
} = require("../controllers/productController")

// GET ALL PRODUCTS
router.get("/", getProducts)

// GET CATEGORIES
router.get("/categories", getCategories)

// GET RELATED PRODUCTS
router.get("/related/:id", getRelatedProducts)

// GET SINGLE PRODUCT
router.get("/:id", getSingleProduct)

// CREATE PRODUCT
router.post("/", createProduct)

// DELETE PRODUCT
router.delete("/:id", deleteProduct)

// UPDATE PRODUCT
router.put("/:id", updateProduct)

module.exports = router