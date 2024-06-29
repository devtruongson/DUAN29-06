import axiosClient from '@/services/axiosClient';

const customerService = {

    register: async (data) => {
        return await axiosClient.post('/customer/register', {
            name: data.customer_name,
            email: data.email,
            password: data.password,
            phoneNumber: data.phone_number,
            address: data.address
        });
    },

    login: async (data) => {
        return await axiosClient.post('/customer/login', data);
    },

    logout: async () => {
        return await axiosClient.post('/customer/logout');
    },

    refreshAccessToken: async () => {
        return await axiosClient.post('/customer/refresh');
    },

    getInfor: async () => {
        return await axiosClient.get('/customer/infor');
    },

    update: async (data) => {
        return await axiosClient.put('/customer/update', data);
    },

};

export default customerService;
