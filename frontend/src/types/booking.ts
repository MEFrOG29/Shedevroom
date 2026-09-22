export type Placement = 'vr_first' | 'lounge_first' | 'concurrent';

// Соответствует твоей схеме BookingCreate в FastAPI
export interface BookingCreate {
    booking_date: string;       // Строка формата 'YYYY-MM-DD'
    time_slot: string;          // Строка формата 'HH:MM'
    guests_count: number;       // Integer от 1 до 99
    tariff_id: number;          // Integer ID тарифа
    vr_duration?: number;       // Опционально (в минутах)
    lounge_duration?: number;   // Опционально (в минутах)
    placement: Placement;       // Наш Enum размещения
}

// Соответствует возвращаемой схеме Booking из FastAPI
export interface BookingResponse {
    booking_id: number;
    user_id: number;
    tariff_id: number;
    booking_date: string;
    time_slot: string;
    guests_count: number;
    total_price: number;
    vr_duration: number;
    lounge_duration: number;
    total_duration: number;
    status: string;
    is_paid: boolean;
}