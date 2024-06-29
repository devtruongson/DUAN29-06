import axiosClient from './axiosClient';
import axiosJWT from './axiosJWT';

const orderService = {

    getOrderHistory: async () => {
        return await axiosJWT.get('/order/customer/list');
    },

    getDetail: async (orderId) => {
        return await axiosJWT.get(`/order/detail/${orderId}`);
    },

    placeOrder: async (data) => {
        return await axiosJWT.post('/order/create', data);
    },

    cancelOrder: async (orderId) => {
        return await axiosClient.put(`/order/change-status/${orderId}/5`);
    },

};

export default orderService;
