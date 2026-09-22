import React, { useState, useEffect } from 'react';
import { modalContainer, modalForm, modalInput, modalOverlay, modalSubmitBtn, modalTab, modalTabRow } from '..//styles/authModalStyles';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'login') {
            alert(`Вход... Email: ${email}`);
        } else {
            alert(`Регистрация... Имя: ${name}, Email: ${email}`);
        }
        onClose();
    };

    return (
        <div className={modalOverlay} onClick={onClose}>

            <div className={modalContainer} onClick={(e) => e.stopPropagation()}>

                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={modalTabRow}>
                    <span
                        className={`${modalTab} ${mode === 'login' ? 'text-[#FFFC4F]' : 'text-white/40 hover:text-white'}`}
                        onClick={() => setMode('login')}
                    >
                        Войти
                        {mode === 'login' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFFC4F]" />}
                    </span>
                    <span
                        className={`${modalTab} ${mode === 'register' ? 'text-[#FFFC4F]' : 'text-white/40 hover:text-white'}`}
                        onClick={() => setMode('register')}
                    >
                        Регистрация
                        {mode === 'register' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFFC4F]" />}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className={modalForm}>

                    {mode === 'register' && (
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={modalInput}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="E-mail"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={modalInput}
                    />

                    <input
                        type="password"
                        placeholder="Пароль"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={modalInput}
                    />

                    <button type="submit" className={modalSubmitBtn}>
                        {mode === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
                    </button>
                </form>
                <p className="text-[13px] text-white/50 mt-6 font-normal">
                    {mode === 'login' ? 'Впервые у нас? ' : 'Уже есть аккаунт? '}
                    <span
                        className="text-[#FFFC4F] underline cursor-pointer hover:text-[#e6e347]"
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    >
                        {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
                    </span>
                </p>

            </div>
        </div>
    );
};