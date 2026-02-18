import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Platform,
    RefreshControl
} from 'react-native';
import config from '../config';
import { fetchWithAuth } from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import {
    ArrowLeft,
    Search,
    ChevronDown,
    MapPin,
    Briefcase,
    DollarSign,
    Clock,
    Briefcase as BriefcaseIcon,
    Home as HomeIcon,
    CheckSquare,
    Circle,
    User
} from 'lucide-react-native';

const JobListingsScreen = ({ navigation }: any) => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const url = `${config.API_BASE_URL}/jobs`;
            console.log('Fetching Jobs URL:', url);
            const response = await fetchWithAuth(url);

            const textFn = await response.text();
            try {
                const data = JSON.parse(textFn);
                if (response.ok) {
                    setJobs(data);
                } else {
                    console.error('Server error jobs:', data);
                }
            } catch (e) {
                console.error('JSON Parse Error Jobs:', e);
                console.log('Response returned HTML/Text:', textFn);
            }
        } catch (error: any) {
            console.error('Error fetching jobs:', error);
            if (error.message === 'Network request failed') {
                // Potentially a firewall issue
            }
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchJobs();
        setRefreshing(false);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Listings</Text>
                <TouchableOpacity style={styles.searchBtn}>
                    <Search size={22} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            >
                {/* Filters */}
                <View style={styles.filterRow}>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Text style={styles.filterText}>Category</Text>
                        <ChevronDown size={14} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Text style={styles.filterText}>Salary</Text>
                        <ChevronDown size={14} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Text style={styles.filterText}>Experience</Text>
                        <ChevronDown size={14} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.categoryLabel}>CHENNAI CAREERS</Text>

                {/* Job List */}
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
                ) : (
                    jobs.map((job) => (
                        <View key={job.id} style={styles.jobCard}>
                            <View style={[styles.jobCardHeader, { justifyContent: 'space-between', alignItems: 'center' }]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.jobTitle}>{job.title}</Text>
                                    <Text style={styles.companyName}>{job.company}</Text>
                                </View>
                                {((new Date().getTime() - new Date(job.created_at).getTime()) / (1000 * 3600 * 24) < 7) && (
                                    <View style={styles.newBadge}>
                                        <Text style={styles.newBadgeText}>NEW</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.jobInfoGrid}>
                                <View style={styles.infoRow}>
                                    <MapPin size={16} color={COLORS.gray} />
                                    <Text style={styles.infoText}>{job.location?.split(',')[0]}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <DollarSign size={16} color={COLORS.gray} />
                                    <Text style={styles.infoText}>{job.salary}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Briefcase size={16} color={COLORS.gray} />
                                    <Text style={styles.infoText}>{job.type}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <HomeIcon size={16} color={COLORS.gray} />
                                    <Text style={styles.infoText}>{job.modality || 'On-site'}</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.applyBtn}
                                onPress={() => navigation.navigate('JobDetails', { job })}
                            >
                                <Text style={styles.applyBtnText}>Apply Now</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
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
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        backgroundColor: COLORS.white,
        zIndex: 10,
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: COLORS.inputBg,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    searchBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.inputBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: 100,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 25,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
        marginRight: 6,
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textMuted,
        letterSpacing: 1.5,
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    jobCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
    },
    jobCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 6,
    },
    companyName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    newBadge: {
        backgroundColor: COLORS.inputBg,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    newBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: 0.5,
    },
    jobInfoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },
    infoRow: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 13,
        color: COLORS.primary,
        opacity: 0.7,
        marginLeft: 8,
        fontWeight: '600',
    },
    applyBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    applyBtnText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
    }
});

export default JobListingsScreen;
