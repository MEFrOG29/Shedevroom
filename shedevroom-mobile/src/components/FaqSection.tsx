import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
    faqAnswerText,
    faqArrowIcon,
    faqCard,
    faqHeader,
    faqItemsContainer,
    faqQuestionText,
    faqSectionTitle,
    faqWrapper
} from '../styles/faqStyles';

const FAQ_DATA = [
    {
        id: 1,
        question: 'Со скольки лет можно играть?',
        answer: 'Комфортно играть детям от 6-7 лет. У нас легкие шлемы и огромная база простых, ярких игр. Для совсем маленьких гостей у нас есть детская комната с телевизором и игрушками.'
    },
    {
        id: 2,
        question: 'Что если ребенку станет плохо во время игры, а меня не будет рядом?',
        answer: 'Наши администраторы-инструкторы постоянно находятся на площадке и следят за каждым игроком. Если ребенку станет некомфортно, ему сразу снимут шлем, успокоят, предложат воды и свяжутся с вами. Безопасность — наш главный приоритет.'
    },
    {
        id: 3,
        question: 'Для взрослой компании будет интересно?',
        answer: 'Конечно! В нашем арсенале огромное количество командных шутеров, хорроров и квестов с глубоким погружением, которые отлично подходят для тимбилдингов, корпоративов или просто крутого вечера с друзьями.'
    },
    {
        id: 4,
        question: 'Можно ли принести свою еду/воду/алкоголь?',
        answer: 'Да, в лаунж-зону вы можете принести любую еду и напитки с собой или заказать доставку прямо к нам. По поводу алкоголя и праздничного оформления лучше уточнить у администратора при подтверждении бронирования.'
    }
];

export const FaqSection: React.FC = () => {
    const [activeIds, setActiveIds] = useState<number[]>([]);

    const toggleFaq = (id: number) => {
        if (activeIds.includes(id)) {
            setActiveIds(activeIds.filter(item => item !== id));
        } else {
            setActiveIds([...activeIds, id]);
        }
    };

    return (
        <View className={faqWrapper}>
            <Text className={faqSectionTitle}>Часто задаваемые вопросы</Text>

            <View className={faqItemsContainer}>
                {FAQ_DATA.map((item) => {
                    const isOpen = activeIds.includes(item.id);

                    return (
                        <Pressable
                            key={item.id}
                            className={faqCard}
                            onPress={() => toggleFaq(item.id)}
                        >
                            <View className={faqHeader}>
                                <Text className={faqQuestionText}>{item.question}</Text>
                                <View
                                    className={`${faqArrowIcon}`}
                                    style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                                >
                                    <Svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                                        <Path
                                            d="M1 1.5L7 7.5L13 1.5"
                                            stroke={isOpen ? "#FDE000" : "#ffffff"}
                                            strokeOpacity={isOpen ? 1 : 0.7}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </Svg>
                                </View>
                            </View>

                            {isOpen && (
                                <View className="mt-4">
                                    <Text className={faqAnswerText}>
                                        {item.answer}
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};