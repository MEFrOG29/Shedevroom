import React, { useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import * as styles from "../styles/tariffsStyles";
import { featuresTitle } from "../styles/featuresStyles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SNAP_OFFSET = (SCREEN_WIDTH - 320) / 2;

interface TariffProps {
    onScrollToSection: (sectionId: string) => void;
}

export const TariffsSection: React.FC<TariffProps> = ({ onScrollToSection }) => {
    const [isWeekend, setIsWeekend] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(xOffset / 336);
        if (index !== activeIndex && index >= 0 && index <= 6) {
            setActiveIndex(index);
        }
    };

    const handleMenuClick = (sectionId: string) => {
        setIsMenuOpen(false);
        onScrollToSection(sectionId);
    };

    const handleSelectTariff = () => {
        handleMenuClick('booking')
    };

    const renderCheckIcon = () => (
        <View className="w-4 h-4 items-center justify-center">
            <Text className="text-white font-bold text-[12px]">✓</Text>
        </View>
    );

    return (
        <View className={styles.tariffsSection}>
            <Text className={featuresTitle} style={{ fontFamily: 'Inter-Tight' }}>
                Тарифы и цены
            </Text>

            <View className={styles.switcherWrapper}>
                <View className={styles.switcherContainer} style={{ flexDirection: "row" }}>
                    <View
                        className={styles.switcherBgSlider}
                        style={{ transform: [{ translateX: isWeekend ? 0 : 141 }] }}
                    />

                    <TouchableOpacity
                        onPress={() => setIsWeekend(true)}
                        className={styles.switcherButton}
                        style={{ flexDirection: "row" }}
                        activeOpacity={0.9}
                    >
                        {isWeekend && renderCheckIcon()}
                        <Text className={isWeekend ? "text-white font-medium" : "text-white/50 font-medium"}>
                            ПТ - ВС*
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsWeekend(false)}
                        className={styles.switcherButton}
                        style={{ flexDirection: "row" }}
                        activeOpacity={0.9}
                    >
                        {!isWeekend && renderCheckIcon()}
                        <Text className={!isWeekend ? "text-white font-medium" : "text-white/50 font-medium"}>
                            ПН - ЧТ
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text className={styles.switcherNotice} style={{ fontFamily: 'Inter-Tight' }}>
                    *а также праздничные дни
                </Text>
            </View>

            <View className={styles.sliderTrackContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={336}
                    decelerationRate="fast"
                    contentContainerStyle={{
                        paddingHorizontal: SNAP_OFFSET,
                        gap: 16,
                        alignItems: 'center'
                    }}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >

                    <View className={`${styles.baseTariffCard} ${activeIndex === 0 ? styles.centerCardActive : styles.sideCardInactive}`}>
                        <View>
                            <Text className={styles.cardPreTitle} style={{ fontFamily: 'Inter-Tight' }}>Для маленькой компании</Text>
                            <Text className={styles.cardMainTitle} style={{ fontFamily: 'Inter-Tight' }}>Тариф “МИНИ”</Text>
                            <Text className={styles.cardPrice} style={{ fontFamily: 'Inter-Tight' }}>
                                {isWeekend ? '14 000' : '11 000'} ₽
                            </Text>
                            <Text className={styles.cardDuration} style={{ fontFamily: 'Inter-Tight' }}>
                                Длительность: 3 часа{"\n"}Время игры: 1 час
                            </Text>
                            <View className={styles.cardList}>
                                <Text className="text-white/90">✓ Игра на арене со сменой игроков</Text>
                                <Text className="text-white/90">✓ Аренда лаунж-зоны на все 3 часа</Text>
                                <Text className="text-white/90">✓ Работа двух администраторов</Text>
                                <Text className="text-white/90">✓ Настольные игры и PS4 без ограничений</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={activeIndex === 0 ? styles.cardBtnActive : styles.cardBtnInactive}
                            onPress={() => handleSelectTariff()}
                        >
                            <Text className={activeIndex === 0 ? "text-black font-normal" : "text-white"} style={{ fontFamily: 'Inter-Tight' }}>
                                Выбрать этот тариф
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className={`${styles.baseTariffCard} ${activeIndex === 1 ? styles.centerCardActive : styles.sideCardInactive}`}>
                        <Text className={styles.hitBadge} style={{ fontFamily: 'Inter-Tight' }}>Хит</Text>
                        <View>
                            <Text className={styles.cardPreTitle} style={{ fontFamily: 'Inter-Tight' }}>Идеально для дня рождения</Text>
                            <Text className={styles.cardMainTitle} style={{ fontFamily: 'Inter-Tight' }}>Тариф “СТАНДАРТ”</Text>
                            <Text className={styles.cardPrice} style={{ fontFamily: 'Inter-Tight' }}>
                                {isWeekend ? '21 000' : '17 000'} ₽
                            </Text>
                            <Text className={styles.cardDuration} style={{ fontFamily: 'Inter-Tight' }}>
                                Длительность: 4 часа{"\n"}Время игры: 2 часа
                            </Text>
                            <View className={styles.cardList}>
                                <Text className="text-white/90">✓ Игра на арене со сменой игроков</Text>
                                <Text className="text-white/90">✓ Аренда лаунж-зоны на все 4 часа</Text>
                                <Text className="text-white/90">✓ Работа двух администраторов</Text>
                                <Text className="text-white/90">✓ Настольные игры и PS5 без ограничений</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={activeIndex === 1 ? styles.cardBtnActive : styles.cardBtnInactive}
                            onPress={() => handleSelectTariff()}
                        >
                            <Text className={activeIndex === 1 ? "text-black font-normal" : "text-white"} style={{ fontFamily: 'Inter-Tight' }}>
                                Выбрать этот тариф
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className={`${styles.baseTariffCard} ${activeIndex === 2 ? styles.centerCardActive : styles.sideCardInactive}`}>
                        <View>
                            <Text className={styles.cardPreTitle} style={{ fontFamily: 'Inter-Tight' }}>Для крутого праздника</Text>
                            <Text className={styles.cardMainTitle} style={{ fontFamily: 'Inter-Tight' }}>Тариф “МАКСИ”</Text>
                            <Text className={styles.cardPrice} style={{ fontFamily: 'Inter-Tight' }}>
                                {isWeekend ? '29 000' : '24 000'} ₽
                            </Text>
                            <Text className={styles.cardDuration} style={{ fontFamily: 'Inter-Tight' }}>
                                Длительность: 5 часов{"\n"}Время игры: 3 часа
                            </Text>
                            <View className={styles.cardList}>
                                <Text className="text-white/90">✓ Игра на арене со сменой игроков</Text>
                                <Text className="text-white/90">✓ Аренда лаунж-зоны на все 3 часа</Text>
                                <Text className="text-white/90">✓ Работа двух администраторов</Text>
                                <Text className="text-white/90">✓ Настольные игры и PS5 без ограничений</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={activeIndex === 2 ? styles.cardBtnActive : styles.cardBtnInactive}
                            onPress={() => handleSelectTariff()}
                        >
                            <Text className={activeIndex === 2 ? "text-black font-normal" : "text-white"} style={{ fontFamily: 'Inter-Tight' }}>
                                Выбрать этот тариф
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className={`${styles.baseTariffCard} ${activeIndex === 3 ? styles.centerCardActive : styles.sideCardInactive}`}>
                        <View>
                            <Text className={styles.cardPreTitle} style={{ fontFamily: 'Inter-Tight' }}>Максимум эмоций</Text>
                            <Text className={styles.cardMainTitle} style={{ fontFamily: 'Inter-Tight' }}>Тариф “УЛЬТРА”</Text>
                            <Text className={styles.cardPrice} style={{ fontFamily: 'Inter-Tight' }}>
                                {isWeekend ? '75 000' : '60 000'} ₽
                            </Text>
                            <Text className={styles.cardDuration} style={{ fontFamily: 'Inter-Tight' }}>
                                Длительность: 10 часов{"\n"}Время игры: 10 часов
                            </Text>
                            <View className={styles.cardList}>
                                <Text className="text-white/90">✓ Игра на арене со сменой игроков</Text>
                                <Text className="text-white/90">✓ Аренда лаунж-зоны на все время</Text>
                                <Text className="text-white/90">✓ Работа двух администраторов</Text>
                                <Text className="text-white/90">✓ Настольные игры и PS4 без ограничений</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={activeIndex === 3 ? styles.cardBtnActive : styles.cardBtnInactive}
                            onPress={() => handleSelectTariff()}
                        >
                            <Text className={activeIndex === 3 ? "text-black font-normal" : "text-white"} style={{ fontFamily: 'Inter-Tight' }}>
                                Выбрать этот тариф
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className={`${styles.baseTariffCard} ${activeIndex === 4 ? styles.centerCardActive : styles.sideCardInactive}`}>
                        <View>
                            <Text className={styles.cardPreTitle} style={{ fontFamily: 'Inter-Tight' }}>Для одноклассников и выпускных</Text>
                            <Text className={styles.cardMainTitle} style={{ fontFamily: 'Inter-Tight' }}>Тариф “ШКОЛЬНЫЙ”</Text>
                            <Text className={styles.cardPrice} style={{ fontFamily: 'Inter-Tight' }}>
                                {isWeekend ? '22 000' : '19 000'} ₽
                            </Text>
                            <Text className={styles.cardDuration} style={{ fontFamily: 'Inter-Tight' }}>
                                Длительность: 3 часа{"\n"}Время игры: 3 часа
                            </Text>
                            <View className={styles.cardList}>
                                <Text className="text-white/90">✓ Игра на арене со сменой игроков</Text>
                                <Text className="text-white/90">✓ Аренда лаунж-зоны на все время</Text>
                                <Text className="text-white/90">✓ Работа двух администраторов</Text>
                                <Text className="text-white/90">✓ Настольные игры и PS4 без ограничений</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={activeIndex === 4 ? styles.cardBtnActive : styles.cardBtnInactive}
                            onPress={() => handleSelectTariff()}
                        >
                            <Text className={activeIndex === 4 ? "text-black font-normal" : "text-white"} style={{ fontFamily: 'Inter-Tight' }}>
                                Выбрать этот тариф
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className={`${styles.baseTariffCard} ${activeIndex === 5 ? styles.centerCardActive : styles.sideCardInactive}`}>
                        <View>
                            <Text className={styles.cardPreTitle} style={{ fontFamily: 'Inter-Tight' }}>Только VR-погружение</Text>
                            <Text className={styles.cardMainTitle} style={{ fontFamily: 'Inter-Tight' }}>Командная игра</Text>
                            <View>
                                <Text className={styles.cardPrice} style={{ fontFamily: 'Inter-Tight' }}>
                                    {isWeekend ? 'от 4 000' : 'от 3 200'} ₽
                                </Text>
                                <Text className={styles.cardPriceSub} style={{ fontFamily: 'Inter-Tight' }}>
                                    зависит от количества человек
                                </Text>
                            </View>
                            <Text className={styles.cardDuration} style={{ fontFamily: 'Inter-Tight' }}>
                                Время игры: от 1 часа
                            </Text>
                            <View className={styles.cardList}>
                                <Text className="text-white/90">✓ Чистая игра на VR-арене</Text>
                                <Text className="text-white/90">✓ Сопровождение инструктором</Text>
                                <Text className="text-white/90">✓ Внимание: лаунж-зона не входит</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={activeIndex === 5 ? styles.cardBtnActive : styles.cardBtnInactive}
                            onPress={() => handleSelectTariff()}
                        >
                            <Text className={activeIndex === 5 ? "text-black font-normal" : "text-white"} style={{ fontFamily: 'Inter-Tight' }}>
                                Выбрать этот тариф
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className={`${styles.baseTariffCard} ${activeIndex === 6 ? styles.centerCardActive : styles.sideCardInactive}`}>
                        <View>
                            <Text className={styles.cardPreTitle} style={{ fontFamily: 'Inter-Tight' }}>Пространство для вашего отдыха</Text>
                            <Text className={styles.cardMainTitle} style={{ fontFamily: 'Inter-Tight' }}>Аренда лаунжа</Text>
                            <View>
                                <Text className={styles.cardPrice} style={{ fontFamily: 'Inter-Tight' }}>
                                    {isWeekend ? 'от 2 500' : 'от 2 000'} ₽
                                </Text>
                                <Text className={styles.cardPriceSub} style={{ fontFamily: 'Inter-Tight' }}>
                                    зависит от количества человек
                                </Text>
                            </View>
                            <Text className={styles.cardDuration} style={{ fontFamily: 'Inter-Tight' }}>
                                Длительность: от 1 часа
                            </Text>
                            <View className={styles.cardList}>
                                <Text className="text-white/90">✓ Полное уединение в лаунж-зоне</Text>
                                <Text className="text-white/90">✓ Можно со своей едой и напитками</Text>
                                <Text className="text-white/90">✓ Настольные игры и PS5 без ограничений</Text>
                                <Text className="text-white/90">✓ Внимание: VR-игра не входит</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={activeIndex === 6 ? styles.cardBtnActive : styles.cardBtnInactive}
                            onPress={() => handleSelectTariff()}
                        >
                            <Text className={activeIndex === 6 ? "text-black font-normal" : "text-white"} style={{ fontFamily: 'Inter-Tight' }}>
                                Выбрать этот тариф
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        </View>
    );
};