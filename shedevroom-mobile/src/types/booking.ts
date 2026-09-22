export type Placement = 'vr_first' | 'lounge_first' | 'concurrent';

export interface BookingCreate {
    booking_date: string;
    time_slot: string;
    guests_count: number;
    tariff_id: number;
    vr_duration?: number;
    lounge_duration?: number;
    placement: Placement;
}

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