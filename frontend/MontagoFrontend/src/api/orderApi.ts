import authAxios from "./axios";
import { CreateOrderDto, OrderDateUpdateDto, OrderDto } from "./types";

const fetchOrders = async (): Promise<OrderDto[]> => {
    try {
        const response = await authAxios.get<OrderDto[]>("/api/Orders");
        // Always return an array, even if response.data is undefined/null
        console.log("Geladene Termine:", response);
        return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        console.error("Fehler beim Laden der Termine", err);
        return []; // Return empty array on error
    }
}

const fetchOrder = async (orderId: number): Promise<OrderDto | null> => {
    try {
        const response = await authAxios.get<OrderDto>(`/api/Orders/${orderId}`);
        return response.data;
    } catch (err) {
        console.error("Fehler beim Laden des Termins", err);
        return null; // Return null on error
    }
}


const putOrder = async (order: OrderDto) => {
    try {
        await authAxios.put(`/api/Orders/${order.id}`, order);
    } catch (err) {
        console.error("Fehler beim Aktualisieren des Termins", err);
    }
}

const updateOrderDate = async (update: OrderDateUpdateDto) => {
    try {
        await authAxios.put(`api/Orders/${update.id}/dates`, update);
    } catch (err) {
        console.error("Fehler beim Aktualisieren des Termins", err);
    }
}

const postOrder = async (order: CreateOrderDto) => {
    try {
        await authAxios.post("/api/Orders", order);
    } catch (err) {
        console.error("Fehler beim Erstellen des Termins", err);
    }
}

const deleteOrder = async (id: number) => {
    try {
        await authAxios.delete(`/api/Orders/${id}`);
    } catch (err) {
        console.error("Fehler beim Löschen des Termins", err);
    }
}

export default {
    fetchOrders,
    fetchOrder,
    updateOrderDate,
    putOrder,
    postOrder,
    deleteOrder
};