import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ShieldCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }: any) => {
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Wait for a minimum time to show splash
                await new Promise(resolve => setTimeout(resolve, 2000));

                const token = await AsyncStorage.getItem('token');
                const userData = await AsyncStorage.getItem('user');

                if (token && userData) {
                    const user = JSON.parse(userData);
                    if (user.role === 'user') {
                        navigation.replace('Main');
                    } else {
                        // If token exists but not user role, clear and go to Onboarding
                        await AsyncStorage.clear();
                        navigation.replace('Onboarding');
                    }
                } else {
                    navigation.replace('Onboarding');
                }
            } catch (error) {
                navigation.replace('Onboarding');
            }
        };

        checkAuth();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <ShieldCheck size={64} color={COLORS.primary} strokeWidth={1.5} />
                </View>
                <Text style={styles.title}>ACE FINS TECH{'\n'}SOLUTION</Text>
                <Text style={styles.subtitle}>CHENNAI CAREERS APP</Text>
            </View>
            <View style={styles.footer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        marginTop: -100,
    },
    logoContainer: {
        marginBottom: 24,
        padding: 20,
        backgroundColor: '#F8F9FA',
        borderRadius: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.primary,
        textAlign: 'center',
        letterSpacing: -0.5,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.secondary,
        marginTop: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    footer: {
        position: 'absolute',
        bottom: 80,
    },
});

export default SplashScreen;
