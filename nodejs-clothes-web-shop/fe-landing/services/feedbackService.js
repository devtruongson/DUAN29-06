import axiosClient from '@/services/axiosClient';

const feedbackService = {

    getFeedBackList: async (productId) => {
        return await axiosClient.get(`/review/list/${productId}`);
    },

    getFeedBackDetail: async (productID, idUser) => {
        return await axiosClient.get(`/review/detail/${idUser}/${productID}`);
    },

    create: async (data) => {
        return await axiosClient.post('/review/create', data);
    },

    update: async (data) => {
        return await axiosClient.put('/review/update', data);
    },

};

export default feedbackService;
