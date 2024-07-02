import axiosClient from './axiosClient';

const orderService = {

    getOrderHistory: async (idUser) => {
        return await axiosClient.get(`/order/customer/list/${idUser}`);
    },

    getDetail: async (orderId, idUser) => {
        return await axiosClient.get(`/order/detail/${idUser}/${orderId}`);
    },

    placeOrder: async (data) => {
        return await axiosClient.post('/order/create', data);
    },

    cancelOrder: async (orderId) => {
        return await axiosClient.put(`/order/changeStatus/${orderId}/Đã hủy`);
    },

};

export default orderService;
