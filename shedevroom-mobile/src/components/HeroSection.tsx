import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
    heroContainer,
    heroChildPic,
    heroTextContainer,
    heroTitle,
    heroDesc,
    heroCtaButton,
    heroCtaButtonText,
    heroExcursionButton,
    heroExcursionButtonText
} from "../styles/heroStyles";

interface HeroSectionProps {
    onScrollToSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToSection }) => {
    return (
        <View className={heroContainer}>

            <Image
                source={require('../assets/child.png')}
                className={heroChildPic}
            />

            <View className={heroTextContainer}>
                <Text className={heroTitle}>
                    Играйте.{"\n"}
                    Празднуйте.{"\n"}
                    Побеждайте.
                </Text>

                <Text className={heroDesc}>
                    Современная VR-арена в Архангельске для компаний любого масштаба.
                </Text>

                <TouchableOpacity
                    className={heroCtaButton}
                    onPress={() => onScrollToSection('booking')}
                    activeOpacity={0.8}
                >
                    <Text className={heroCtaButtonText}>Забронировать</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={heroExcursionButton}
                    onPress={() => onScrollToSection('arena')}
                    activeOpacity={0.8}
                >
                    <Text className={heroExcursionButtonText}>Онлайн-экскурсия</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};