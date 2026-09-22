import React from "react";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturiesSection";
import { ArenaSection } from "../components/ArenaSection";
import { TariffsSection } from "../components/TariffsSection";
import { BookingSection } from "../components/BookingSection";
import { FaqSection } from "../components/FaqSection";
import { Footer } from "../components/Footer";
import { mainWrapper } from "../styles/mainStyles";

export const Home: React.FC = () => {
    return (
        <div className={mainWrapper}>
            <Header />

            <HeroSection />

            <FeaturesSection />

            <ArenaSection />

            <TariffsSection />

            <BookingSection />

            <FaqSection />

            <Footer />
        </div>
    );
};