import axios from 'axios'
import { getToken } from '../utils/auth'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

api.interceptors.request.use((config)=>{
  const t = getToken()
  if(t) config.headers.Authorization = 'Bearer ' + t
  return config
})

export default api
