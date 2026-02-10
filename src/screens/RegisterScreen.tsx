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
import { ArrowLeft, MapPin, Eye, EyeOff } from 'lucide-react-native';

const RegisterScreen = ({ navigation }: any) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.fixedContent}>
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join ACE FINS TECH SOLUTION</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor={COLORS.gray}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="example@email.com"
                                placeholderTextColor={COLORS.gray}
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <View style={styles.phoneInputRow}>
                                <View style={styles.prefixBox}>
                                    <Text style={styles.prefixText}>+91</Text>
                                </View>
                                <TextInput
                                    style={styles.phoneInput}
                                    placeholder="98765 43210"
                                    placeholderTextColor={COLORS.gray}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location</Text>
                            <View style={styles.locationInputRow}>
                                <TextInput
                                    style={styles.locationInput}
                                    placeholder="Chennai, Tamil Nadu"
                                    placeholderTextColor={COLORS.gray}
                                />
                                <MapPin size={20} color={COLORS.gray} />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordInputRow}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="••••••••"
                                    placeholderTextColor={COLORS.gray}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} color={COLORS.gray} /> : <Eye size={20} color={COLORS.gray} />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={() => navigation.navigate('Main')}
                        >
                            <Text style={styles.submitBtnText}>Create Account</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Log In</Text>
                        </TouchableOpacity>
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
        paddingTop: Platform.OS === 'ios' ? 40 : 10,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginBottom: 20,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: SIZES.h1,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: SIZES.body,
        color: COLORS.textMuted,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: SIZES.small,
        fontWeight: '600',
        color: COLORS.textMuted,
        marginBottom: 8,
    },
    input: {
        height: 56,
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: SIZES.body,
        color: COLORS.text,
    },
    phoneInputRow: {
        flexDirection: 'row',
        height: 56,
    },
    prefixBox: {
        width: 60,
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    prefixText: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: COLORS.text,
    },
    phoneInput: {
        flex: 1,
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: SIZES.body,
        color: COLORS.text,
    },
    locationInputRow: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    locationInput: {
        flex: 1,
        fontSize: SIZES.body,
        color: COLORS.text,
    },
    passwordInputRow: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    passwordInput: {
        flex: 1,
        fontSize: SIZES.body,
        color: COLORS.text,
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    submitBtnText: {
        color: COLORS.white,
        fontSize: SIZES.body,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        color: COLORS.textMuted,
        fontSize: SIZES.body,
    },
    loginText: {
        color: COLORS.secondary,
        fontSize: SIZES.body,
        fontWeight: '700',
    },
});

export default RegisterScreen;
