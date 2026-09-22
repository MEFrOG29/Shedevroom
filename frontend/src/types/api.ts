// Точное соответствие твоей схеме UserBase / User из FastAPI
export interface User {
    user_id: number;
    first_name: string;
    second_name?: string | null;
    login: string;
    phone: string;
    email?: string | null;
    birthday?: string | null; // даты гоняем строками 'YYYY-MM-DD'
    id_tg?: string | null;
    id_vk?: string | null;
}

// Данные для формы регистрации
export interface UserCreate extends Omit<User, 'user_id'> {
    password: string;
}

// Ответ от эндпоинта /token
export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

// Слот времени из /bookings/available-slots
export interface AvailableSlot {
    time: string; // "14:00"
    is_free: boolean;
}