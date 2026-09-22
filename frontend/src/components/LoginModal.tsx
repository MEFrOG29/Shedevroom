import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const loginParams = new URLSearchParams();
        loginParams.append('username', username);
        loginParams.append('password', password);

        try {
            await login(loginParams);
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Неверный логин или пароль';
            setError(errorMessage);
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

                <h2 className="text-white text-[24px] font-normal mb-2">Вход в систему</h2>
                <p className="text-white/60 text-[14px] mb-6">Авторизуйтесь, чтобы забронировать арену</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Твой логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-3.5 rounded-xl bg-[#1f1f1f] text-white border border-white/5 focus:border-accent/50 focus:outline-none transition-colors text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3.5 rounded-xl bg-[#1f1f1f] text-white border border-white/5 focus:border-accent/50 focus:outline-none transition-colors text-sm"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-black font-semibold p-3.5 rounded-xl transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 mt-2 text-sm"
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <p className="text-white/50 text-sm text-center mt-6">
                    Ещё нет аккаунта?{' '}
                    <button onClick={onSwitchToRegister} className="text-accent hover:underline bg-transparent border-none p-0 cursor-pointer">
                        Зарегистрироваться
                    </button>
                </p>
            </div>
        </div>
    );
};