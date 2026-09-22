import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAvailableSlots = (selectedDate: Date, tariffId: number | null) => {
    const [occupiedSlots, setOccupiedSlots] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!tariffId) {
            setOccupiedSlots([]);
            return;
        }

        const fetchOccupiedSlots = async () => {
            setIsLoading(true);
            try {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;

                const response = await axios.get(`http://localhost:8000/bookings/occupied-slots`, {
                    params: {
                        booking_date: formattedDate,
                        tariff_id: tariffId
                    }
                });

                setOccupiedSlots(response.data);
            } catch (error) {
                console.error("Ошибка при получении занятых слотов:", error);
                setOccupiedSlots([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOccupiedSlots();
    }, [selectedDate, tariffId]);

    return { occupiedSlots, isSlotsLoading: isLoading };
};