import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react-native';
import { fetchWithAuth } from '../api/api';
import config from '../config';

const ChangePasswordScreen = ({ navigation }: any) => {
    const [saving, setSaving] = useState(false);
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChangePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwords;

        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }

        setSaving(true);
        try {
            const response = await fetchWithAuth(`${config.API_BASE_URL}/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Password changed successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change Password</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            Your new password must be different from your previously used passwords.
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password</Text>
                        <View style={styles.inputWrapper}>
                            <Lock size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={passwords.currentPassword}
                                onChangeText={(text) => setPasswords({ ...passwords, currentPassword: text })}
                                placeholder="Enter current password"
                                secureTextEntry={!showPass.current}
                            />
                            <TouchableOpacity onPress={() => setShowPass({ ...showPass, current: !showPass.current })}>
                                {showPass.current ? <EyeOff size={20} color={COLORS.gray} /> : <Eye size={20} color={COLORS.gray} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.inputWrapper}>
                            <Lock size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={passwords.newPassword}
                                onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })}
                                placeholder="Enter new password"
                                secureTextEntry={!showPass.new}
                            />
                            <TouchableOpacity onPress={() => setShowPass({ ...showPass, new: !showPass.new })}>
                                {showPass.new ? <EyeOff size={20} color={COLORS.gray} /> : <Eye size={20} color={COLORS.gray} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <View style={styles.inputWrapper}>
                            <Lock size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={passwords.confirmPassword}
                                onChangeText={(text) => setPasswords({ ...passwords, confirmPassword: text })}
                                placeholder="Confirm new password"
                                secureTextEntry={!showPass.confirm}
                            />
                            <TouchableOpacity onPress={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}>
                                {showPass.confirm ? <EyeOff size={20} color={COLORS.gray} /> : <Eye size={20} color={COLORS.gray} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={handleChangePassword}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.saveBtnText}>Update Password</Text>
                        )}
                    </TouchableOpacity>
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
    },
    infoBox: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textMuted,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '500',
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 4,
    },
    saveBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    }
});

export default ChangePasswordScreen;
