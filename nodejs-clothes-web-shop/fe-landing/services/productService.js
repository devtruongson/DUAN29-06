import axiosClient from '@/services/axiosClient';

const productService = {

    getProductList: async (category) => {
        const url = category
            ? `/product/customer/list?category=${category}`
            : '/product/customer/list';
        return await axiosClient.get(url);
    },

    getDetail: async (productId) => {
        return await axiosClient.get(`/product/customer/detail/${productId}`);
    },

    getColourList: async (productId) => {
        return await axiosClient.get(`/product/customer/list-colour/${productId}`);
    },

    getSizeList: async (productId, colourId) => {
        return await axiosClient.get(`/product/customer/list-size/${productId}/${colourId}`);
    },

    getVariant: async (productId, colourId, sizeId) => {
        return axiosClient.get(`/product-variant/customer/detail/${productId}/${colourId}/${sizeId}`);
    },

};

export default productService;
