import axiosClient from '@/services/axiosClient';
import axiosJWT from './axiosJWT';

const feedbackService = {

    getFeedBackList: async (productId) => {
        return await axiosClient.get(`/feedback/list/${productId}`);
    },

    getFeedBackDetail: async (productVariantId) => {
        return await axiosJWT.get(`/feedback/detail/${productVariantId}`);
    },

    create: async (data) => {
        return await axiosJWT.post('/feedback/create', data);
    },

    update: async (data) => {
        return await axiosJWT.put('/feedback/update', data);
    },

};

export default feedbackService;
