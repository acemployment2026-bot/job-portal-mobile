import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../config';
import { fetchWithAuth } from '../api/api';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import {
    Search,
    MapPin,
    User,
    Bookmark,
    LayoutGrid,
    Briefcase,
    FileText,
    Bell,
    Settings,
    PlusSquare,
    ClipboardList,
    Home as HomeIcon,
    CheckSquare
} from 'lucide-react-native';
import { useNotifications } from '../hooks/useNotifications';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
    useNotifications(); // Initialize push notifications
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                await fetchDashboardData(parsedUser.id);
            }
        } catch (error) {
            console.error('Failed to load user', error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const fetchDashboardData = async (userId: string) => {
        try {
            const url = `${config.API_BASE_URL}/dashboard/candidate/${userId}`;
            // console.log('Fetching URL:', url); // Removed verbose logging
            const response = await fetchWithAuth(url);

            const textFn = await response.text();
            try {
                const data = JSON.parse(textFn);
                if (response.ok) {
                    setStats(data.stats);
                    setRecommendedJobs(data.recommendedJobs || []);
                } else {
                    console.error('Server error:', data);
                }
            } catch (e) {
                console.error('JSON Parse Error:', e);
                console.log('Response returned HTML/Text:', textFn);
            }
        } catch (error: any) {
            console.error('Error fetching dashboard data:', error);
            if (error.message === 'Network request failed') {
                // Handle network failure (potential firewall issue or wrong IP)
                // console.warn('Network request failed. Check firewall/IP settings.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <View style={styles.locationRow}>
                        <MapPin size={14} color={COLORS.primary} />
                        <Text style={styles.locationText}>CHENNAI, TAMIL NADU</Text>
                    </View>
                    <Text style={styles.greeting}>Hi {user?.full_name?.split(' ')[0] || 'User'}</Text>
                </View>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={() => navigation.navigate('ProfileTab')}
                >
                    <View style={styles.avatar}>
                        <User size={24} color={COLORS.primary} />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            >
                {/* Recommended Jobs */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recommended Jobs</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('JobsTab', { screen: 'JobListings' })}>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScroll}>
                    {recommendedJobs.length > 0 ? (
                        recommendedJobs.map((job) => (
                            <TouchableOpacity
                                key={job.id}
                                style={styles.jobCard}
                                onPress={() => navigation.navigate('JobsTab', {
                                    screen: 'JobDetails',
                                    params: { job }
                                })}
                            >
                                <View style={styles.jobCardTop}>
                                    <View style={[styles.companyLogo, { backgroundColor: COLORS.primary }]}>
                                        <Text style={styles.logoText}>{job.company?.substring(0, 2).toUpperCase()}</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <Bookmark size={20} color={COLORS.gray} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                                <Text style={styles.companyName} numberOfLines={1}>{job.company}</Text>
                                <View style={styles.tagRow}>
                                    <View style={[styles.tag, { backgroundColor: '#F1F3F5' }]}>
                                        <Text style={[styles.tagText, { color: COLORS.primary }]} numberOfLines={1}>
                                            {job.location?.split(',')[0]}
                                        </Text>
                                    </View>
                                    <View style={[styles.tag, { backgroundColor: '#FFF9DB' }]}>
                                        <Text style={[styles.tagText, { color: '#F59F00' }]}>{job.type || 'Full-time'}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={{ marginLeft: 20, color: COLORS.gray }}>No recommended jobs found</Text>
                    )}
                </ScrollView>


                {/* Quick Links */}
                <Text style={styles.sectionTitle}>Quick Links</Text>
                <View style={styles.quickLinksGrid}>
                    <TouchableOpacity
                        style={styles.linkCard}
                        onPress={() => navigation.navigate('ProfileTab')}
                    >
                        <View style={styles.linkIconBox}>
                            <User size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.linkLabel}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkCard}
                        onPress={() => navigation.navigate('Resume')}
                    >
                        <View style={styles.linkIconBox}>
                            <FileText size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.linkLabel}>Resume</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkCard}
                        onPress={() => navigation.navigate('SavedTab')}
                    >
                        <View style={styles.linkIconBox}>
                            <Briefcase size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.linkLabel}>Applications</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkCard}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <View style={styles.linkIconBox}>
                            <Bell size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.linkLabel}>Notifications</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        marginLeft: 6,
        opacity: 0.5,
        letterSpacing: 0.5,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: 120,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 20,
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 35,
        height: 56,
    },
    searchIcon: {
        marginRight: 12,
        opacity: 0.5,
    },
    searchInput: {
        flex: 1,
        fontSize: SIZES.body,
        color: COLORS.primary,
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    seeAll: {
        color: COLORS.secondary,
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    recommendedScroll: {
        marginBottom: 40,
        marginLeft: -SPACING.lg, // align with screen edge scroll
        paddingLeft: SPACING.lg,
    },
    jobCard: {
        width: width * 0.75,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        marginRight: 20,
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
        // shadowColor: COLORS.primary,
        // shadowOffset: { width: 0, height: 10 },
        // shadowOpacity: 0.05,
        // shadowRadius: 20,
        // elevation: 2,
    },
    jobCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    companyLogo: {
        width: 50,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: COLORS.white,
        fontWeight: '900',
        fontSize: 14,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 6,
        lineHeight: 24,
    },
    companyName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
        marginBottom: 20,
    },
    tagRow: {
        flexDirection: 'row',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginRight: 10,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    companiesScroll: {
        marginBottom: 40,
        marginLeft: -SPACING.lg,
        paddingLeft: SPACING.lg,
    },
    companyItem: {
        alignItems: 'center',
        marginRight: 24,
    },
    companyCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: COLORS.inputBg,
    },
    circleText: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: '800',
    },
    companyLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
        textAlign: 'center',
    },
    quickLinksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    linkCard: {
        width: '48%',
        backgroundColor: COLORS.inputBg,
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 16,
    },
    linkIconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    linkLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    }
});

export default HomeScreen;
