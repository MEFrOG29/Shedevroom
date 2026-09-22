import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as styles from "../styles/bookingsStyles";

interface BookingCalendarProps {
    value: Date | null;
    onChange: (date: Date) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ value, onChange }) => {
    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const monthsNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const referenceDate = value || today;
    const currentYear = referenceDate.getFullYear();
    const currentMonth = referenceDate.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const emptyDaysBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const calendarCells: { day: number; monthOffset: number; date: Date }[] = [];

    for (let i = emptyDaysBefore - 1; i >= 0; i--) {
        const d = totalDaysInPrevMonth - i;
        calendarCells.push({ day: d, monthOffset: -1, date: new Date(currentYear, currentMonth - 1, d) });
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
        calendarCells.push({ day: d, monthOffset: 0, date: new Date(currentYear, currentMonth, d) });
    }

    let nextMonthDay = 1;
    while (calendarCells.length % 7 !== 0 || calendarCells.length < 35) {
        calendarCells.push({ day: nextMonthDay, monthOffset: 1, date: new Date(currentYear, currentMonth + 1, nextMonthDay) });
        nextMonthDay++;
    }

    const handleMonthChange = (direction: 'prev' | 'next') => {
        let targetYear = currentYear;
        let targetMonth = direction === 'prev' ? currentMonth - 1 : currentMonth + 1;

        if (targetMonth < 0) {
            targetMonth = 11;
            targetYear -= 1;
        } else if (targetMonth > 11) {
            targetMonth = 0;
            targetYear += 1;
        }

        const checkDate = new Date(targetYear, targetMonth + 1, 0);

        if (checkDate < today) {
            onChange(new Date(targetYear, targetMonth, 1));
        } else if (targetYear === today.getFullYear() && targetMonth === today.getMonth()) {
            onChange(new Date(today));
        } else {
            onChange(new Date(targetYear, targetMonth, 1));
        }
    };

    const handleDayPress = (cell: typeof calendarCells[0]) => {
        if (cell.date < today) return;
        onChange(cell.date);
    };

    return (
        <View className={styles.calendarContainer}>
            <View className={styles.calendarHeader}>
                <TouchableOpacity activeOpacity={0.6} onPress={() => handleMonthChange('prev')}>
                    <Text className={styles.calendarArrow}>&lt;</Text>
                </TouchableOpacity>

                <Text className={styles.calendarMonthTitle}>
                    {monthsNames[currentMonth]} {currentYear}
                </Text>

                <TouchableOpacity activeOpacity={0.6} onPress={() => handleMonthChange('next')}>
                    <Text className={styles.calendarArrow}>&gt;</Text>
                </TouchableOpacity>
            </View>

            <View className={styles.weekDaysGrid}>
                {weekDays.map((day, idx) => (
                    <Text key={idx} className={styles.weekDayName}>{day}</Text>
                ))}
            </View>

            <View className={styles.daysGrid}>
                {calendarCells.map((cell, idx) => {
                    const isFocusMonthPast = new Date(currentYear, currentMonth + 1, 0) < today;

                    const isSelected = !isFocusMonthPast && value &&
                        cell.date.getDate() === value.getDate() &&
                        cell.date.getMonth() === value.getMonth() &&
                        cell.date.getFullYear() === value.getFullYear();

                    const isPast = cell.date < today;
                    const isNeighborMonth = cell.monthOffset !== 0;

                    let cellClass = styles.cellDayFree;
                    if (isSelected) {
                        cellClass = styles.cellDaySelected;
                    } else if (isPast) {
                        cellClass = "w-[32px] h-[32px] mx-[2px] flex items-center justify-center opacity-40 bg-transparent";
                    } else if (isNeighborMonth) {
                        cellClass = `${styles.cellDayFree} opacity-50`;
                    }

                    return (
                        <TouchableOpacity
                            key={`${cell.monthOffset}-${cell.day}-${idx}`}
                            activeOpacity={isPast ? 1 : 0.7}
                            onPress={() => handleDayPress(cell)}
                            className={cellClass}
                            disabled={isPast}
                        >
                            <Text
                                className={`${styles.dayNumberText} ${isSelected
                                    ? "text-black font-semibold"
                                    : isPast
                                        ? "text-white/20"
                                        : "text-white/80"
                                    }`}
                            >
                                {cell.day}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};