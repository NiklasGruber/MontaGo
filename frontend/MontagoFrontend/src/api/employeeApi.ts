import authAxios from "./axios";
import { EmployeeDto } from "./types";

export const fetchEmployees = async () => {
    try {
        const response = await authAxios.get<EmployeeDto[]>("/api/Employee");
        return response.data;
    } catch (error) {
        console.error("Error loading employees", error);
    }
};

export const putEmployee = async (employee: EmployeeDto) => {
    try {
        await authAxios.put(`/api/Employee/${employee.id}`, employee);
    } catch (error) {
        console.error("Error updating employee", error);
    }
};

export const postEmployee = async (employee: EmployeeDto) => {
    try {
        await authAxios.post("/api/Employee", employee);
    } catch (error) {
        console.error("Error creating employee", error);
    }
};

export const deleteEmployee = async (id: number) => {
    try {
        await authAxios.delete(`/api/Employee/${id}`);
    } catch (error) {
        console.error("Error deleting employee", error);
    }
};

export default {
    fetchEmployees,
    putEmployee,
    postEmployee,
    deleteEmployee
};
