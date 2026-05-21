require("dotenv").config()

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const productRoutes = require("./routes/productRoutes")
const authRoutes = require("./routes/authRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const orderRoutes = require("./routes/orderRoutes")

connectDB()

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true)
        else callback(new Error("Not allowed by CORS"))
    },
    credentials: true
}))

app.use(express.json())

app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/orders", orderRoutes)

app.get("/", (req, res) => res.send("ShopSmart AI Backend Running"))

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: err.message || "Server Error" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
