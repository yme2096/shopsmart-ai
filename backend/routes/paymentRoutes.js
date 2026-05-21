const express = require("express")

const Razorpay = require("razorpay")

const router = express.Router()

const razorpay = new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,

    key_secret: process.env.RAZORPAY_SECRET
})

// CREATE ORDER
router.post("/", async (req, res) => {

    try {

        const options = {

            amount: Number(req.body.amount * 100),

            currency: "INR"
        }

        const order = await razorpay.orders.create(
            options
        )

        res.status(200).json(order)

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Payment Failed"
        })
    }
})

module.exports = router