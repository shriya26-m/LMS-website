// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from "react";
import type { User, LoginCredentials, SignupData, AuthResponse } from "../types/index";
import axios from "axios";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:5000/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load user from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    try {
      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
      setToken(null);
    }

    setLoading(false);
  }, []);

  // 🔹 LOGIN
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/login`,
        credentials
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      toast.success("Login successful!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
          "Login failed. Please check your credentials."
        );
      } else {
        toast.error("Login failed.");
      }
      throw error;
    }
  };

  // 🔹 SIGNUP
  const signup = async (data: SignupData) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/signup`,
        data
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      toast.success("Signup successful!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
          "Signup failed. Please try again."
        );
      } else {
        toast.error("Signup failed.");
      }
      throw error;
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    localStorage.clear();

    setUser(null);
    setToken(null);

    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};