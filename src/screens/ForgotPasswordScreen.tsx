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
    Alert,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ArrowLeft, Lock, Eye, EyeOff, Mail } from 'lucide-react-native';
import config from '../config';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }: any) => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const handleRequestOtp = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.API_BASE_URL}/auth/request-password-reset-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Password reset code has been sent to your email.');
                setStep(2);
            } else {
                Alert.alert('Error', data.message || 'Failed to send reset code.');
            }
        } catch (error) {
            console.error('Error requesting reset OTP:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        const otpString = otp.join('');
        if (!otpString || otpString.length !== 6) {
            Alert.alert('Error', 'Please enter the 6-digit verification code.');
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.API_BASE_URL}/auth/reset-password-with-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp: otpString,
                    newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Your password has been reset successfully.', [
                    { text: 'Login Now', onPress: () => navigation.navigate('Login') }
                ]);
            } else {
                Alert.alert('Error', data.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Forgot Password</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {step === 1 ? (
                        <View style={styles.content}>
                            <View style={styles.iconContainer}>
                                <Mail size={40} color={COLORS.primary} />
                            </View>
                            <Text style={styles.title}>Password Recovery</Text>
                            <Text style={styles.subtitle}>Enter your email to receive a password reset code</Text>

                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor={COLORS.gray}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.primaryBtn}
                                onPress={handleRequestOtp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <Text style={styles.primaryBtnText}>Send Code</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.content}>
                            <View style={styles.iconContainer}>
                                <Lock size={40} color={COLORS.primary} />
                            </View>
                            <Text style={styles.title}>New Password</Text>
                            <Text style={styles.subtitle}>Enter the 6-digit code sent to your email and set a new password</Text>

                            {/* OTP Input */}
                            <View style={styles.otpSection}>
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

                            <View style={styles.inputGroup}>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="New Password"
                                        placeholderTextColor={COLORS.gray}
                                        secureTextEntry={!showPassword}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={20} color={COLORS.gray} /> : <Eye size={20} color={COLORS.gray} />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Confirm New Password"
                                        placeholderTextColor={COLORS.gray}
                                        secureTextEntry={!showPassword}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.primaryBtn}
                                onPress={handleResetPassword}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <Text style={styles.primaryBtnText}>Reset Password</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.resendBtn}
                                onPress={handleRequestOtp}
                                disabled={loading}
                            >
                                <Text style={styles.resendText}>Didn't receive code? Resend</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.inputBg,
    },
    backBtn: {
        padding: 8,
        marginLeft: -8,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
    },
    scrollContent: {
        padding: SPACING.xl,
        flexGrow: 1,
    },
    content: {
        alignItems: 'center',
        paddingTop: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.inputBg,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 56,
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '500',
    },
    otpSection: {
        width: '100%',
        marginBottom: 30,
    },
    label: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.primary,
        opacity: 0.6,
        letterSpacing: 1.5,
        marginBottom: 15,
        textAlign: 'center',
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
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        paddingBottom: 10,
    },
    passwordContainer: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        paddingHorizontal: 20,
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '500',
    },
    primaryBtn: {
        backgroundColor: COLORS.primary,
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
    resendBtn: {
        marginTop: 24,
    },
    resendText: {
        color: COLORS.primary,
        fontWeight: '600',
    }
});

export default ForgotPasswordScreen;
