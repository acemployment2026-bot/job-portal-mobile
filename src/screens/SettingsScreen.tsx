import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { ArrowLeft, Bell, Lock, User, FileText, HelpCircle, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }: any) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    const SettingItem = ({ icon: Icon, title, type = 'link', value = false, onValueChange, onPress, color = COLORS.primary }: any) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={type === 'link' ? onPress : undefined}
            activeOpacity={type === 'link' ? 0.7 : 1}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: type === 'danger' ? '#FFEBEE' : COLORS.inputBg }]}>
                    <Icon size={20} color={type === 'danger' ? '#D32F2F' : color} />
                </View>
                <Text style={[styles.settingLabel, type === 'danger' && { color: '#D32F2F' }]}>{title}</Text>
            </View>

            {type === 'toggle' && (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <SettingItem
                        icon={User}
                        title="Edit Profile"
                        onPress={() => navigation.navigate('EditProfile')}
                    />
                    <SettingItem
                        icon={Lock}
                        title="Change Password"
                        onPress={() => navigation.navigate('ChangePassword')}
                    />
                    <SettingItem
                        icon={FileText}
                        title="Privacy Policy"
                        onPress={() => Linking.openURL('https://jobsearchindia.in/privacy').catch(() => {
                            Alert.alert('Error', 'Could not open Privacy Policy. Please visit our website.');
                        })}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <SettingItem
                        icon={Bell}
                        title="Push Notifications"
                        type="toggle"
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <SettingItem
                        icon={HelpCircle}
                        title="Help Center"
                        onPress={() => Alert.alert('Info', 'Help Center')}
                    />
                </View>

                <View style={[styles.section, { marginTop: 20 }]}>
                    <SettingItem
                        icon={LogOut}
                        title="Logout"
                        type="danger"
                        onPress={handleLogout}
                    />
                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xl,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.inputBg,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
    },
    content: {
        padding: SPACING.xl,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textMuted,
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        marginBottom: 8,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    },
});

export default SettingsScreen;
