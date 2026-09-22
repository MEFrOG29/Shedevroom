import childImg from '../assets/child.png';
import * as styles from "../styles/mainStyles";

export const HeroSection: React.FC = () => {
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
        <main className={styles.mainContainer}>
            <div className={styles.mainTextContainer}>
                <h1 className={styles.mainTextTitle}>
                    Играйте.<br />
                    Празднуйте.<br />
                    Побеждайте.
                </h1>
                <p className={styles.mainTextDesc}>
                    Современная VR-арена в Архангельске для компаний любого масштаба.<br />
                    Свободное перемещение, шлемы нового поколения Pico 4 Ultra<br />
                    и уютная лаунж-зона для вашего мероприятия.
                </p>
                <div className={styles.buttonContainer}>
                    <button onClick={() => scrollToSection('booking')} className={styles.ctaButton}>Забронировать</button>
                    <button onClick={() => scrollToSection('arena')} className={styles.excursionButton}>Онлайн-экскурсия</button>
                </div>
            </div>

            <div className={styles.childWrapper}>
                <img
                    src={childImg}
                    alt="Мальчик в VR шлеме"
                    className={styles.childPic}
                />
                <div className={styles.ellipse}></div>
                <div className={styles.hotspotGroup}>
                    <div className={styles.hotspotCircle}></div>

                    <div className={styles.tooltipCard}>
                        <h4 className={styles.tooltipTitle}>Pico 4 Ultra</h4>
                        <p className={styles.tooltipText}>Без проводов: Шлем весит как обычная<br /> кепка — голова и шея не устанут.</p>
                        <p className={styles.tooltipText}>Четкость 4K+: Максимально плавная<br /> картинка, от которой не устают глаза.</p>
                        <p className={styles.tooltipText}>Чистота: Идеальная гигиена —<br /> дезинфицируем шлемы после<br /> каждого гостя.</p>
                    </div>
                </div>
            </div>
        </main>
    );
};