const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// REGISTER
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body

        // CHECK USER EXISTS
        const existingUser = await User.findOne({ email })

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            })
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10)

        // CREATE USER
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        // RESPONSE
        res.status(201).json({

            message: "User Registered Successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Server Error"
        })
    }
}

// LOGIN
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body

        // FIND USER
        const user = await User.findOne({ email })

        if (!user) {

            return res.status(400).json({
                message: "User not found"
            })
        }

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        // GENERATE JWT TOKEN
        const token = jwt.sign(

            { id: user._id },

            process.env.JWT_SECRET,

            { expiresIn: "7d" }
        )

        // RESPONSE
        res.status(200).json({

            message: "Login Successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Server Error"
        })
    }
}

module.exports = {
    registerUser,
    loginUser
}