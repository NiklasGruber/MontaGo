import * as React from "react";
import { useState } from "react";
import authAxios from "../api/axios";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
console.log("Axios baseURL:", authAxios.defaults.baseURL);
      const response = await authAxios.post("/Auth/login", {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed!");
      console.error("Login error", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-semibold text-primary text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-accent transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
