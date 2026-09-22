import React from 'react';
import { footerContactsCol, footerContactText, footerContainer, footerLegalLink, footerLogoCol, footerNavCol, footerNavLink, footerSocialBtn, footerSocialRow, footerSocialsCol, footerSubText, footerWrapper } from '../styles/footerStyles';
import logo from '../assets/logo.png';
import vkLogo from '../assets/vk.png';
import tgLogo from '../assets/tg.png';
import instaLogo from '../assets/instagram.png';

export const Footer: React.FC = () => {

    const handleScrollTo = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className={footerWrapper} id="contacts">
            <div className={footerContainer}>
                <div className={footerLogoCol}>
                    <div className="w-38.5 h-11 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img
                            src={logo}
                            alt="логотип"
                            className={footerLogoCol} />
                    </div>
                    <p className={footerSubText}>
                        Круглосуточная VR-арена и пространство для праздников в Архангельске. Устроим лучший День рождения для вашего ребенка
                    </p>
                    <span className={footerSubText}>
                        © 2026 ШедеVRoom. Все права защищены
                    </span>
                </div>

                <nav className={footerNavCol}>
                    <span onClick={() => handleScrollTo('about')} className={footerNavLink}>О нас</span>
                    <span onClick={() => handleScrollTo('tariffs')} className={footerNavLink}>Тарифы и цены</span>
                    <span onClick={() => handleScrollTo('games')} className={footerNavLink}>Игры</span>
                    <span onClick={() => handleScrollTo('contacts')} className={footerNavLink}>Контакты</span>
                </nav>

                <div className={footerContactsCol}>
                    <a href="tel:+79991234567" className={`${footerContactText} hover:text-accent transition-colors`}>
                        +7 (999) 123-45-67
                    </a>
                    <p className={footerContactText}>
                        ул. Тимме 1к3 г. Архангельск
                    </p>
                    <p className={`${footerContactText} text-white/50 text-[14px] leading-tight`}>
                        Работаем круглосуточно (24/7) по предварительной записи
                    </p>
                </div>

                <div className={footerSocialsCol}>
                    <a href="#" className={footerLegalLink}>Политика конфиденциальности</a>
                    <a href="#" className={footerLegalLink}>Пользовательское соглашение / Оферта</a>
                    <a href="#" className={footerLegalLink}>Реквизиты (ИП / ООО, ИНН)</a>

                    <div className={footerSocialRow}>
                        <a href="https://vk.com/shedevroom29" target="_blank" rel="noreferrer" className={footerSocialBtn} title="Мы ВКонтакте">
                            <img width="14" height="14" src={vkLogo} />
                        </a>

                        <a href="#" className={footerSocialBtn} title="Наш Telegram">
                            <img width="14" height="14" src={tgLogo} />
                        </a>

                        <a href="#" className={footerSocialBtn} title="Наш Instagram">
                            <img width="14" height="14" src={instaLogo} />
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
};