import React from 'react';
import { View, Text, Image, Pressable, Linking } from 'react-native';
import {
    footerContactsCol,
    footerContactText,
    footerContainer,
    footerLegalLink,
    footerLogoCol,
    footerSocialBtn,
    footerSocialRow,
    footerSocialsCol,
    footerWrapper
} from '../styles/footerStyles';

import logo from '../assets/logo.png';
import vkLogo from '../assets/vk.png';
import tgLogo from '../assets/tg.png';
import instaLogo from '../assets/instagram.png';

interface FooterProps {
    onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection }) => {

    const openURL = (url: string) => {
        Linking.openURL(url).catch((err) => console.error('Ошибка открытия ссылки:', err));
    };

    return (
        <View className={footerWrapper}>
            <View className={footerContainer}>

                <View className={footerLogoCol}>
                    <Pressable onPress={() => onScrollToSection('hero')}>
                        <Image source={logo} style={{ width: 120, height: 34 }} />
                    </Pressable>
                </View>



                <View className={footerContactsCol}>
                    <Pressable onPress={() => openURL('tel:+79991234567')}>
                        <Text className={`${footerContactText} text-white font-hormal mt-6 mb-4`}>
                            +7 (999) 123-45-67
                        </Text>
                    </Pressable>
                    <Text className={footerContactText}>
                        ул. Тимме 1к3 г. Архангельск
                    </Text>
                    <Text className={`${footerContactText} text-white font-hormal mt-6 mb-4`}>
                        Работаем круглосуточно (24/7) по предварительной записи
                    </Text>
                </View>

                <View className={footerSocialsCol}>
                    <Pressable onPress={() => openURL('https://example.com/privacy')}>
                        <Text className={footerLegalLink}>Политика конфиденциальности</Text>
                    </Pressable>
                    <Pressable onPress={() => openURL('https://example.com/terms')}>
                        <Text className={footerLegalLink}>Пользовательское соглашение / Оферта</Text>
                    </Pressable>
                    <Pressable onPress={() => openURL('https://example.com/requisites')}>
                        <Text className={footerLegalLink}>Реквизиты (ИП / ООО, ИНН)</Text>
                    </Pressable>

                    <View className={footerSocialRow}>
                        <Pressable
                            onPress={() => openURL('https://t.me/shedevroom29')}
                            className={footerSocialBtn}
                        >
                            <Image source={tgLogo} style={{ width: 19, height: 17 }} resizeMode="contain" />
                        </Pressable>
                        <Pressable
                            onPress={() => openURL('https://vk.com/shedevroom29')}
                            className={footerSocialBtn}
                        >
                            <Image source={vkLogo} style={{ width: 22, height: 14 }} resizeMode="contain" />
                        </Pressable>
                        <Pressable
                            onPress={() => openURL('https://instagram.com/shedevroom29')}
                            className={footerSocialBtn}
                        >
                            <Image source={instaLogo} style={{ width: 20, height: 20 }} resizeMode="contain" />
                        </Pressable>
                    </View>
                </View>

            </View>
        </View>
    );
};