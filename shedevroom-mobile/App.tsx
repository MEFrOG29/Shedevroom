import React, { useRef, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './src/components/Header';
import { HeroSection } from './src/components/HeroSection';
import { FeaturesSection } from './src/components/FeaturesSection';
import { ArenaSection } from './src/components/ArenaSection';
import { TariffsSection } from './src/components/TariffsSection';
import { BookingSection } from './src/components/BookingSection';

import { AuthProvider } from './src/context/AuthContext';
import { FaqSection } from './src/components/FaqSection';
import { Footer } from './src/components/Footer';

SplashScreen.preventAutoHideAsync().catch(() => { });

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Tight': require('./src/assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const scrollToSection = (sectionId: string) => {
    const yPosition = sectionPositions.current[sectionId];
    if (yPosition !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: yPosition,
        animated: true,
      });
    }
  };

  const handleLayout = (sectionId: string, y: number) => {
    sectionPositions.current[sectionId] = y;
  };

  return (
    <AuthProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style="light" hidden={true} />

        <Header onScrollToSection={scrollToSection} />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingTop: 40 }}
          stickyHeaderIndices={[]}
        >
          <HeroSection onScrollToSection={scrollToSection} />

          <View onLayout={(e) => handleLayout('about', e.nativeEvent.layout.y)}>
            <FeaturesSection />
          </View>

          <View onLayout={(e) => handleLayout('arena', e.nativeEvent.layout.y)}>
            <ArenaSection />
          </View>

          <View onLayout={(e) => handleLayout('tariffs', e.nativeEvent.layout.y)}>
            <TariffsSection onScrollToSection={scrollToSection} />
          </View>

          <View onLayout={(e) => handleLayout('booking', e.nativeEvent.layout.y)}>
            <BookingSection activeTariffFromCards="Тариф “СТАНДАРТ”" />
          </View>

          <View onLayout={(e) => handleLayout('faq', e.nativeEvent.layout.y)}>
            <FaqSection />
          </View>

          <Footer onScrollToSection={scrollToSection} />

        </ScrollView>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D3D3D',
  }
});