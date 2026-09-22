import React, { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
    bookingMainContainer,
    bookingSectionTitle,
    bookingWrapper,
    fieldLabel,
    leftFieldsContainer,
    centerCalendarColumn,
    rangeSlider,
    rightSummaryContainer,
    summaryTimeBlock,
    timelineBarContainer,
    timelineTrackBg,
    timelineWrapper
} from '../styles/bookingStyles';
import { TariffDropdown } from './TariffDropdown';
import type { TariffFromDB } from './TariffDropdown';
import { BookingCalendar } from './BookingCalendar';

import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../api/bookingService';

declare module './TariffDropdown' {
    export interface TariffFromDB {
        vr_minutes?: number;
        lounge_minutes?: number;
    }
}

interface BookingSectionProps {
    activeTariffFromCards?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
    activeTariffFromCards = 'Тариф “СТАНДАРТ”'
}) => {
    const { isAuthenticated, user } = useAuth();

    const [rawTariffs, setRawTariffs] = useState<TariffFromDB[]>([]);
    const [selectedTariff, setSelectedTariff] = useState<TariffFromDB | null>(null);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [guestsCount, setGuestsCount] = useState<number>(6);

    const [startTimeIndex, setStartTimeIndex] = useState(16);
    const [endTimeIndex, setEndTimeIndex] = useState(20);
    const [activeSlider, setActiveSlider] = useState<'start' | 'end'>('start');

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

    const { occupiedSlots } = useAvailableSlots(selectedDate, selectedTariff?.tariff_id || null);

    const occupiedGroups = useMemo(() => {
        if (!occupiedSlots || occupiedSlots.length === 0) return [];

        const sortedSlots = [...occupiedSlots].sort((a, b) => a - b);
        const groups: { start: number; end: number }[] = [];

        let currentGroup = { start: sortedSlots[0], end: sortedSlots[0] };

        for (let i = 1; i < sortedSlots.length; i++) {
            if (sortedSlots[i] === currentGroup.end + 1) {
                currentGroup.end = sortedSlots[i];
            } else {
                groups.push(currentGroup);
                currentGroup = { start: sortedSlots[i], end: sortedSlots[i] };
            }
        }
        groups.push(currentGroup);
        return groups;
    }, [occupiedSlots]);

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
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;

                const durationMinutes = (endTimeIndex - startTimeIndex) * 30;

                const response = await bookingService.calculatePrice({
                    booking_date: dateStr,
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
    }, [selectedTariff, selectedDate, startTimeIndex, endTimeIndex, guestsCount, currentTime]);

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

    const trackStyle = useMemo(() => {
        if (!isFlexibleTariff) {
            return { left: '0%', width: '0%' };
        }
        const left = (startTimeIndex / 47) * 100;
        const right = (endTimeIndex / 47) * 100;
        return { left: `${left}%`, width: `${right - left}%` };
    }, [startTimeIndex, endTimeIndex, isFlexibleTariff]);

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10) || 0;
        setActiveSlider('start');

        if (isFlexibleTariff) {
            if (value >= endTimeIndex) {
                setStartTimeIndex(endTimeIndex - 1);
            } else {
                setStartTimeIndex(value);
            }
        } else {
            setStartTimeIndex(value);
        }
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10) || 0;
        setActiveSlider('end');
        if (value <= startTimeIndex) {
            setEndTimeIndex(startTimeIndex + 1);
        } else {
            setEndTimeIndex(value);
        }
    };

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

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, '');
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

    const handleSubmitBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTariff) return;

        if (!isAuthenticated || !user) {
            toast.error('Доступно только для зарегистрированных пользователей', {
                style: { background: '#313131', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
            return;
        }

        if (!name.trim() || !phone.trim()) {
            toast.error('Заполните имя и номер телефона', {
                style: { background: '#313131', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
            return;
        }

        if (isTimeError) {
            toast.error('Выбранный интервал времени уже занят', {
                style: { background: '#313131', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
            return;
        }

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const durationMinutes = (endTimeIndex - startTimeIndex) * 30;

        const bookingPayload = {
            booking_date: dateStr,
            time_slot: currentTime,
            guests_count: guestsCount,
            tariff_id: selectedTariff.tariff_id,
            vr_duration: selectedTariff.tariff_id === 1 ? durationMinutes : (selectedTariff.vr_minutes || 0),
            lounge_duration: selectedTariff.tariff_id === 2 ? durationMinutes : (selectedTariff.lounge_minutes || 0),
            placement: 'concurrent' as const
        };

        try {
            setIsPriceLoading(true);
            const result = await bookingService.createBooking(bookingPayload);

            toast.success(`Заказ #${result.booking_id} оформлен! Ожидайте подтверждения.`, {
                duration: 6000,
                style: {
                    background: '#2E2E2E',
                    color: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid rgba(253, 224, 0, 1)',
                    padding: '16px',
                    fontSize: '15px'
                },
                iconTheme: {
                    primary: '#FDE000',
                    secondary: '#2E2E2E',
                },
            });

            setTimeout(() => {
                window.location.reload();
            }, 2500);

        } catch (err: any) {
            console.error(err);
            const backendError = err.response?.data?.detail || 'Ошибка создания бронирования';

            toast.error(backendError, {
                duration: 5000,
                style: {
                    background: '#2E2E2E',
                    color: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 0, 0, 1)',
                    padding: '16px',
                    fontSize: '15px'
                },
                iconTheme: {
                    primary: '#EF4444',
                    secondary: '#2E2E2E',
                },
            });
        } finally {
            setIsPriceLoading(false);
        }
    };

    return (
        <div className={bookingWrapper} id="booking">
            <style dangerouslySetInnerHTML={{
                __html: `
    .range-slider-input { pointer-events: none !important; }
    .range-slider-input::-webkit-slider-thumb { pointer-events: auto !important; }
    .range-slider-input::-moz-range-thumb { pointer-events: auto !important; }
`}} />

            <h2 className={bookingSectionTitle}>Забронируйте праздник в ШедеVRoom</h2>

            <form onSubmit={handleSubmitBooking} className={bookingMainContainer}>
                <div className={leftFieldsContainer}>
                    <div>
                        <label className={fieldLabel}>Выберите тариф</label>
                        <TariffDropdown
                            tariffs={filteredTariffs}
                            selectedTariffTitle={selectedTariff?.title || "Загрузка тарифов..."}
                            onSelect={(t) => setSelectedTariff(t)}
                        />
                    </div>

                    {isFlexibleTariff && (
                        <div className="flex flex-col mt-4">
                            <label className={fieldLabel}>Количество гостей</label>
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={guestsCount}
                                onChange={(e) => setGuestsCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                className="w-full max-w-62.25 h-11 rounded-2xl bg-[#313131] text-[16px] font-normal text-white px-4 focus:outline-none border border-transparent focus:border-white/20"
                            />
                        </div>
                    )}

                    <div className="flex flex-col">
                        <label className={fieldLabel}>Ваши контакты</label>
                        <input
                            type="text"
                            placeholder="Имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full max-w-62.25 h-11 rounded-2xl bg-[#313131] text-[16px] font-normal text-white placeholder-white/50 px-4 focus:outline-none border border-transparent focus:border-white/20"
                        />
                        <input
                            type="text"
                            placeholder="Номер телефона"
                            value={phone}
                            onChange={handlePhoneChange}
                            required
                            className="w-full max-w-62.25 h-11 rounded-2xl bg-[#313131] text-[16px] font-normal text-white placeholder-white/50 px-4 mt-4 focus:outline-none border border-transparent focus:border-white/20"
                        />
                    </div>
                </div>

                <div className={centerCalendarColumn}>
                    <BookingCalendar value={selectedDate} onChange={setSelectedDate} />

                    <div className={timelineWrapper}>
                        <div className="w-full flex justify-between text-[14px] font-normal text-white px-2">
                            <span>{DEFAULT_TIME_SLOTS[0]}</span>
                            <span className="text-accent font-medium">
                                {currentTime} — {currentEndTime}
                            </span>
                            <span>{DEFAULT_TIME_SLOTS[DEFAULT_TIME_SLOTS.length - 1]}</span>
                        </div>

                        <div className={`${timelineBarContainer} relative flex items-center h-[18.54px] mt-4 overflow-hidden rounded-2xl`}>
                            <div className={timelineTrackBg} style={{ width: '100%', position: 'absolute' }} />
                            <div className="absolute h-full bg-accent/30 rounded pointer-events-none" style={trackStyle} />

                            {occupiedGroups.map((group, idx) => {
                                const leftPercent = (group.start / 47) * 100;
                                const groupSlotsCount = (group.end - group.start) + 1;
                                const widthPercent = (groupSlotsCount / 47) * 100;

                                const isAtAbsoluteLeftEdge = group.start === 0;
                                const isAtAbsoluteRightEdge = group.end === 47;

                                return (
                                    <div
                                        key={idx}
                                        className="absolute h-full pointer-events-none box-border flex items-center justify-center"
                                        style={{
                                            left: `${leftPercent}%`,
                                            width: `${widthPercent}%`,
                                            zIndex: 20,
                                            backgroundColor: '#515151',
                                            borderRadius: `${isAtAbsoluteLeftEdge ? '16px' : '0px'} ${isAtAbsoluteRightEdge ? '16px' : '0px'} ${isAtAbsoluteRightEdge ? '16px' : '0px'} ${isAtAbsoluteLeftEdge ? '16px' : '0px'}`
                                        }}
                                        title="Это время уже занято"
                                    >
                                        <span className="text-[12px] text-white/80 select-none">Занято</span>

                                        {!isAtAbsoluteLeftEdge && (
                                            <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none">
                                                <div className="absolute left-0 top-[5.15px] w-px h-[8.24px] bg-white" />
                                                <div className="absolute left-0 bottom-[5.15px] w-px h-[8.24px] bg-white" />
                                            </div>
                                        )}

                                        {!isAtAbsoluteRightEdge && (
                                            <div className="absolute right-0 top-0 bottom-0 w-px pointer-events-none">
                                                <div className="absolute right-0 top-[5.15px] w-px h-[8.24px] bg-white" />
                                                <div className="absolute right-0 bottom-[5.15px] w-px h-[8.24px] bg-white" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            <input
                                type="range"
                                min="0"
                                max={47}
                                value={startTimeIndex}
                                onChange={handleStartTimeChange}
                                onMouseDown={() => setActiveSlider('start')}
                                className={`${rangeSlider} range-slider-input absolute w-full`}
                                style={{ background: 'none', WebkitAppearance: 'none', zIndex: activeSlider === 'start' ? 35 : 30 }}
                            />

                            {isFlexibleTariff && (
                                <input
                                    type="range"
                                    min="0"
                                    max={47}
                                    value={endTimeIndex}
                                    onChange={handleEndTimeChange}
                                    onMouseDown={() => setActiveSlider('end')}
                                    className={`${rangeSlider} range-slider-input absolute w-full`}
                                    style={{ background: 'none', WebkitAppearance: 'none', zIndex: activeSlider === 'end' ? 35 : 30 }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className={rightSummaryContainer}>
                    <div className={summaryTimeBlock}>
                        <h4 className="text-[18px] font-normal text-white leading-none">Выбранное время</h4>
                        <p className="text-[14px] font-normal text-white/70 leading-tight mt-2 mb-2.5 max-w-70">
                            Управляйте ползунками на таймлайне, чтобы настроить время праздника.
                        </p>
                        <div className="bg-[#313131] border border-white/10 px-4 py-1.5 rounded-full shadow-md backdrop-blur-sm mt-5 inline-block">
                            <span className="text-accent font-semibold text-[22px] tracking-wide">
                                {currentTime} — {currentEndTime}
                            </span>
                        </div>

                        {isTimeError && (
                            <span className="text-red-500 text-[12px] mt-2 block">
                                Выбранное время занято, пожалуйста, выберите другое
                            </span>
                        )}
                    </div>

                    <p className="text-[14px] font-normal text-white/70 leading-tight mt-5 max-w-70">
                        Хотите особенные условия, свой тариф или масштабное шоу? <a className='text-white underline' href="https://vk.com/shedevroom29" target="_blank" rel="noreferrer">Напишите нам в ВК</a> — соберем тариф под вас за 5 минут.
                    </p>

                    <div className="w-full flex flex-col items-start mt-auto">
                        <div className="text-[24px] font-bold text-white leading-none mb-2">
                            Итоговая сумма:{' '}
                            {isPriceLoading ? (
                                <span className="text-white/40 text-[18px] animate-pulse">Расчет...</span>
                            ) : (
                                `${currentPrice.toLocaleString()} ₽`
                            )}
                        </div>
                        <div className="text-[13px] font-normal text-white/50 max-w-70 mb-4 leading-tight">
                            Для бронирования записи требуется внести предоплату в размере 1 000 ₽
                        </div>
                        <button
                            type="submit"
                            disabled={isTimeError || isPriceLoading}
                            className={`w-full max-w-70] h-14 rounded-2xl py-4.25 px-10 text-[18px] font-normal text-black leading-none transition-all text-center ${(isTimeError || isPriceLoading)
                                ? 'bg-gray-500 cursor-not-allowed opacity-50'
                                : 'bg-accent hover:opacity-90 active:scale-[0.98] cursor-pointer'
                                }`}
                        >
                            Внести предоплату
                        </button>
                    </div>
                </div>
            </form>
            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
};