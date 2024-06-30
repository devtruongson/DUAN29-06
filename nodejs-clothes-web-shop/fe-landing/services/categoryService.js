import axiosClient from "@/services/axiosClient";

const categoryService = {
    getNestList: async () => {
        return await axiosClient.get("/category/list");
    },
};

export default categoryService;
