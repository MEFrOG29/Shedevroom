import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";

export interface TariffFromDB {
    tariff_id: number;
    title: string;
    is_flexible: boolean;
    default_duration: number;
    base_price?: number;
    weekend_price?: number;
}

interface TariffDropdownProps {
    tariffs: TariffFromDB[];
    selectedTariffTitle: string;
    onSelect: (tariff: TariffFromDB) => void;
}

export const TariffDropdown: React.FC<TariffDropdownProps> = ({
    tariffs,
    selectedTariffTitle,
    onSelect
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View className="relative w-[256px]">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsOpen(!isOpen)}
                className={`w-[256px] h-11 px-4 flex-row items-center justify-between rounded-2xl bg-bg_main mb-6 
                    ${isOpen ? "border-accent/50" : "border-white/10"}`}
            >
                <Text className="text-[16px] font-normal text-white">
                    {selectedTariffTitle || 'Тариф "Стандарт"'}
                </Text>

                <View className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <Text
                        className={`text-[12px] ${isOpen ? "text-accent" : "text-white/50"}`}
                    >
                        ▼
                    </Text>
                </View>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 justify-center items-center bg-black/40"
                    onPress={() => setIsOpen(false)}
                >
                    <View className="w-[256px] max-h-60 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden p-1">
                        <ScrollView bounces={false} showsVerticalScrollIndicator={true}>
                            {tariffs.map((t) => {
                                const isSelected = selectedTariffTitle === t.title;
                                return (
                                    <TouchableOpacity
                                        key={t.tariff_id}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            onSelect(t);
                                            setIsOpen(false);
                                        }}
                                        className={`px-4 py-3 my-0.5 rounded-[10px] flex-row items-center justify-between
                                            ${isSelected ? "bg-[#313131]" : "bg-transparent"}`}
                                    >
                                        <Text
                                            className={`text-[15px] font-normal 
                                                ${isSelected ? "text-accent font-medium" : "text-white/70"}`}
                                        >
                                            {t.title}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};