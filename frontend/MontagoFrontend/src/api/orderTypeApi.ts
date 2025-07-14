import authAxios from "./axios";
import { OrderTypeDto } from "./types";

export const fetchOrderTypes = async () => {
    try {
        const response = await authAxios.get<OrderTypeDto[]>("/api/OrderType");
        return response.data;
    } catch (error) {
        console.error("Error loading order types", error);
    }
};

export const putOrderType = async (orderType: OrderTypeDto) => {
    try {
        await authAxios.put(`/api/OrderType/${orderType.id}`, orderType);
    } catch (error) {
        console.error("Error updating order type", error);
    }
};

export const postOrderType = async (orderType: OrderTypeDto) => {
    try {
        await authAxios.post("/api/OrderType", orderType);
    } catch (error) {
        console.error("Error creating order type", error);
    }
};

export const deleteOrderType = async (id: number) => {
    try {
        await authAxios.delete(`/api/OrderType/${id}`);
    } catch (error) {
        console.error("Error deleting order type", error);
    }
};

export default {
    fetchOrderTypes,
    putOrderType,
    postOrderType,
    deleteOrderType
};