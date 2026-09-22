import { burgerButton, burgerMenuElement, ctaButton, headerContainer, headerWrapper, logoStyle, logoWrapper, navLink, navList, burgerLine, headerLoginBtn, actionsWrapper } from "../styles/headerStyles";
import React, { useState } from "react";
import logoImg from '../assets/shedevrum.svg';

import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";
import { useAuth } from "../context/AuthContext";

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const { isAuthenticated, user, logout } = useAuth();

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
            setIsMenuOpen(false);
        }
    };

    return (
        <>
            <div className={headerWrapper}>
                <header className={headerContainer}>
                    <div className={logoWrapper} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img
                            src={logoImg}
                            alt="ШедеVRoom"
                            className={logoStyle}
                        />
                    </div>
                    <nav>
                        <ul className={navList}>
                            <li className={navLink} onClick={() => scrollToSection('about')}>О нас</li>
                            <li className={navLink} onClick={() => scrollToSection('tariffs')}>Тарифы и цены</li>
                            <li className={navLink} onClick={() => scrollToSection('faq')}>FAQ</li>
                            <li className={navLink} onClick={() => scrollToSection('contacts')}>Контакты</li>
                        </ul>
                    </nav>
                    <div className={actionsWrapper}>
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4 text-white text-sm">
                                <span className="border-r border-white/20 pr-4 opacity-90">
                                    {user?.first_name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsLoginOpen(true)}
                                className={headerLoginBtn}
                            >
                                Войти
                            </button>
                        )}
                        <button className={ctaButton} onClick={() => scrollToSection('booking')}>
                            Забронировать
                        </button>
                    </div>

                    <button className={burgerButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className={`${burgerLine} ${isMenuOpen ? 'rotate-135 translate-y-2' : ''}`}></span>
                        <span className={`${burgerLine} ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`${burgerLine} ${isMenuOpen ? 'rotate-45 -rotate-4process -translate-y-2' : ''}`}></span>
                    </button>

                    <div className={`absolute top-20 left-0 w-full bg-bg-header/95 backdrop-blur-lg border-b border-neutral-800/50 flex flex-col items-center gap-6 py-8 transition-all duration-300 z-40 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'}`}>
                        <span className={burgerMenuElement} onClick={() => scrollToSection('about')}>О нас</span>
                        <span className={burgerMenuElement} onClick={() => scrollToSection('tariffs')}>Тарифы</span>
                        <span className={burgerMenuElement} onClick={() => scrollToSection('faq')}>FAQ</span>
                        <span className={burgerMenuElement} onClick={() => scrollToSection('contacts')}>Контакты</span>

                        {!isAuthenticated ? (
                            <span className={burgerMenuElement} onClick={() => { setIsMenuOpen(false); setIsLoginOpen(true); }}>
                                Войти
                            </span>
                        ) : (
                            <span className={burgerMenuElement} onClick={() => { setIsMenuOpen(false); logout(); }}>
                                Выйти ({user?.first_name})
                            </span>
                        )}
                    </div>
                </header>
            </div>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                }}
            />

            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToLogin={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                }}
            />
        </>
    );
};