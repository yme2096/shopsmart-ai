const express = require("express")

const router = express.Router()

const upload = require("../middleware/upload")

// IMAGE UPLOAD ROUTE
router.post(
    "/",
    upload.single("image"),
    (req, res) => {

        try {

            res.status(200).json({

                imageUrl: req.file.path
            })

        } catch (error) {

            console.log(error)

            res.status(500).json({
                message: "Upload Failed"
            })
        }
    }
)

module.exports = router