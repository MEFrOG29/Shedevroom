import React from "react";
import phoneIcon from '../assets/Телефон.svg';
import * as styles from "../styles/arenaStyles";
import { sectionTitle } from "../styles/mainStyles";

export const ArenaSection: React.FC = () => {
    return (
        <section className={styles.arenaSection} id="arena">
            <h1 className={sectionTitle}>Арена изнутри</h1>
            <div className={styles.excursionContainer}>

                <div className={styles.videoExcursionContainer}>
                    <p className={styles.titleWithoutVideo}>Видео-Экскурсия</p>
                </div>

                <div className={styles.realLifeExcursionContainer}>
                    <div className={styles.textRealLifeExcursionContainer}>
                        <h3 className={styles.titleRealLifeExcursion}>Хотите увидеть всё своими глазами?</h3>
                        <p className={styles.decriptionRealLifeExcursion}>Свяжитесь с нами удобным способом или приходите в гости. Мы всегда рады показать арену лично!</p>
                    </div>
                    <div className={styles.linkRealLifeExcursionContainer}>
                        <div className={styles.phoneRealLifeExcursionContainer}>
                            <img src={phoneIcon} alt="телефон" className="w-auto h-auto" />
                            <p className={styles.textPhoneRealLifeExcursion}>+7 (999) 999-99-99</p>
                        </div>
                        <div className={styles.vkRealLifeExcursionContainer}>
                            <p className={styles.textVkRealLifeExcursion}>Или напишите нам в соц.сетях:</p>
                            <a href="https://vk.com/shedevroom29" className={styles.buttonVkRealLifeExcursion}>Написать в VK</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};