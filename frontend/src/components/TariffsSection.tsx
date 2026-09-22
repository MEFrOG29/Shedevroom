import React, { useState } from "react";
import * as styles from "../styles/tariffsStyles";
import { sectionTitle } from "../styles/mainStyles";
import { TiltCard } from "./TiltCard";
import left from "../assets/left.png";
import right from "../assets/right.png";

export const TariffsSection: React.FC = () => {
    const [isWeekend, setIsWeekend] = useState(true);
    const [activeIndex, setActiveIndex] = useState(1);

    const handlePrev = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    const handleNext = () => setActiveIndex((prev) => (prev < 6 ? prev + 1 : prev));

    const scrollToSection = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className={styles.tariffsSection} id="tariffs">
            <h1 className={sectionTitle}>Тарифы и цены</h1>

            <div className={styles.switcherWrapper}>

                <div className={styles.switcherContainer}>

                    <div className={`${styles.switcherBgSlider} ${isWeekend ? 'translate-x-0' : 'translate-x-full'
                        }`} />

                    <button
                        onClick={() => setIsWeekend(true)}
                        className={`${styles.switcherButton} ${isWeekend ? 'text-white' : 'text-white/50'
                            }`}
                    >
                        {isWeekend && (
                            <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        ПТ - ВС*
                    </button>

                    <button
                        onClick={() => setIsWeekend(false)}
                        className={`${styles.switcherButton} ${!isWeekend ? 'text-white' : 'text-white/50'
                            }`}
                    >
                        {!isWeekend && (
                            <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        ПН - ЧТ
                    </button>
                </div>

                <span className={styles.switcherNotice}>*а также праздничные дни</span>
            </div>

            <button onClick={handlePrev} disabled={activeIndex === 0} className={styles.sliderArrowLeft}>
                <img width="12" height="20" src={left} />

            </button>
            <button onClick={handleNext} disabled={activeIndex === 6} className={styles.sliderArrowRight}>
                <img width="12" height="20" src={right} />
            </button>

            <div className={styles.sliderMaskLeft}></div>
            <div className={styles.sliderMaskRight}></div>

            <div
                className={styles.sliderTrack}
                style={{
                    transform: `translateX(calc(50% - 186px - ${activeIndex * 396}px))`,
                }}
            >
                <TiltCard className={`${styles.baseTariffCard} ${activeIndex === 0 ? styles.centerCardActive : styles.sideCardInactive}`}>
                    <div className={activeIndex === 0 ? styles.activeCardBorder : styles.inactiveCardBorder} />
                    <div>
                        <p className={styles.cardPreTitle}>Для маленькой компании</p>
                        <h3 className={styles.cardMainTitle}>Тариф “МИНИ”</h3>
                        <div className={styles.cardPrice}>
                            {isWeekend === true ? '14 000' : '11 000'} ₽
                        </div>
                        <div className={styles.cardDuration}>
                            Длительность: 3 часа <br />
                            Время игры: 1 час
                        </div>
                        <ul className={styles.cardList}>
                            <li>✓ Игра на арене со сменой игроков</li>
                            <li>✓ Аренда лаунж-зоны на все 3 часа</li>
                            <li>✓ Работа двух администраторов-инструкторов</li>
                            <li>✓ Настольные игры и PS4 без ограничений</li>
                        </ul>
                    </div>
                    <button onClick={() => scrollToSection('booking')} className={activeIndex === 0 ? styles.cardBtnActive : styles.cardBtnInactive}>
                        Выбрать этот тариф
                    </button>
                </TiltCard>

                <TiltCard className={`${styles.baseTariffCard} ${activeIndex === 1 ? styles.centerCardActive : styles.sideCardInactive}`}>
                    <div className={activeIndex === 1 ? styles.activeCardBorder : styles.inactiveCardBorder} />
                    <span className={styles.hitBadge}>Хит</span>
                    <div>
                        <p className={styles.cardPreTitle}>Идеально для дня рождения</p>
                        <h3 className={styles.cardMainTitle}>Тариф “СТАНДАРТ”</h3>
                        <div className={styles.cardPrice}>
                            {isWeekend === true ? '21 000' : '17 000'} ₽
                        </div>
                        <div className={styles.cardDuration}>
                            Длительность: 4 часа <br />
                            Время игры: 2 часа
                        </div>
                        <ul className={styles.cardList}>
                            <li>✓ Игра на арене со сменой игроков</li>
                            <li>✓ Аренда лаунж-зоны на все 4 часа</li>
                            <li>✓ Работа двух администраторов-инструкторов</li>
                            <li>✓ Настольные игры и PS5 без ограничений</li>
                        </ul>
                    </div>
                    <button onClick={() => scrollToSection('booking')} className={activeIndex === 1 ? styles.cardBtnActive : styles.cardBtnInactive}>
                        Выбрать этот тариф
                    </button>
                </TiltCard>

                <TiltCard className={`${styles.baseTariffCard} ${activeIndex === 2 ? styles.centerCardActive : styles.sideCardInactive}`}>
                    <div className={activeIndex === 2 ? styles.activeCardBorder : styles.inactiveCardBorder} />
                    <div>
                        <p className={styles.cardPreTitle}>Для крутого праздника</p>
                        <h3 className={styles.cardMainTitle}>Тариф “МАКСИ”</h3>
                        <div className={styles.cardPrice}>
                            {isWeekend === true ? '29 000' : '24 000'} ₽
                        </div>
                        <div className={styles.cardDuration}>
                            Длительность: 5 часов <br />
                            Время игры: 3 часа
                        </div>
                        <ul className={styles.cardList}>
                            <li>✓ Игра на арене со сменой игроков</li>
                            <li>✓ Аренда лаунж-зоны на все 3 часа</li>
                            <li>✓ Работа двух администраторов-инструкторов</li>
                            <li>✓ Настольные игры и PS5 без ограничений</li>
                        </ul>
                    </div>
                    <button onClick={() => scrollToSection('booking')} className={activeIndex === 2 ? styles.cardBtnActive : styles.cardBtnInactive}>
                        Выбрать этот тариф
                    </button>
                </TiltCard>

                <TiltCard className={`${styles.baseTariffCard} ${activeIndex === 3 ? styles.centerCardActive : styles.sideCardInactive}`}>
                    <div className={activeIndex === 3 ? styles.activeCardBorder : styles.inactiveCardBorder} />
                    <div>
                        <p className={styles.cardPreTitle}>Максимум эмоций</p>
                        <h3 className={styles.cardMainTitle}>Тариф “УЛЬТРА”</h3>
                        <div className={styles.cardPrice}>
                            {isWeekend === true ? '75 000' : '60 000'} ₽
                        </div>
                        <div className={styles.cardDuration}>
                            Длительность: 10 часов <br />
                            Время игры: 10 часов
                        </div>
                        <ul className={styles.cardList}>
                            <li>✓ Игра на арене со сменой игроков</li>
                            <li>✓ Аренда лаунж-зоны на все время</li>
                            <li>✓ Работа двух администраторов-инструкторов</li>
                            <li>✓ Настольные игры и PS4 без ограничений</li>
                        </ul>
                    </div>
                    <button onClick={() => scrollToSection('booking')} className={activeIndex === 3 ? styles.cardBtnActive : styles.cardBtnInactive}>
                        Выбрать этот тариф
                    </button>
                </TiltCard>

                <TiltCard className={`${styles.baseTariffCard} ${activeIndex === 4 ? styles.centerCardActive : styles.sideCardInactive}`}>
                    <div className={activeIndex === 4 ? styles.activeCardBorder : styles.inactiveCardBorder} />
                    <div>
                        <p className={styles.cardPreTitle}>Для одноклассников и выпускных</p>
                        <h3 className={styles.cardMainTitle}>Тариф “ШКОЛЬНЫЙ”</h3>
                        <div className={styles.cardPrice}>
                            {isWeekend === true ? '22 000' : '19 000'} ₽
                        </div>
                        <div className={styles.cardDuration}>
                            Длительность: 3 часа <br />
                            Время игры: 3 часа
                        </div>
                        <ul className={styles.cardList}>
                            <li>✓ Игра на арене со сменой игроков</li>
                            <li>✓ Аренда лаунж-зоны на все время</li>
                            <li>✓ Работа двух администраторов-инструкторов</li>
                            <li>✓ Настольные игры и PS4 без ограничений</li>
                        </ul>
                    </div>
                    <button onClick={() => scrollToSection('booking')} className={activeIndex === 4 ? styles.cardBtnActive : styles.cardBtnInactive}>
                        Выбрать этот тариф
                    </button>
                </TiltCard>

                <TiltCard className={`${styles.baseTariffCard} ${activeIndex === 5 ? styles.centerCardActive : styles.sideCardInactive}`}>
                    <div className={activeIndex === 5 ? styles.activeCardBorder : styles.inactiveCardBorder} />
                    <div>
                        <p className={styles.cardPreTitle}>Только VR-погружение</p>
                        <h3 className={styles.cardMainTitle} style={{ transform: 'translateZ(30px)' }}>Командная игра</h3>
                        <div className={styles.cardPrice}>
                            {isWeekend === true ? 'от 4 000' : 'от 3 200'} ₽
                            <p className="text-[12px] font-normal text-white -mt-1.25">зависит от количества человек</p>
                        </div>
                        <div className={styles.cardDuration}>
                            Время игры: от 1 часа
                        </div>
                        <ul className={styles.cardList}>
                            <li>✓ Чистая игра на VR-арене </li>
                            <li>✓ Сопровождение игры администратором-инструктором</li>
                            <li>✓ Внимание: лаунж-зона в этот тариф не входит</li>
                        </ul>
                    </div>
                    <button onClick={() => scrollToSection('booking')} className={activeIndex === 5 ? styles.cardBtnActive : styles.cardBtnInactive} style={{ transform: 'translateZ(30px)' }}>
                        Выбрать этот тариф
                    </button>
                </TiltCard>

                <TiltCard className={`${styles.baseTariffCard} ${activeIndex === 6 ? styles.centerCardActive : styles.sideCardInactive}`}>
                    <div className={activeIndex === 6 ? styles.activeCardBorder : styles.inactiveCardBorder} />
                    <div>
                        <p className={styles.cardPreTitle}>Пространство для вашего отдыха</p>
                        <h3 className={styles.cardMainTitle}>Аренда лаунжа</h3>
                        <div className={styles.cardPrice}>
                            {isWeekend === true ? 'от 2 500' : 'от 2 000'} ₽
                            <p className="text-[12px] font-normal text-white -mt-1.25">зависит от количества человек</p>
                        </div>
                        <div className={styles.cardDuration}>
                            Длительность: от 1 часа
                        </div>
                        <ul className={styles.cardList}>
                            <li>✓ Полное уединение в лаунж-зоне </li>
                            <li>✓ Можно со своей едой и напитками</li>
                            <li>✓ Настольные игры и PS5 без ограничений</li>
                            <li>✓ Внимание: VR-игра в этот тариф не входит</li>
                        </ul>
                    </div>
                    <button onClick={() => scrollToSection('booking')} className={activeIndex === 6 ? styles.cardBtnActive : styles.cardBtnInactive}>
                        Выбрать этот тариф
                    </button>
                </TiltCard>

            </div>
        </section >
    );
};