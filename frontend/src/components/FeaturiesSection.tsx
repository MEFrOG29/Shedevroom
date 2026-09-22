import React from "react";
import arenaIcon from '../assets/Арена.svg';
import vrIcon from '../assets/Шлем.svg';
import pizzaIcon from '../assets/Пицца.svg';
import shieldIcon from '../assets/Щит.svg';
import * as styles from "../styles/featuriesStyles";
import { sectionTitle } from "../styles/mainStyles";

export const FeaturesSection: React.FC = () => {
    return (
        <section className={styles.featuriesSection} id="about">
            <h1 className={sectionTitle}>Почему выбирают ШедеVRoom?</h1>
            <div className={styles.featuriesCardContainer}>

                <div className={styles.featuriesCard}>
                    <div className={styles.cardIconContainer}>
                        <img src={arenaIcon} alt="арена" className='w-auto h-auto' />
                        <h6 className={styles.cardTitle}>Большая арена</h6>
                    </div>
                    <p className={styles.cardDescription}>Площадь нашей арены позволяет комфортно играть компаниям до 10 человек одновременно - места хватит всем.</p>
                </div>

                <div className={styles.featuriesCard}>
                    <div className={styles.cardIconContainer}>
                        <img src={vrIcon} alt="шлем" className='w-auto h-auto' />
                        <h6 className={styles.cardTitle}>50+ крутых игр</h6>
                    </div>
                    <p className={styles.cardDescription}>В нашей библиотеке более 50 разнообразных игр: подберем идеальный формат под любое настроение.</p>
                </div>

                <div className={styles.featuriesCard}>
                    <div className={styles.cardIconContainer}>
                        <img src={pizzaIcon} alt="пицца" className='w-auto h-auto' />
                        <h6 className={styles.cardTitle}>Своя еда<br /> и напитки</h6>
                    </div>
                    <p className={styles.cardDescription}>У нас полностью отсутствует пробковый сбор, вы можете принести с собой любую еду и напитки.</p>
                </div>

                <div className={styles.featuriesCard}>
                    <div className={styles.cardIconContainer}>
                        <img src={shieldIcon} alt="щит" className='w-auto h-auto' />
                        <h6 className={styles.cardTitle}>Забота и сервис</h6>
                    </div>
                    <p className={styles.cardDescription}>Опытные администраторы помогут подобрать игры под любой возраст и объяснят правила.</p>
                </div>

            </div>
        </section>
    );
};