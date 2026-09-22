import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Animated, Dimensions } from "react-native";
import {
    headerWrapper,
    headerContainer,
    logoWrapper,
    logoStyle,
    burgerButton,
    burgerLine,
    sidebarMenuContainer,
    burgerMenuElement,
    burgerCtaButton,
    burgerCtaButtonText
} from "../styles/headerStyles";

import { useAuth } from "../context/AuthContext";
import { AuthModal } from "./AuthModal";

interface HeaderProps {
    onScrollToSection: (sectionId: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH - 80;

export const Header: React.FC<HeaderProps> = ({ onScrollToSection }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { isAuthenticated, user, logout } = useAuth();

    const animationProgress = useRef(new Animated.Value(0)).current;
    const sidebarOffset = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(animationProgress, {
                toValue: isMenuOpen ? 1 : 0,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(sidebarOffset, {
                toValue: isMenuOpen ? 0 : SIDEBAR_WIDTH,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start();
    }, [isMenuOpen]);

    const handleMenuClick = (sectionId: string) => {
        setIsMenuOpen(false);
        onScrollToSection(sectionId);
    };

    const topBarRotation = animationProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg']
    });
    const topBarTranslate = animationProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 7]
    });

    const middleBarOpacity = animationProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
    });

    const bottomBarRotation = animationProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-45deg']
    });
    const bottomBarTranslate = animationProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -7]
    });

    return (
        <>
            <View className={headerWrapper}>
                <View className={headerContainer}>

                    <TouchableOpacity
                        className={logoWrapper}
                        onPress={() => handleMenuClick('hero')}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../assets/logo.png')}
                            className={logoStyle}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={burgerButton}
                        onPress={() => setIsMenuOpen(!isMenuOpen)}
                        activeOpacity={0.7}
                    >
                        <Animated.View
                            style={[{ transform: [{ translateY: topBarTranslate }, { rotate: topBarRotation }] }]}
                            className={burgerLine}
                        />
                        <Animated.View
                            style={[{ opacity: middleBarOpacity }]}
                            className={burgerLine}
                        />
                        <Animated.View
                            style={[{ transform: [{ translateY: bottomBarTranslate }, { rotate: bottomBarRotation }] }]}
                            className={burgerLine}
                        />
                    </TouchableOpacity>

                </View>
            </View>

            {isMenuOpen && (
                <TouchableOpacity
                    className="absolute inset-0 bg-black/40 z-30 h-screen w-screen"
                    activeOpacity={1}
                    onPress={() => setIsMenuOpen(false)}
                />
            )}

            <Animated.View
                className={sidebarMenuContainer}
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: SIDEBAR_WIDTH,
                        height: '100%',
                        zIndex: 40,
                        transform: [{ translateX: sidebarOffset }]
                    }
                ]}
            >
                <TouchableOpacity className="w-full" onPress={() => handleMenuClick('about')}>
                    <Text className={burgerMenuElement}>О нас</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-full" onPress={() => handleMenuClick('tariffs')}>
                    <Text className={burgerMenuElement}>Тарифы</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-full" onPress={() => handleMenuClick('faq')}>
                    <Text className={burgerMenuElement}>FAQ</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-full" onPress={() => handleMenuClick('contacts')}>
                    <Text className={burgerMenuElement}>Контакты</Text>
                </TouchableOpacity>

                <View className="w-full h-[1px] bg-white/10 my-4" />

                {isAuthenticated ? (
                    <View className="w-full px-6 py-3 flex-row items-center justify-between bg-white/5 rounded-xl mb-4">
                        <Text className="text-white text-[15px] font-medium opacity-90 max-w-[60%] commits" numberOfLines={1}>
                            {user?.first_name}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setIsMenuOpen(false);
                                logout();
                            }}
                            className="bg-white/10 px-3 py-1.5 rounded-lg active:opacity-70"
                        >
                            <Text className="text-white/60 text-[13px]">Выйти</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        className="w-full h-[46px] rounded-[14px] border border-white/20 items-center justify-center mb-4 active:bg-white/5"
                        onPress={() => {
                            setIsMenuOpen(false);
                            setIsAuthModalOpen(true);
                        }}
                    >
                        <Text className="text-white text-[15px] font-normal">Войти в аккаунт</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    className={burgerCtaButton}
                    onPress={() => handleMenuClick('booking')}
                    activeOpacity={0.8}
                >
                    <Text className={burgerCtaButtonText}>Забронировать</Text>
                </TouchableOpacity>
            </Animated.View>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};