import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { Wallet } from 'lucide-react-native';

import { Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const { width } = Dimensions.get('window');

const OtpLoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const handleSendOtp = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        setSending(true);
        try {
            const response = await fetch(`${config.API_BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'OTP has been sent to your email.');
            } else {
                Alert.alert('Error', data.message || 'Failed to send OTP.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (!email || otpString.length !== 6) {
            Alert.alert('Error', 'Please enter your email and the 6-digit OTP.');
            return;
        }

        setVerifying(true);
        try {
            const response = await fetch(`${config.API_BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: otpString }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('refreshToken', data.refreshToken);
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                navigation.navigate('Main');
            } else {
                Alert.alert('Error', data.message || 'Invalid OTP.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoBox}>
                            <Wallet size={32} color={COLORS.white} />
                        </View>
                        <View style={styles.headerTextCol}>
                            <Text style={styles.brandTitle}>ACE FINS</Text>
                            <Text style={styles.brandSubtitle}>TECH SOLUTION</Text>
                        </View>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.title}>Login with OTP</Text>
                        <Text style={styles.subtitle}>We'll send a code to your email</Text>

                        {/* Email Input */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <View style={styles.emailInputRow}>
                                <TextInput
                                    style={styles.emailInput}
                                    placeholder="name@email.com"
                                    placeholderTextColor={COLORS.gray}
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    style={styles.sendOtpBtn}
                                    onPress={handleSendOtp}
                                    disabled={sending}
                                >
                                    {sending ? (
                                        <ActivityIndicator size="small" color={COLORS.primary} />
                                    ) : (
                                        <Text style={styles.sendOtpText}>Send OTP</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* OTP Input */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>VERIFICATION CODE</Text>
                            <View style={styles.otpRow}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        style={styles.otpInput}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(val) => handleOtpChange(val, index)}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Action Button */}
                        <TouchableOpacity
                            style={styles.verifyBtn}
                            onPress={handleVerifyOtp}
                            disabled={verifying}
                        >
                            {verifying ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.verifyBtnText}>Verify OTP & Login</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginPassBtn}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginPassText}>Login with Password</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerText}>Create New Account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.xl,
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
        paddingBottom: 50,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 60,
    },
    logoBox: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    headerTextCol: {
        justifyContent: 'center',
    },
    brandTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
    },
    brandSubtitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.secondary,
    },
    content: {
        alignItems: 'center',
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
        marginBottom: 40,
    },
    inputSection: {
        width: '100%',
        marginBottom: 40,
    },
    label: {
        fontSize: SIZES.tiny,
        fontWeight: '800',
        color: COLORS.primary,
        opacity: 0.6,
        letterSpacing: 1.5,
        marginBottom: 15,
    },
    emailInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 10,
    },
    emailInput: {
        flex: 1,
        fontSize: SIZES.body + 2,
        color: COLORS.text,
    },
    sendOtpBtn: {
        backgroundColor: '#F1F3F5',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    sendOtpText: {
        fontSize: SIZES.small,
        color: COLORS.primary,
        fontWeight: '600',
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    otpInput: {
        width: (width - SPACING.xl * 2 - 50) / 6,
        height: 48,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.border,
        textAlign: 'center',
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.primary,
        paddingBottom: 10,
    },
    verifyBtn: {
        backgroundColor: COLORS.secondary,
        width: '100%',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    verifyBtnText: {
        color: COLORS.white,
        fontSize: SIZES.body,
        fontWeight: '700',
    },
    loginPassBtn: {
        marginTop: 10,
    },
    loginPassText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: SIZES.body,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 80,
    },
    footerText: {
        color: COLORS.textMuted,
        fontSize: SIZES.body,
    },
    registerText: {
        color: COLORS.primary,
        fontSize: SIZES.body,
        fontWeight: '800',
    },
});

export default OtpLoginScreen;
