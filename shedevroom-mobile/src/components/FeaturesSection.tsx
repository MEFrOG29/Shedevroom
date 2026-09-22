import React from "react";
import { View, Text, Image } from "react-native";
import * as styles from "../styles/featuresStyles";

export const FeaturesSection: React.FC = () => {
    return (
        <View className={styles.featuresSection}>
            <Text className={styles.featuresTitle}>Почему выбирают ШедеVRoom?</Text>

            <View className={styles.featuresCardContainer}>

                <View className={styles.featuresCard}>
                    <View className={styles.cardHeaderContainer}>
                        <Image
                            source={require('../assets/Арена.png')}
                            className={styles.cardIcon}
                            resizeMode="contain"
                        />
                        <Text className={styles.cardTitle}>Большая арена</Text>
                    </View>
                    <Text className={styles.cardDescription}>
                        Площадь нашей арены позволяет комфортно играть компаниям до 10 человек одновременно - места хватит всем.
                    </Text>
                </View>

                <View className={styles.featuresCard}>
                    <View className={styles.cardHeaderContainer}>
                        <Image
                            source={require('../assets/Шлем.png')}
                            className={styles.cardIcon}
                            resizeMode="contain"
                        />
                        <Text className={styles.cardTitle}>50+ крутых игр</Text>
                    </View>
                    <Text className={styles.cardDescription}>
                        В нашей библиотеке более 50 разнообразных игр: подберем идеальный формат под любое настроение.
                    </Text>
                </View>

                <View className={styles.featuresCard}>
                    <View className={styles.cardHeaderContainer}>
                        <Image
                            source={require('../assets/Пицца.png')}
                            className={styles.cardIcon}
                            resizeMode="contain"
                        />
                        <Text className={styles.cardTitle}>Своя еда и напитки</Text>
                    </View>
                    <Text className={styles.cardDescription}>
                        У нас полностью отсутствует пробковый сбор, вы можете принести с собой любую еду и напитки.
                    </Text>
                </View>

                <View className={styles.featuresCard}>
                    <View className={styles.cardHeaderContainer}>
                        <Image
                            source={require('../assets/Щит.png')}
                            className={styles.cardIcon}
                            resizeMode="contain"
                        />
                        <Text className={styles.cardTitle}>Забота и сервис</Text>
                    </View>
                    <Text className={styles.cardDescription}>
                        Опытные администраторы помогут подобрать игры под любой возраст и объяснят правила.
                    </Text>
                </View>

            </View>
        </View>
    );
};