import useCustomerStore from '@/store/customerStore';
import axios from 'axios';
import customerService from './customerService';

const axiosJWT = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    // withCredentials: true
});

axiosJWT.interceptors.request.use(async (config) => {
    const refreshAccessToken = useCustomerStore.getState().refreshAccessToken;
    const setCustomerLogout = useCustomerStore.getState().setCustomerLogout;

    let accessToken = useCustomerStore.getState().customerInfor?.accessToken;
    let accessTokenExpires = useCustomerStore.getState().customerInfor?.accessTokenExpires;

    if (accessTokenExpires < parseInt(Date.now() / 1000)) {
        try {
            const response = await customerService.refreshAccessToken();
            accessToken = response?.data?.access_token;
            accessTokenExpires = response?.data?.access_token_expires;
            refreshAccessToken({ accessToken, accessTokenExpires });
        } catch (error) {
            console.log(error);
            return Promise.reject(setCustomerLogout());
        }
    }

    return {
        ...config,
        headers: { authorization: `bearer ${accessToken}` }
    }
});

export default axiosJWT;
