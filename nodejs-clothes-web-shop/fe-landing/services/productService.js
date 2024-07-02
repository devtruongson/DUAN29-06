import axiosClient from "@/services/axiosClient";

const productService = {
    getProductList: async (category) => {
        const url = category
            ? `/product/listCustomerSide?category=${category}`
            : "/product/listCustomerSide";
        return await axiosClient.get(url);
    },

    getDetail: async (productId) => {
        return await axiosClient.get(`/product/customer/detail/${productId}`);
    },

    getColourList: async (productId) => {
        return await axiosClient.get(
            `/product/customer/list-colour/${productId}`
        );
    },

    getSizeList: async (productId, colourId) => {
        // console.log(productId, colourId);
        return await axiosClient.get(
            `/product/customer/list-size/${productId}/${colourId}`
        );
    },

    //   `/product-variant/customer/detail/${productId}/${colourId}/${sizeId}`
    getVariant: async (productId, colourId, sizeId) => {
        return axiosClient.get(
            `/product-variant/customer/detail/${productId}/${colourId}/${sizeId}`
        );
    },
};

export default productService;
