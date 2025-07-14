import authAxios from "./axios";
import { RoleDto } from "./types";

export const fetchRoles = async () => {
    try {
        const response = await authAxios.get<RoleDto[]>("/api/Role");
        return response.data;
    } catch (error) {
        console.error("Error loading roles", error);
    }
};

export const putRole = async (role: RoleDto) => {
    try {
        await authAxios.put(`/api/Role/${role.id}`, role);
    } catch (error) {
        console.error("Error updating role", error);
    }
};

export const postRole = async (role: RoleDto) => {
    try {
        await authAxios.post("/api/Role", role);
    } catch (error) {
        console.error("Error creating role", error);
    }
};

export const deleteRole = async (id: number) => {
    try {
        await authAxios.delete(`/api/Role/${id}`);
    } catch (error) {
        console.error("Error deleting role", error);
    }
};

export default {
    fetchRoles,
    putRole,
    postRole,
    deleteRole
};