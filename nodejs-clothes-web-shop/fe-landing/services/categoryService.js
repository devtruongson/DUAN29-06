import axiosClient from '@/services/axiosClient';

const categoryService = {

    getNestList: async () => {
        return await axiosClient.get('/category/nest-list');
    },

};

export default categoryService;
