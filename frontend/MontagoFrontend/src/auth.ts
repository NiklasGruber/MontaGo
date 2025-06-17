import axios from "axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = async (data: LoginRequest): Promise<string> => {
  const response = await axios.post<LoginResponse>("/api/Auth/login", data);
  return response.data.token;
};
