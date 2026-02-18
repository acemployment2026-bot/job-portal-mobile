import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ArrowLeft, ChevronRight, MapPin } from 'lucide-react-native';
import config from '../config';
import { fetchWithAuth } from '../api/api';

const { width } = Dimensions.get('window');

const TABS = ['Shortlisted', 'Applied', 'Interview', 'Rejected'];

const ApplicationsScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState('Shortlisted');
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) return;
            const user = JSON.parse(userData);

            const response = await fetchWithAuth(`${config.API_BASE_URL}/applications/my/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchApplications();
        setRefreshing(false);
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Application Tracking</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tabItem,
                                activeTab === tab && styles.activeTabItem
                            ]}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText
                            ]}>
                                {tab}
                            </Text>
                            {activeTab === tab && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                    }
                >
                    {applications.filter(app => app.status === activeTab).length > 0 ? (
                        applications.filter(app => app.status === activeTab).map((item) => (
                            <TouchableOpacity key={item.id} style={styles.appCard}>
                                <View style={styles.cardHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.jobTitle}>{item.job_title || item.title || 'Job Application'}</Text>
                                        <View style={styles.companyRow}>
                                            <Text style={styles.companyName}>{item.company_name || item.company || 'Unknown Company'}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                                    </View>
                                </View>

                                <View style={styles.locationRow}>
                                    <MapPin size={16} color={COLORS.textMuted} />
                                    <Text style={styles.locationText}>{item.location || 'Chennai, India'}</Text>
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.updatedText}>Applied: {new Date(item.applied_at || Date.now()).toLocaleDateString()}</Text>
                                    <ChevronRight size={20} color={COLORS.gray} />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No applications found in {activeTab}</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView >
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
        paddingHorizontal: SPACING.lg,
        paddingTop: 20,
        paddingBottom: 20,
    },
    backBtn: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    tabContainer: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    tabScroll: {
        paddingHorizontal: SPACING.lg,
    },
    tabItem: {
        marginRight: 24,
        paddingVertical: 12,
        position: 'relative',
    },
    activeTabItem: {
        // borderBottomWidth: 2,
        // borderBottomColor: COLORS.primary,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 1.5,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: '800',
    },
    listContent: {
        padding: SPACING.lg,
        paddingBottom: 100,
    },
    appCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 4,
        lineHeight: 24,
    },
    companyRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    companyName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        opacity: 0.7,
    },
    statusBadge: {
        backgroundColor: '#FFE5E5', // Light red background for shortlisted
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.secondary,
        letterSpacing: 0.5,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginLeft: 6,
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
    },
    updatedText: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
});

export default ApplicationsScreen;
