import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../services/apiService";

const tokenFromStorage = () => {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(name, email, password, confirmPassword);
      return response.data;
    } catch (err) {
      const apiMessage = err?.response?.data?.error || err?.response?.data?.message;
      return rejectWithValue(apiMessage || "Registration failed.");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      return response.data;
    } catch (err) {
      const apiMessage = err?.response?.data?.error || err?.response?.data?.message;
      return rejectWithValue(apiMessage || "Login failed.");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authAPI.logout();
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: tokenFromStorage(),
    user: null,
    status: "idle",
    error: "",
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload?.token || null;
        state.user = action.payload?.user || null;
        state.error = "";
        if (state.token) localStorage.setItem("authToken", state.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed.";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload?.token || null;
        state.user = action.payload?.user || null;
        state.error = "";
        if (state.token) localStorage.setItem("authToken", state.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed.";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.token = null;
        state.user = null;
        state.error = "";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
