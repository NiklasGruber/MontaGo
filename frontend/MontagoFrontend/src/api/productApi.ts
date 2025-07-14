import authAxios from "./axios";
import { ProductDto } from "./types";

export const fetchProducts = async () => {
    try {
        const response = await authAxios.get<ProductDto[]>("/api/Product");
        return response.data;
    } catch (error) {
        console.error("Error loading order items", error);  
    }
};

export default {
    fetchProducts
};