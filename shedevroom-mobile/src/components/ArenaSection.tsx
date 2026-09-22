import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import * as styles from "../styles/arenaStyles";

export const ArenaSection: React.FC = () => {
    const handleOpenVK = () => {
        Linking.openURL('https://vk.com/shedevroom29').catch((err) =>
            console.error("Не удалось открыть ссылку:", err)
        );
    };

    return (
        <View
            className={styles.arenaSection}
            style={{ alignItems: 'center', justifyContent: 'center' }}
        >
            <Text
                className={styles.arenaTitle}
                style={{ width: 320, fontFamily: 'Inter-Tight' }}
            >
                Арена изнутри
            </Text>

            <View
                className={styles.excursionContainer}
                style={{ width: 320, alignItems: 'center' }}
            >

                <View
                    className={styles.videoExcursionContainer}
                    style={{ width: 320 }}
                >
                    <Text
                        className={styles.titleWithoutVideo}
                        style={{ fontFamily: 'Inter-Tight' }}
                    >
                        Видео-Экскурсия
                    </Text>
                </View>

                <View
                    className={styles.realLifeExcursionContainer}
                    style={{ width: 320, alignItems: 'flex-start' }}
                >

                    <View className={styles.textRealLifeExcursionContainer} style={{ width: 256 }}>
                        <Text
                            className={styles.titleRealLifeExcursion}
                            style={{ fontFamily: 'Inter-Tight' }}
                        >
                            Хотите увидеть всё своими глазами?
                        </Text>
                        <Text
                            className={styles.decriptionRealLifeExcursion}
                            style={{ fontFamily: 'Inter-Tight' }}
                        >
                            Свяжитесь с нами удобным способом или приходите в гости. Мы всегда рады показать арену лично!
                        </Text>
                    </View>

                    <View className={styles.linkRealLifeExcursionContainer} style={{ width: 272 }}>

                        <View className={styles.phoneRealLifeExcursionContainer} style={{ width: 272 }}>
                            <Image
                                source={require('../assets/Телефон.png')}
                                className={styles.phoneIconStyle}
                                resizeMode="contain"
                            />
                            <Text
                                className={styles.textPhoneRealLifeExcursion}
                                style={{ fontFamily: 'Inter-Tight' }}
                            >
                                +7 (999) 999-99-99
                            </Text>
                        </View>

                        <View className={styles.vkRealLifeExcursionContainer} style={{ width: 272 }}>
                            <Text
                                className={styles.textVkRealLifeExcursion}
                                style={{ fontFamily: 'Inter-Tight' }}
                            >
                                Или напишите нам в соц.сетях:
                            </Text>

                            <TouchableOpacity
                                className={styles.buttonVkRealLifeExcursion}
                                style={{ width: 256 }}
                                onPress={handleOpenVK}
                                activeOpacity={0.8}
                            >
                                <Text
                                    className={styles.buttonVkText}
                                    style={{ fontFamily: 'Inter-Tight' }}
                                >
                                    Написать в VK
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </View>
        </View>
    );
};