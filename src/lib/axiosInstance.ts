import axios from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null)=>{
    failedQueue.forEach((prom)=>{
        if(error) prom.reject(error)
        else prom.resolve(token)
    })
    failedQueue = []; 
}

const axiosInstance = axios.create({
    baseURL: process.env.PUBLIC_API_URL || "http://localhost:5001",
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    (response)=> response,
    async (error) =>{
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if(!isRefreshing) {
                return new Promise((resolve, reject)=>{
                    failedQueue.push({resolve, reject})
                })
                .then((token)=>{
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                })
                .catch((err)=>Promise.reject(err));
            }

            isRefreshing = true;
            try {
                const res = await axiosInstance.get("/users/refresh-token")
                
                const newAccessToken = res.data.accessToken;
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return axiosInstance(originalRequest);
            } catch (error) {
                processQueue(error, null);
                return Promise.reject(error);
                
            } finally{
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;