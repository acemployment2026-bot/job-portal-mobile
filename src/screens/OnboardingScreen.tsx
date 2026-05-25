import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { Map, MapPin } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>

            {/* Illustration Area */}
            <View style={styles.illustrationContainer}>
                <View style={styles.mapContainer}>
                    <Map size={160} color={COLORS.primary} strokeWidth={0.8} />
                    <View style={styles.pinContainer}>
                        <MapPin size={48} color="#FF1E1E" fill="#FF1E1E" />
                    </View>
                </View>
                {/* Decorative circles */}
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </View>

            {/* Text Context */}
            <View style={styles.content}>
                <Text style={styles.title}>Ace Employement</Text>
                <Text style={styles.description}>
                    Discover premium opportunities at the heart of South India's tech hub.
                </Text>
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
        backgroundColor: COLORS.white,
    },
    illustrationContainer: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    mapContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    pinContainer: {
        position: 'absolute',
        top: '25%',
        shadowColor: '#FF1E1E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.primary,
        opacity: 0.05,
    },
    circle1: {
        width: 300,
        height: 300,
    },
    circle2: {
        width: 400,
        height: 400,
    },
    content: {
        flex: 0.8,
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 44,
        letterSpacing: -1,
    },
    description: {
        fontSize: 16,
        color: COLORS.textMuted,
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 20,
        fontWeight: '500',
    },
    footer: {
        padding: SPACING.xl,
        paddingBottom: 50,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    secondaryButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default OnboardingScreen;
