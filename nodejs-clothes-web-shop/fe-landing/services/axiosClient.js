import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    withCredentials: true,
});

axiosClient.interceptors.response.use(
    response => {
        // Nếu phản hồi thành công, trả về dữ liệu
        return response;
    },
    error => {
        // Xử lý lỗi từ phản hồi
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.reload();
        }
        // Nếu không phải lỗi 401, trả về lỗi để được xử lý bởi phần code gọi API
        return Promise.reject(error);
    }
);


export default axiosClient;
