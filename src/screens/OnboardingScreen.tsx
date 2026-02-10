import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { Building2, Landmark, Mountain } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>

            {/* Illustration Area */}
            <View style={styles.illustrationContainer}>
                <View style={styles.buildings}>
                    <Building2 size={120} color={COLORS.primary} strokeWidth={1} />
                    <Landmark size={80} color={COLORS.primary} strokeWidth={1} style={{ marginLeft: -20 }} />
                    <Mountain size={60} color={COLORS.primary} strokeWidth={1} style={{ marginLeft: -10, marginBottom: -10 }} />
                </View>
                <View style={styles.cityLine} />
            </View>

            {/* Text Context */}
            <View style={styles.content}>
                <Text style={styles.title}>Find Jobs in{'\n'}Chennai</Text>
                <Text style={styles.description}>
                    Discover premium opportunities at the heart of South India's tech hub.
                </Text>

                {/* Indicators */}
                <View style={styles.indicatorContainer}>
                    <View style={[styles.indicator, styles.activeIndicator]} />
                    <View style={styles.indicator} />
                    <View style={styles.indicator} />
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.secondaryButtonText}>Log In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    illustrationContainer: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buildings: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 40,
    },
    cityLine: {
        width: width * 0.8,
        height: 2,
        backgroundColor: COLORS.primary,
        opacity: 0.1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    title: {
        fontSize: SIZES.h1,
        fontWeight: '800',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: SPACING.md,
        lineHeight: 40,
    },
    description: {
        fontSize: SIZES.body + 1,
        color: COLORS.textMuted,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: SPACING.xl,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    indicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.border,
        marginHorizontal: 4,
    },
    activeIndicator: {
        width: 24,
        backgroundColor: COLORS.secondary,
    },
    footer: {
        padding: SPACING.xl,
        paddingBottom: 50,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: SIZES.body,
        fontWeight: '700',
    },
    secondaryButton: {
        marginTop: SPACING.lg,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: COLORS.textMuted,
        fontSize: SIZES.body,
        fontWeight: '600',
    },
});

export default OnboardingScreen;
