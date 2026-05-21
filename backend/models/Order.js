const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                name: String,
                image: String,
                price: Number,
                quantity: Number
            }
        ],
        totalPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending"
        },
        paymentId: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)
