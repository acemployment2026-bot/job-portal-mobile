import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING } from '../constants/theme';
import { ArrowLeft, Bell, Lock, User, FileText, HelpCircle, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }: any) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [imgError, setImgError] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadUser = async () => {
                try {
                    const userData = await AsyncStorage.getItem('user');
                    if (userData) {
                        setUser(JSON.parse(userData));
                        setImgError(false); // reset on load
                    }
                } catch (error) {
                    console.error('Failed to load user', error);
                }
            };
            loadUser();
        }, [])
    );

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

    const hasValidImage = user?.profile_picture_url && user.profile_picture_url !== 'null' && !imgError;

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
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        {hasValidImage ? (
                            <Image
                                source={{ uri: user.profile_picture_url }}
                                style={styles.avatarImage}
                                onError={() => setImgError(true)}
                                resizeMode="cover"
                            />
                        ) : (
                            <User size={32} color={COLORS.primary} />
                        )}
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user?.full_name || 'User Name'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
                    </View>
                </View>

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
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: COLORS.inputBg,
        padding: 20,
        borderRadius: 20,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        overflow: 'hidden',
    },
    avatarImage: {
        width: 60,
        height: 60,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textMuted,
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
