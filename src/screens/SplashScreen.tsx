import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ShieldCheck } from 'lucide-react-native';

const SplashScreen = ({ navigation }: any) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Onboarding');
        }, 2500);
        return () => clearTimeout(timer);
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
        marginBottom: SPACING.xl,
        padding: SPACING.md,
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
    },
    title: {
        fontSize: SIZES.h2 + 4,
        fontWeight: '800',
        color: COLORS.primary,
        textAlign: 'center',
        letterSpacing: 1.5,
        lineHeight: 36,
    },
    subtitle: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: COLORS.secondary,
        marginTop: SPACING.sm,
        letterSpacing: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 80,
    },
});

export default SplashScreen;
