import React, { useState } from 'react';
import { authService } from '../api/authService';
import { useAuth } from '../context/AuthContext';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
    const { login } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Пароль должен быть не менее 8 символов');
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        try {
            await authService.register({
                first_name: firstName,
                login: username,
                phone: phone,
                password: password
            });

            const loginParams = new URLSearchParams();
            loginParams.append('username', username);
            loginParams.append('password', password);

            await login(loginParams);
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Ошибка при регистрации. Проверь данные.';
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-[#2a2a2a] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl text-left">

                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white text-xl">
                    &times;
                </button>

                <h2 className="text-white text-[24px] font-normal mb-2">Регистрация</h2>
                <p className="text-white/60 text-[14px] mb-6">Создай профиль, чтобы забронировать время</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    <input
                        type="text"
                        placeholder="Имя"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl bg-[#1f1f1f] text-white border border-white/5 focus:border-accent/50 focus:outline-none transition-colors text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Придумай логин (только латиница)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl bg-[#1f1f1f] text-white border border-white/5 focus:border-accent/50 focus:outline-none transition-colors text-sm"
                    />
                    <input
                        type="tel"
                        placeholder="Номер телефона (8999...)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl bg-[#1f1f1f] text-white border border-white/5 focus:border-accent/50 focus:outline-none transition-colors text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Пароль (от 8 символов)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl bg-[#1f1f1f] text-white border border-white/5 focus:border-accent/50 focus:outline-none transition-colors text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Подтверди пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl bg-[#1f1f1f] text-white border border-white/5 focus:border-accent/50 focus:outline-none transition-colors text-sm"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-black font-semibold p-3.5 rounded-xl transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 mt-2 text-sm"
                    >
                        {loading ? 'Создание профиля...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p className="text-white/50 text-sm text-center mt-6">
                    Уже зарегистрированы?{' '}
                    <button onClick={onSwitchToLogin} className="text-accent hover:underline bg-transparent border-none p-0 cursor-pointer">
                        Войти
                    </button>
                </p>
            </div>
        </div>
    );
};