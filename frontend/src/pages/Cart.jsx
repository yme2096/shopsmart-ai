import { useContext } from "react"

import axios from "axios"

import { CartContext } from "../context/CartContext"

function Cart() {

  const {
    cart,
    removeFromCart
  } = useContext(CartContext)

  // TOTAL PRICE
  const totalPrice = cart.reduce(

    (total, item) =>

      total + item.price * item.quantity,

    0
  )

  // CHECKOUT
  const checkoutHandler = async () => {

    try {

      // CREATE ORDER
      const res = await axios.post(

        "http://https://shopsmart-ai-yk2h.onrender.com/api/payment",

        {
          amount: totalPrice
        }
      )

      const order = res.data

      // RAZORPAY OPTIONS
      const options = {

        key: "rzp_test_SrJ8DBs0gHmeKw",

        amount: order.amount,

        currency: order.currency,

        name: "ShopSmart AI",

        description: "Product Purchase",

        order_id: order.id,

        handler: function (response) {

          alert("Payment Successful")
        },

        theme: {
          color: "#000"
        }
      }

      // OPEN RAZORPAY
      const razor = new window.Razorpay(
        options
      )

      razor.open()

    } catch (error) {

      console.log(error)
    }
  }

  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-10">
        Cart
      </h1>

      {
        cart.length === 0 ? (

          <h2 className="text-2xl">
            Cart is Empty
          </h2>

        ) : (

          <div className="space-y-5">

            {
              cart.map((item) => (

                <div
                  key={item._id}
                  className="flex justify-between items-center border p-5 rounded"
                >

                  <div>

                    <h2 className="text-2xl font-bold">
                      {item.name}
                    </h2>

                    <p>
                      ₹ {item.price}
                    </p>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>

                </div>
              ))
            }

            {/* TOTAL */}

            <h2 className="text-3xl font-bold mt-10">

              Total: ₹ {totalPrice}

            </h2>

            {/* CHECKOUT BUTTON */}

            <button
              onClick={checkoutHandler}
              className="bg-green-600 text-white px-8 py-3 rounded"
            >
              Checkout
            </button>

          </div>
        )
      }

    </div>
  )
}

export default Cart