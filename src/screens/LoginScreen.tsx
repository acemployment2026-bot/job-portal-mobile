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
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ShieldCheck, Eye, EyeOff, LayoutGrid } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
            const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const text = await response.text();
            try {
                const data = JSON.parse(text);

                if (response.ok) {
                    // Ensure only candidates/users can login to mobile app
                    if (data.user.role !== 'user') {
                        Alert.alert('Access Denied', 'This app is for candidates only. Please use the web portal.');
                        return;
                    }

                    // Store token and user data
                    await AsyncStorage.setItem('token', data.token);
                    if (data.refreshToken) {
                        await AsyncStorage.setItem('refreshToken', data.refreshToken);
                    }
                    await AsyncStorage.setItem('user', JSON.stringify(data.user));

                    // Navigate to Main Tab Navigator
                    navigation.replace('Main');
                } else {
                    Alert.alert('Login Failed', data.message || 'Invalid credentials');
                }
            } catch (e) {
                console.error('Login JSON Parse Error:', e);
                console.log('Login Response Text:', text); // Log the HTML or text
                Alert.alert('Error', 'Server returned an invalid response. Please check server logs.');
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                Alert.alert('Error', 'Request timed out. Please check your internet connection.');
            } else {
                console.error('Login Error:', error);
                Alert.alert('Error', 'Network error. Please try again.');
            }
        } finally {
            setLoading(false);
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
                    {/* Logo Area */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/logo.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        {/* <Text style={styles.subtitle}>Job Search India</Text> */}
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
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Password"
                                        placeholderTextColor={COLORS.gray}
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={20} color={COLORS.gray} /> : <Eye size={20} color={COLORS.gray} />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.forgotBtn}
                                onPress={() => navigation.navigate('ForgotPassword')}
                            >
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.loginBtn}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <Text style={styles.loginBtnText}>Login</Text>
                                )}
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.xl,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 30,
        justifyContent: 'center',
    },
    formContainer: {
        width: '100%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: SIZES.small,
        fontWeight: '600',
        color: COLORS.textMuted,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    input: {
        height: 56,
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: SIZES.body,
        color: COLORS.primary,
        fontWeight: '500',
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
        fontSize: SIZES.body,
        color: COLORS.primary,
        fontWeight: '500',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginTop: -10,
        marginBottom: 30,
    },
    forgotText: {
        color: COLORS.textMuted,
        fontWeight: '600',
        fontSize: SIZES.small,
    },
    loginBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    loginBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    otpBtn: {
        backgroundColor: COLORS.white,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
    },
    otpBtnText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    footerText: {
        color: COLORS.textMuted,
        fontSize: SIZES.body,
        fontWeight: '500',
    },
    registerText: {
        color: COLORS.secondary,
        fontSize: SIZES.body,
        fontWeight: '700',
        marginLeft: 5,
    },
});

export default LoginScreen;
