import { Navigate } from "react-router-dom"

import { useContext } from "react"

import { AuthContext } from "../context/AuthContext"

function AdminRoute({ children }) {

  const { user } = useContext(AuthContext)

  // LOADING FIX
  if (user === undefined) {
    return <h1>Loading...</h1>
  }

  // NOT LOGGED IN
  if (!user) {
    return <Navigate to="/login" />
  }

  // NOT ADMIN
  if (user.isAdmin !== true) {
    return <Navigate to="/" />
  }

  // ADMIN ACCESS
  return children
}

export default AdminRoute