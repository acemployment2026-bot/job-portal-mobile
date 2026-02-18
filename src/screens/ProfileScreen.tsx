import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { LogOut, User, FileText, ChevronRight, Settings, Trash2 } from 'lucide-react-native';

const ProfileScreen = ({ navigation }: any) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Failed to load user', error);
            }
        };
        loadUser();
    }, []);

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* User Info */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <User size={40} color={COLORS.primary} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user?.full_name || 'Candidate Name'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
                        <Text style={styles.userRole}>{user?.role || 'Candidate'}</Text>
                    </View>
                </View>

                {/* Settings Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Resume')}>
                        <View style={styles.menuIconInfo}>
                            <View style={styles.iconBox}>
                                <FileText size={20} color={COLORS.primary} />
                            </View>
                            <Text style={styles.menuText}>My Resume</Text>
                        </View>
                        <ChevronRight size={20} color={COLORS.gray} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
                        <View style={styles.menuIconInfo}>
                            <View style={styles.iconBox}>
                                <Settings size={20} color={COLORS.primary} />
                            </View>
                            <Text style={styles.menuText}>Account Settings</Text>
                        </View>
                        <ChevronRight size={20} color={COLORS.gray} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <View style={styles.menuIconInfo}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                                <LogOut size={20} color="#D32F2F" />
                            </View>
                            <Text style={[styles.menuText, { color: '#D32F2F' }]}>Logout</Text>
                        </View>
                    </TouchableOpacity>
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
        paddingHorizontal: SPACING.xl,
        paddingVertical: 20,
        backgroundColor: COLORS.white,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: 100,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        padding: 24,
        borderRadius: 24,
        marginBottom: 32,
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    userRole: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    menuIconInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.inputBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    },
});

export default ProfileScreen;
