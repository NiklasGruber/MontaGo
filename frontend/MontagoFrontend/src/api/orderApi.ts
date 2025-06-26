import authAxios from "./axios";
import { OrderDto } from "./types";

const fetchOrders = async () => {
    try {
        const response = await authAxios.get("/api/Orders");
        return response.data;
    } catch (err) {
        console.error("Fehler beim Laden der Termine", err);
    }
}

const putOrder = async (order: OrderDto) => {
    try {
        await authAxios.put(`/api/Orders/${order.id}`, order);
    } catch (err) {
        console.error("Fehler beim Aktualisieren des Termins", err);
    }
}

export default {
    fetchOrders,
    putOrder
};