import API from "../../utils/API";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface User {
  name: string;
  email: string;
  gender: string;
  imageUrl: string;
}

interface AuthResponse {
  success?: boolean;
  token?: string;
  message: string;
  user?: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  gender: string;
  imageUrl: string;
}

// User Login with email and password
export const userLogin = createAsyncThunk(
  "user/login",
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      const { data } = await API.post<AuthResponse>(
        "/users/login",
        { email, password },
        config
      );
      if (data && data.success) {
        localStorage.setItem("token", data.token || "");
        toast.success(data.message);
        return data;
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get user details
export const getUser = createAsyncThunk(
  "user/details",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await API.get<AuthResponse>("/users/details", config);
      if (data && data.success) {
        return data;
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// User Signup
export const userSignup = createAsyncThunk(
  "user/signup",
  async ({ name, email, password, gender, imageUrl }: SignupData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      const { data } = await API.post<AuthResponse>(
        "/users/signup",
        { name, email, password, gender, imageUrl },
        config
      );
      if (data && data.success) {
        localStorage.setItem("token", data.token || "");
        toast.success(data.message);
        return data;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.post<AuthResponse>("/user/logout");
      localStorage.clear();
      toast.success(data.message);
      return data;
    } catch (error: any) {
      localStorage.clear();
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
