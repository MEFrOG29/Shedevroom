import { axiosInstance } from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, UserCreate, TokenResponse } from '../types/api';

export const authService = {
    register: async (userData: UserCreate): Promise<User> => {
        const response = await axiosInstance.post<User>('/users/register', userData);
        return response.data;
    },

    login: async (loginData: FormData | URLSearchParams): Promise<TokenResponse> => {
        const response = await axiosInstance.post<TokenResponse>('/token', loginData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        await AsyncStorage.setItem('access_token', response.data.access_token);
        await AsyncStorage.setItem('refresh_token', response.data.refresh_token);

        return response.data;
    },

    getMe: async (): Promise<User> => {
        const response = await axiosInstance.get<User>('/users/me');
        return response.data;
    },

    logout: async (): Promise<void> => {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
    }
};