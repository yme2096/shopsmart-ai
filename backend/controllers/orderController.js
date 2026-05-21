const Order = require("../models/Order")
const User = require("../models/User")
const Product = require("../models/Product")

// PLACE ORDER
const placeOrder = async (req, res) => {
    try {
        const { items, totalPrice, paymentId } = req.body

        if (!items || items.length === 0)
            return res.status(400).json({ message: "No items in order" })

        const order = await Order.create({
            user: req.user._id,
            items,
            totalPrice,
            paymentId: paymentId || ""
        })

        res.status(201).json({ message: "Order placed", order })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

// GET MY ORDERS
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// ADMIN: GET ALL ORDERS
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// ADMIN: UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) return res.status(404).json({ message: "Order not found" })

        order.status = req.body.status
        await order.save()

        res.status(200).json({ message: "Status updated", order })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// ADMIN: ANALYTICS
const getAnalytics = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments()
        const totalOrders = await Order.countDocuments()
        const totalUsers = await User.countDocuments()

        const revenueData = await Order.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 7 }
        ])

        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ])

        res.status(200).json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue: totalRevenue[0]?.total || 0,
            revenueData
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getAnalytics
}
