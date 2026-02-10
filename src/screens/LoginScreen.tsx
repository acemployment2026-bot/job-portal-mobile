import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ShieldCheck, Eye, EyeOff, LayoutGrid } from 'lucide-react-native';

const LoginScreen = ({ navigation }: any) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.fixedContent}>
                    {/* Logo Area */}
                    <View style={styles.header}>
                        <View style={styles.logoDiamond}>
                            <View style={styles.logoInner}>
                                <LayoutGrid size={32} color={COLORS.white} />
                            </View>
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>ACE FINS TECH SOLUTION</Text>
                    </View>

                    {/* Form Area */}
                    <View style={styles.formContainer}>
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email or Mobile Number"
                                    placeholderTextColor={COLORS.gray}
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Password"
                                        placeholderTextColor={COLORS.gray}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={20} color={COLORS.gray} /> : <Eye size={20} color={COLORS.gray} />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.forgotBtn}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.loginBtn}
                                onPress={() => navigation.navigate('Main')}
                            >
                                <Text style={styles.loginBtnText}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.otpBtn}
                                onPress={() => navigation.navigate('OtpLogin')}
                            >
                                <Text style={styles.otpBtnText}>Login with Email OTP</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.registerText}>Create New Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    fixedContent: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoDiamond: {
        width: 70,
        height: 70,
        backgroundColor: COLORS.primary,
        transform: [{ rotate: '45deg' }],
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 4,
        borderColor: '#E9ECEF',
    },
    logoInner: {
        width: 46,
        height: 46,
        backgroundColor: COLORS.secondary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: SIZES.h1,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: SIZES.small,
        fontWeight: '600',
        color: COLORS.textMuted,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    input: {
        height: 60,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: SIZES.body,
        color: COLORS.text,
    },
    passwordContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingHorizontal: 20,
    },
    passwordInput: {
        flex: 1,
        fontSize: SIZES.body,
        color: COLORS.text,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: SPACING.xl,
    },
    forgotText: {
        color: COLORS.secondary,
        fontWeight: '600',
        fontSize: SIZES.small,
    },
    loginBtn: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    loginBtnText: {
        color: COLORS.white,
        fontSize: SIZES.body,
        fontWeight: '700',
    },
    otpBtn: {
        backgroundColor: COLORS.white,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    otpBtnText: {
        color: COLORS.primary,
        fontSize: SIZES.body,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 60,
    },
    footerText: {
        color: COLORS.textMuted,
        fontSize: SIZES.body,
    },
    registerText: {
        color: COLORS.secondary,
        fontSize: SIZES.body,
        fontWeight: '700',
    },
});

export default LoginScreen;
