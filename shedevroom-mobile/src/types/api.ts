export interface User {
    user_id: number;
    first_name: string;
    second_name?: string | null;
    login: string;
    phone: string;
    email?: string | null;
    birthday?: string | null;
    id_tg?: string | null;
    id_vk?: string | null;
}

export interface UserCreate extends Omit<User, 'user_id'> {
    password: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface AvailableSlot {
    time: string; // "14:00"
    is_free: boolean;
}