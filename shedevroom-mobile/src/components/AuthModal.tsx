import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import {
    modalContainer,
    modalForm,
    modalInput,
    modalOverlay,
    modalSubmitBtn,
    modalTab,
    modalTabRow
} from '../styles/authModalStyles';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login: contextLogin } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const [firstName, setFirstName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setFirstName('');
        setUsername('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
    };

    const handleSubmit = async () => {
        setError(null);

        if (!username.trim() || !password.trim()) {
            setError('Заполните логин и пароль');
            return;
        }

        setLoading(true);

        try {
            if (mode === 'login') {
                const loginParams = new URLSearchParams();
                loginParams.append('username', username.trim());
                loginParams.append('password', password);

                await contextLogin(loginParams);
                resetForm();
                onClose();
            } else {
                if (!firstName.trim() || !phone.trim()) {
                    setError('Заполните все обязательные поля');
                    setLoading(false);
                    return;
                }
                if (password.length < 8) {
                    setError('Пароль должен быть от 8 символов');
                    setLoading(false);
                    return;
                }
                if (password !== confirmPassword) {
                    setError('Пароли не совпадают');
                    setLoading(false);
                    return;
                }

                await authService.register({
                    first_name: firstName.trim(),
                    login: username.trim(),
                    phone: phone.trim(),
                    password: password
                });

                const loginParams = new URLSearchParams();
                loginParams.append('username', username.trim());
                loginParams.append('password', password);

                await contextLogin(loginParams);
                resetForm();
                onClose();
            }
        } catch (err: any) {
            console.error(err);
            const backendError = err.response?.data?.detail || 'Ошибка авторизации. Проверьте данные.';
            setError(typeof backendError === 'string' ? backendError : JSON.stringify(backendError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className={modalOverlay}>
                <View className={modalContainer}>

                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute right-5 top-5 z-10 p-1"
                    >
                        <Text className="text-white/40 text-[20px] font-light">✕</Text>
                    </TouchableOpacity>

                    <View className={modalTabRow}>
                        <TouchableOpacity
                            onPress={() => { setMode('login'); setError(null); }}
                            className={`${modalTab}`}
                        >
                            <Text className={`text-[16px] font-medium ${mode === 'login' ? 'text-accent' : 'text-white/40'}`}>
                                Войти
                            </Text>
                            {mode === 'login' && <View className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-accent" />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { setMode('register'); setError(null); }}
                            className={`${modalTab}`}
                        >
                            <Text className={`text-[16px] font-medium ${mode === 'register' ? 'text-accent' : 'text-white/40'}`}>
                                Регистрация
                            </Text>
                            {mode === 'register' && <View className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-accent" />}
                        </TouchableOpacity>
                    </View>

                    {error && (
                        <View className="w-full bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-3">
                            <Text className="text-red-400 text-[13px] text-center">{error}</Text>
                        </View>
                    )}

                    <View className={modalForm}>
                        {mode === 'register' && (
                            <TextInput
                                placeholder="Ваше имя"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={firstName}
                                onChangeText={setFirstName}
                                className={modalInput}
                            />
                        )}

                        <TextInput
                            placeholder="Логин (латиница)"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                            className={modalInput}
                        />

                        {mode === 'register' && (
                            <TextInput
                                placeholder="Номер телефона"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                                className={modalInput}
                            />
                        )}

                        <TextInput
                            placeholder="Пароль"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            value={password}
                            onChangeText={setPassword}
                            className={modalInput}
                        />

                        {mode === 'register' && (
                            <TextInput
                                placeholder="Подтвердите пароль"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                secureTextEntry={true}
                                autoCapitalize="none"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                className={modalInput}
                            />
                        )}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={loading}
                            onPress={handleSubmit}
                            className={modalSubmitBtn}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000000" size="small" />
                            ) : (
                                <Text className="text-black text-[16px] font-semibold">
                                    {mode === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className="mt-5 p-1"
                    >
                        <Text className="text-[13px] text-white/50 text-center">
                            {mode === 'login' ? 'Впервые у нас? ' : 'Уже есть аккаунт? '}
                            <Text className="text-accent underline">
                                {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
                            </Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};