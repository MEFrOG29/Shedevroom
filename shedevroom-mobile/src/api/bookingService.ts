import { axiosInstance } from './axiosInstance';
import type { AvailableSlot } from '../types/api';
import type { BookingCreate, BookingResponse } from '../types/booking';
import type { TariffFromDB } from '../components/TariffsDropdown';

interface PriceCalculationResponse {
    total_price: number;
}

export const bookingService = {
    getAvailableSlots: async (dateStr: string): Promise<AvailableSlot[]> => {
        const response = await axiosInstance.get<AvailableSlot[]>('/bookings/available-slots', {
            params: {
                booking_date: dateStr
            }
        });
        return response.data;
    },

    createBooking: async (bookingData: BookingCreate): Promise<BookingResponse> => {
        const response = await axiosInstance.post<BookingResponse>('/bookings/create', bookingData);
        return response.data;
    },

    getAllTariffs: async (): Promise<TariffFromDB[]> => {
        const response = await axiosInstance.get<TariffFromDB[]>('/tariffs/all');
        return response.data;
    },

    calculatePrice: async (bookingData: BookingCreate): Promise<PriceCalculationResponse> => {
        const response = await axiosInstance.post<PriceCalculationResponse>('/bookings/calculate-price', bookingData);
        return response.data;
    }
};