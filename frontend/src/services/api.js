import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://shopsmart-ai-yk2h.onrender.com/api"
})

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user") || "null")

    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }

    return config
})

export default api