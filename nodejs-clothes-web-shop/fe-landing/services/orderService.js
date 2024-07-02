import axiosClient from './axiosClient';

const orderService = {

    getOrderHistory: async (idUser) => {
        return await axiosClient.get(`/order/customer/list/${idUser}`);
    },

    getDetail: async (orderId) => {
        return await axiosClient.get(`/order/detail/${orderId}`);
    },

    placeOrder: async (data) => {
        return await axiosClient.post('/order/create', data);
    },

    cancelOrder: async (orderId) => {
        return await axiosClient.put(`/order/change-status/${orderId}/5`);
    },

};

export default orderService;
