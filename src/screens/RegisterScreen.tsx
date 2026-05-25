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
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ArrowLeft, MapPin, Eye, EyeOff } from 'lucide-react-native';
import config from '../config';

const RegisterScreen = ({ navigation }: any) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !password || !phone) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    location,
                    password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Account created successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('Login') }
                ]);
            } else {
                Alert.alert('Registration Failed', data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
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
                        <Text style={styles.subtitle}>Join Ace Employement</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor={COLORS.gray}
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="example@email.com"
                                placeholderTextColor={COLORS.gray}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
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
                                    value={phone}
                                    onChangeText={setPhone}
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
                                    value={location}
                                    onChangeText={setLocation}
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
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} color={COLORS.gray} /> : <Eye size={20} color={COLORS.gray} />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.submitBtnText}>Create Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Log In</Text>
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
        backgroundColor: COLORS.white,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.xl,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 30,
        justifyContent: 'center',
    },
    backBtn: {
        marginBottom: 20,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: SIZES.body,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        display: 'none', // Hiding labels for minimal look, rely on placeholders
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
    phoneInputRow: {
        flexDirection: 'row',
        height: 56,
    },
    prefixBox: {
        width: 70,
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    prefixText: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: COLORS.primary,
    },
    phoneInput: {
        flex: 1,
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: SIZES.body,
        color: COLORS.primary,
        fontWeight: '500',
    },
    locationInputRow: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        paddingHorizontal: 20,
    },
    locationInput: {
        flex: 1,
        fontSize: SIZES.body,
        color: COLORS.primary,
        fontWeight: '500',
    },
    passwordInputRow: {
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
    submitBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    submitBtnText: {
        color: COLORS.white,
        fontSize: 16,
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
        fontWeight: '500',
    },
    loginText: {
        color: COLORS.secondary,
        fontSize: SIZES.body,
        fontWeight: '700',
        marginLeft: 5,
    },
});

export default RegisterScreen;
