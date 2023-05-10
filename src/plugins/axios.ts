import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8081';



// Request Interceptor for Beater Token Auth
axios.interceptors.request.use(
  (config)=> {
    const { user } = useAuthStore();
    if (user && user?.token && !config.headers?.Authorization) {
      config
        .headers
        .setAuthorization(`Bearer ${user.token}`);
    }
    return config;
  })

axios.interceptors.response.use(null, (error: AxiosError)=>{
  const { logOut } = useAuthStore();
  if (error.response?.status === 401) {
    logOut();
    router.push({ name: 'Login' });
    console.error('Error: Token Expired / Missing')
  } else {
    console.error(error)
  }

});

export default axios;