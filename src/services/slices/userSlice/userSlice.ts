import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { RootState } from '../../store';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi
} from '@api';
import { setCookie, getCookie, deleteCookie } from '../../../utils/cookie';

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = {
  name: string;
  email: string;
  password: string;
};

type TUserState = {
  user: TUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
};

const initialState: TUserState = {
  user: null,
  accessToken: getCookie('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isLoading: false
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res;
    } catch (err: unknown) {
      return rejectWithValue('Не удалось зарегистрироваться');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res;
    } catch (err: unknown) {
      return rejectWithValue('Не удалось совершить вход');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (err: unknown) {
      return rejectWithValue('Не удалось получить пользователя');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(data);
      return res.user;
    } catch (err: unknown) {
      return rejectWithValue('Не удалось обновить данные пользователя');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (err: unknown) {
      return rejectWithValue('Не удалось совершить выход');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      return await forgotPasswordApi(data);
    } catch (err: unknown) {
      return rejectWithValue('Не удалось восстановить пароль');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      return await resetPasswordApi(data);
    } catch (err: unknown) {
      return rejectWithValue('Не удалось сбросить пароль');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(registerUser.fulfilled, (state, { payload }) => ({
        ...state,
        isLoading: false,
        user: payload.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken
      }))
      .addCase(registerUser.rejected, (state) => ({
        ...state,
        isLoading: false
      }))
      .addCase(loginUser.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(loginUser.fulfilled, (state, { payload }) => ({
        ...state,
        isLoading: false,
        user: payload.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken
      }))
      .addCase(logoutUser.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(logoutUser.fulfilled, (state) => ({
        ...state,
        isLoading: false,
        user: null
      }))
      .addCase(logoutUser.rejected, (state) => ({
        ...state,
        isLoading: false
      }))
      .addCase(loginUser.rejected, (state) => ({
        ...state,
        isLoading: false
      }))
      .addCase(fetchUser.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(fetchUser.fulfilled, (state, { payload }) => ({
        ...state,
        isLoading: false,
        user: payload
      }))
      .addCase(fetchUser.rejected, (state) => ({
        ...state,
        isLoading: false,
        user: null
      }))
      .addCase(updateUser.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(updateUser.fulfilled, (state) => ({
        ...state,
        isLoading: false
      }))
      .addCase(updateUser.rejected, (state) => ({
        ...state,
        isLoading: false
      }))
      .addCase(resetPassword.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(resetPassword.fulfilled, (state) => ({
        ...state,
        isLoading: false
      }))
      .addCase(resetPassword.rejected, (state) => ({
        ...state,
        isLoading: false
      }))
      .addCase(forgotPassword.pending, (state) => ({
        ...state,
        isLoading: true
      }))
      .addCase(forgotPassword.fulfilled, (state) => ({
        ...state,
        isLoading: false
      }))
      .addCase(forgotPassword.rejected, (state) => ({
        ...state,
        isLoading: false
      }));
  }
});

export const selectUser = (state: RootState) => state.user.user;
export const selectAccessToken = (state: RootState) => state.user.accessToken;

export default userSlice.reducer;
