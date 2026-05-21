import {
  createContext,
  useEffect,
  useState
} from "react"

export const CartContext = createContext()

function CartProvider({ children }) {

  // LOAD CART FROM LOCAL STORAGE
  const [cart, setCart] = useState(() => {

    const savedCart = localStorage.getItem("cart")

    return savedCart
      ? JSON.parse(savedCart)
      : []
  })

  // SAVE CART TO LOCAL STORAGE
  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    )

  }, [cart])

  // ADD TO CART
  const addToCart = (product) => {

    const existingItem = cart.find(
      (item) => item._id === product._id
    )

    if (existingItem) {

      const updatedCart = cart.map((item) =>

        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )

      setCart(updatedCart)

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ])
    }
  }

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id))
  }

  // CLEAR CART
  const clearCart = () => setCart([])

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >

      {children}

    </CartContext.Provider>
  )
}

export default CartProvider