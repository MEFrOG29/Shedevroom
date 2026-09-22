import React, { useState } from 'react';
import { faqAnswerText, faqArrowIcon, faqCard, faqContentGrid, faqHeader, faqItemsContainer, faqQuestionText, faqSectionTitle, faqWrapper } from '../styles/faqStyles';

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
        <section className={faqWrapper} id="faq">
            <h2 className={faqSectionTitle}>Часто задаваемые вопросы</h2>

            <div className={faqItemsContainer}>
                {FAQ_DATA.map((item) => {
                    const isOpen = activeIds.includes(item.id);

                    return (
                        <div
                            key={item.id}
                            className={faqCard}
                            onClick={() => toggleFaq(item.id)}
                        >
                            <div className={faqHeader}>
                                <h3 className={faqQuestionText}>{item.question}</h3>
                                <div className={`${faqArrowIcon} ${isOpen ? 'rotate-180 text-accent' : ''}`}>
                                    <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                                        <path d="M1 1.5L7 7.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <div
                                className={`${faqContentGrid} ${isOpen ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr] mt-0'}`}
                            >
                                <div className={`${faqAnswerText} block`}>
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};