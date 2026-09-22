import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import {
    bookingWrapper,
    bookingSectionTitle,
    bookingMainContainer,
    stepInnerContainer,
    stepperRow,
    stepActive,
    stepActiveText,
    stepInactive,
    stepInactiveText,
    stepDivider,
    fieldsGroupContainer,
    fieldLabel,
    timelineWrapper,
    rightSummaryContainer,
    summaryTimeBlock,
    timeDisplayBlock,
    nextStepButton,
    nextStepButtonText,
    submitButton,
    submitButtonText
} from '../styles/bookingsStyles';
import { TariffDropdown } from './TariffsDropdown';
import type { TariffFromDB } from './TariffsDropdown';
import { BookingCalendar } from './BookingCalendar';

import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../api/bookingService';

declare module './TariffsDropdown' {
    export interface TariffFromDB {
        vr_minutes?: number;
        lounge_minutes?: number;
    }
}

interface BookingSectionProps {
    activeTariffFromCards?: string;
}

// Хелпер для получения чистой строки даты YYYY-MM-DD локально (без сдвига часовых поясов)
const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const BookingSection: React.FC<BookingSectionProps> = ({
    activeTariffFromCards = 'Тариф “СТАНДАРТ”'
}) => {
    const { isAuthenticated, user } = useAuth();

    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

    const [rawTariffs, setRawTariffs] = useState<TariffFromDB[]>([]);
    const [selectedTariff, setSelectedTariff] = useState<TariffFromDB | null>(null);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [guestsCount, setGuestsCount] = useState<number>(6);

    const [startTimeIndex, setStartTimeIndex] = useState(16);
    const [endTimeIndex, setEndTimeIndex] = useState(20);
    const [activeSlider, setActiveSlider] = useState<'start' | 'end'>('start');

    const [selectedDateStr, setSelectedDateStr] = useState<string>(formatDateToString(new Date()));
    const [isTimeError, setIsTimeError] = useState(false);

    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false);

    const DEFAULT_TIME_SLOTS = useMemo(() => {
        const slots = [];
        let hour = 0; let min = 0;
        for (let i = 0; i < 48; i++) {
            slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
            min += 30; if (min >= 60) { min = 0; hour++; }
        }
        return slots;
    }, []);

    useEffect(() => {
        const loadTariffs = async () => {
            try {
                const data: TariffFromDB[] = await bookingService.getAllTariffs();
                setRawTariffs(data);
            } catch (err) {
                console.error("Не удалось загрузить тарифы из БД", err);
            }
        };
        loadTariffs();
    }, []);

    const filteredTariffs = useMemo(() => {
        return rawTariffs
            .filter(t => t.tariff_id !== 3 && t.tariff_id !== 4)
            .map(t => {
                if (t.tariff_id === 2) {
                    return { ...t, title: 'Аренда лаунжа' };
                }
                return t;
            });
    }, [rawTariffs]);

    useEffect(() => {
        if (filteredTariffs.length > 0) {
            const found = filteredTariffs.find(t => t.title === activeTariffFromCards) || filteredTariffs[0];
            setSelectedTariff(found);
        }
    }, [filteredTariffs, activeTariffFromCards]);

    const { occupiedSlots } = useAvailableSlots(selectedDateStr, selectedTariff?.tariff_id || null);

    const isFlexibleTariff = useMemo(() => {
        return selectedTariff?.is_flexible || false;
    }, [selectedTariff]);

    const currentTime = useMemo(() => {
        return DEFAULT_TIME_SLOTS[startTimeIndex] || '10:00';
    }, [startTimeIndex, DEFAULT_TIME_SLOTS]);

    const currentEndTime = useMemo(() => {
        return DEFAULT_TIME_SLOTS[endTimeIndex] || '12:00';
    }, [endTimeIndex, DEFAULT_TIME_SLOTS]);

    useEffect(() => {
        if (!selectedTariff) return;

        const fetchServerCalculatedPrice = async () => {
            setIsPriceLoading(true);
            try {
                const durationMinutes = (endTimeIndex - startTimeIndex) * 30;

                const response = await bookingService.calculatePrice({
                    booking_date: selectedDateStr, // используем строку
                    time_slot: currentTime,
                    guests_count: guestsCount,
                    tariff_id: selectedTariff.tariff_id,
                    vr_duration: selectedTariff.tariff_id === 1 ? durationMinutes : 0,
                    lounge_duration: selectedTariff.tariff_id === 2 ? durationMinutes : 0,
                    placement: 'concurrent'
                });

                setCurrentPrice(response.total_price || 0);
            } catch (err) {
                console.error("Ошибка симуляции стоимости:", err);
            } finally {
                setIsPriceLoading(false);
            }
        };

        if (endTimeIndex > startTimeIndex) {
            fetchServerCalculatedPrice();
        }
    }, [selectedTariff, selectedDateStr, startTimeIndex, endTimeIndex, guestsCount, currentTime]);

    useEffect(() => {
        if (!selectedTariff) return;

        if (selectedTariff.is_flexible) {
            const targetEndIndex = startTimeIndex + 2;
            setEndTimeIndex(targetEndIndex > 47 ? 47 : targetEndIndex);
        } else {
            const neededSlots = (selectedTariff.default_duration || 0) / 30;
            const targetEndIndex = startTimeIndex + neededSlots;
            setEndTimeIndex(targetEndIndex > 47 ? 47 : targetEndIndex);
        }
    }, [selectedTariff]);

    useEffect(() => {
        if (!selectedTariff || selectedTariff.is_flexible) return;

        const neededSlots = (selectedTariff.default_duration || 0) / 30;
        const targetEndIndex = startTimeIndex + neededSlots;
        setEndTimeIndex(targetEndIndex > 47 ? 47 : targetEndIndex);
    }, [startTimeIndex, selectedTariff]);

    useEffect(() => {
        if (isAuthenticated && user) {
            setName(user.first_name || '');
            if (user.phone) setPhone(user.phone);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (occupiedSlots && occupiedSlots.length > 0) {
            let hasConflict = false;
            for (let i = startTimeIndex; i < endTimeIndex; i++) {
                if (occupiedSlots.includes(i)) {
                    hasConflict = true;
                    break;
                }
            }
            setIsTimeError(hasConflict);
        } else {
            setIsTimeError(false);
        }
    }, [startTimeIndex, endTimeIndex, occupiedSlots]);

    const handlePhoneChange = (text: string) => {
        const input = text.replace(/\D/g, '');
        let formatted = '';
        if (input.length > 0) {
            formatted += '+7 ';
            if (input.length > 1) formatted += '(' + input.substring(1, 4);
            if (input.length > 4) formatted += ') ' + input.substring(4, 7);
            if (input.length > 7) formatted += '-' + input.substring(7, 9);
            if (input.length > 9) formatted += '-' + input.substring(9, 11);
        }
        setPhone(formatted.substring(0, 18));
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!name.trim() || !phone.trim()) {
                alert('Пожалуйста, заполните ваши контакты для связи');
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (isTimeError) {
                alert('Выбранное время уже занято');
                return;
            }
            setCurrentStep(3);
        }
    };

    const handleSubmitBooking = async () => {
        if (!selectedTariff) return;
        if (isTimeError) return;

        const durationMinutes = (endTimeIndex - startTimeIndex) * 30;

        const bookingPayload = {
            booking_date: selectedDateStr, // берем готовую строку
            time_slot: currentTime,
            guests_count: guestsCount,
            tariff_id: selectedTariff.tariff_id,
            vr_duration: selectedTariff.tariff_id === 1 ? durationMinutes : (selectedTariff.vr_minutes || 0),
            lounge_duration: selectedTariff.tariff_id === 2 ? durationMinutes : (selectedTariff.lounge_minutes || 0),
            placement: 'concurrent' as const
        };

        try {
            setIsPriceLoading(true);
            await bookingService.createBooking(bookingPayload);
            alert(`Успех! Заказ оформлен. Ожидайте подтверждения.`);
            setCurrentStep(1);
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.detail || 'Ошибка создания бронирования');
        } finally {
            setIsPriceLoading(false);
        }
    };

    // Преобразуем строку обратно в Date-объект исключительно для пропсов календаря
    const calendarDateValue = useMemo(() => new Date(selectedDateStr), [selectedDateStr]);

    // Красивое форматирование даты для вывода на Шаге 3
    const formattedDisplayDate = useMemo(() => {
        const d = new Date(selectedDateStr);
        return isNaN(d.getTime()) ? selectedDateStr : d.toLocaleDateString('ru-RU');
    }, [selectedDateStr]);

    return (
        <View className={bookingWrapper}>
            <Text className={bookingSectionTitle}>Забронируйте праздник в ШедеVRoom</Text>

            <View className={bookingMainContainer}>
                <View className={stepInnerContainer}>

                    <View className={stepperRow}>
                        <TouchableOpacity onPress={() => setCurrentStep(1)} className={currentStep === 1 ? stepActive : stepInactive}>
                            <Text className={currentStep === 1 ? stepActiveText : stepInactiveText}>{currentStep === 1 ? `Шаг 1` : `1`}</Text>
                        </TouchableOpacity>
                        <View className={stepDivider} />
                        <TouchableOpacity onPress={() => (name && phone ? setCurrentStep(2) : null)} className={currentStep === 2 ? stepActive : stepInactive}>
                            <Text className={currentStep === 2 ? stepActiveText : stepInactiveText}>{currentStep === 2 ? `Шаг 2` : `2`}</Text>
                        </TouchableOpacity>
                        <View className={stepDivider} />
                        <TouchableOpacity onPress={() => (name && phone && !isTimeError ? setCurrentStep(3) : null)} className={currentStep === 3 ? stepActive : stepInactive}>
                            <Text className={currentStep === 3 ? stepActiveText : stepInactiveText}>{currentStep === 3 ? `Шаг 3` : `3`}</Text>
                        </TouchableOpacity>
                    </View>

                    {currentStep === 1 && (
                        <View className={fieldsGroupContainer}>
                            <View>
                                <Text className={fieldLabel}>Выберите тариф</Text>
                                <TariffDropdown
                                    tariffs={filteredTariffs}
                                    selectedTariffTitle={selectedTariff?.title || "Загрузка тарифов..."}
                                    onSelect={(t) => setSelectedTariff(t)}
                                />
                            </View>

                            {isFlexibleTariff && (
                                <View className="w-full">
                                    <Text className={fieldLabel}>Количество гостей</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={String(guestsCount)}
                                        onChangeText={(text) => setGuestsCount(Math.max(1, parseInt(text, 10) || 1))}
                                        className="w-[256px] h-11 rounded-2xl bg-bg_main text-[16px] text-white px-4 mb-6"
                                    />
                                </View>
                            )}

                            <View className="w-full">
                                <Text className={fieldLabel}>Ваши контакты</Text>
                                <TextInput
                                    placeholder="Имя"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={name}
                                    onChangeText={setName}
                                    className="w-[256px] h-11 rounded-2xl bg-bg_main text-[16px] text-white px-4 mb-4 mt-5"
                                />
                                <TextInput
                                    placeholder="Номер телефона"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={handlePhoneChange}
                                    className="w-[256px] h-11 rounded-2xl  bg-bg_main text-[16px] text-white px-4 "
                                />
                            </View>
                        </View>
                    )}

                    {currentStep === 2 && (
                        <View className="w-full items-center">
                            {/* ИСПРАВЛЕНИЕ 3: Перехватываем объект из календаря и сохраняем его чистую строковую версию */}
                            <BookingCalendar
                                value={calendarDateValue}
                                onChange={(newDate) => setSelectedDateStr(formatDateToString(newDate))}
                            />

                            <View className={timelineWrapper}>
                                <View className="w-full flex-row justify-between px-1 mb-2">
                                    <TouchableOpacity
                                        onPress={() => setActiveSlider('start')}
                                        className={`px-3 py-1 rounded-xl ${activeSlider === 'start' ? 'bg-[#FDE000]' : 'bg-[#313131]'}`}
                                    >
                                        <Text className={activeSlider === 'start' ? 'text-black font-medium text-[16px]' : 'text-white/60 text-[16px]'}>
                                            Старт: {currentTime}
                                        </Text>
                                    </TouchableOpacity>

                                    {isFlexibleTariff && (
                                        <TouchableOpacity
                                            onPress={() => setActiveSlider('end')}
                                            className={`px-3 py-1 rounded-xl ${activeSlider === 'end' ? 'bg-[#FDE000]' : 'bg-[#313131]'}`}
                                        >
                                            <Text className={activeSlider === 'end' ? 'text-black font-medium text-[16px]' : 'text-white/60 text-[16px]'}>
                                                Конец: {currentEndTime}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <View className="w-[256px] bg-[#313131] rounded-xl overflow-hidden py-1 justify-center">
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2">
                                        {DEFAULT_TIME_SLOTS.map((slot, index) => {
                                            const isOccupied = occupiedSlots?.includes(index);
                                            const isSelected = index >= startTimeIndex && index < endTimeIndex;

                                            return (
                                                <TouchableOpacity
                                                    key={slot}
                                                    disabled={isOccupied}
                                                    onPress={() => {
                                                        if (activeSlider === 'start') {
                                                            if (isFlexibleTariff && index >= endTimeIndex) {
                                                                setStartTimeIndex(endTimeIndex - 1);
                                                            } else {
                                                                setStartTimeIndex(index);
                                                            }
                                                        } else {
                                                            if (index <= startTimeIndex) {
                                                                setEndTimeIndex(startTimeIndex + 1);
                                                            } else {
                                                                setEndTimeIndex(index);
                                                            }
                                                        }
                                                    }}
                                                    className={`px-2.5 mx-1 h-10 justify-center items-center rounded-lg ${isOccupied ? 'bg-[#515151]' : isSelected ? 'bg-[#FDE000]/20 border border-[#FDE000]' : 'bg-transparent'
                                                        }`}
                                                >
                                                    <Text className={`text-[20px] ${isOccupied ? 'text-white/20 line-through' : isSelected ? 'text-[#FDE000] font-medium' : 'text-white/70'}`}>
                                                        {slot}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    )}

                    {currentStep === 3 && (
                        <View className={rightSummaryContainer}>
                            <View className={summaryTimeBlock}>
                                <Text className="text-[18px] font-normal text-white">Выбранное время</Text>
                                <Text className="text-[13px] font-normal text-white/50 mt-1">
                                    Дата: {formattedDisplayDate}
                                </Text>
                                <View className={timeDisplayBlock}>
                                    <Text className="text-[#FDE000] text-[32px] font-medium">
                                        {currentTime} — {currentEndTime}
                                    </Text>
                                </View>

                                {isTimeError && (
                                    <Text className="text-red-500 text-[12px] mt-2">
                                        Это время уже занято, вернитесь на Шаг 2
                                    </Text>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={() => Linking.openURL('https://vk.com/shedevroom29')}
                                className="mt-2"
                            >
                                <Text className="text-[13px] text-white/70 leading-normal">
                                    Хотите особые условия? <Text className="text-white underline">Напишите нам в ВК</Text> — соберем индивидуальный праздник за 5 минут.
                                </Text>
                            </TouchableOpacity>

                            <View className="w-full mt-auto">
                                <Text className="text-[22px] font-bold text-white mb-1 mt-[160px]">
                                    Итого:{' '}
                                    {isPriceLoading ? (
                                        <Text className="text-white/40 text-[16px]">Расчет...</Text>
                                    ) : (
                                        <Text className="text-[#FDE000]">{currentPrice.toLocaleString()} ₽</Text>
                                    )}
                                </Text>
                                <Text className="text-[12px] text-white/40 mb-4 leading-tight">
                                    Для закрепления записи вносится предоплата 1 000 ₽
                                </Text>
                            </View>
                        </View>
                    )}

                    {currentStep < 3 ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleNextStep}
                            className={nextStepButton}
                        >
                            <Text className={nextStepButtonText}>Следующий шаг →</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={isTimeError || isPriceLoading}
                            onPress={handleSubmitBooking}
                            className={submitButton}
                        >
                            <Text className={submitButtonText}>Внести предоплату</Text>
                        </TouchableOpacity>
                    )}

                </View>
            </View>
        </View>
    );
};