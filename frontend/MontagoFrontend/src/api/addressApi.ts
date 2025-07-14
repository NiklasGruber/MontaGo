import authAxios from "./axios";
import { AddressDto } from "./types";

export const fetchAddresses = async () => {
    try {
        const response = await authAxios.get<AddressDto[]>("/api/Address");
        return response.data;
    } catch (error) {
        console.error("Error loading addresses", error);
    }
};

export const fetchAddresse = async (addressId:number) : Promise<AddressDto> => {
    try {
        const response = await authAxios.get<AddressDto>(`/api/Address/${addressId}`);
        return response.data;
    } catch (error) {
        console.error("Error loading addresses", error);
    }
};

export const putAddress = async (address: AddressDto) => {
    try {
        await authAxios.put(`/api/Address/${address.id}`, address);
    } catch (error) {
        console.error("Error updating address", error);
    }
}

export const postAddress = async (address: AddressDto) => {
    try {
       const response = await authAxios.post("/api/Address", address);
       return response.data; // Return the created address
    } catch (error) {
        console.error("Error creating address", error);
    }
}

export const deleteAddress = async (id: number) => {
    try {
        await authAxios.delete(`/api/Address/${id}`);
    } catch (error) {
        console.error("Error deleting address", error);
    }
}

export default {
    fetchAddresses,
    fetchAddresse,
    putAddress,
    postAddress,
    deleteAddress
};
