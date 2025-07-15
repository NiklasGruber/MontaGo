import authAxios from "./axios";
import { CustomerDto } from "./types";

export const fetchCustomers = async () => {
    try {
        const response = await authAxios.get<CustomerDto[]>("/api/Customer");
        return response.data;
    } catch (error) {
        console.error("Error loading customers", error);
    }
};

export const putCustomer = async (customer: CustomerDto) => {
    try {
        await authAxios.put(`/api/Customer/${customer.id}`, customer);
    } catch (error) {
        console.error("Fehler beim Speichern des Kunden", error);
    }
};

export const postCustomer = async (customer: CustomerDto) => {
    try {
        await authAxios.post("/api/Customer", customer);
    } catch (error) {
        console.error("Error creating customer", error);
    }
};

export const deleteCustomer = async (id: number) => {
    try {
        await authAxios.delete(`/api/Customer/${id}`);
    } catch (error) {
        console.error("Error deleting customer", error);
    }
};

export default {
    fetchCustomers,
    putCustomer,
    postCustomer,
    deleteCustomer
};