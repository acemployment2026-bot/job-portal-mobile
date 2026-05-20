import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Platform,
    RefreshControl,
    Modal,
    Animated,
    Dimensions,
    Image
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
    Home as HomeIcon,
    X
} from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const JobListingsScreen = ({ navigation }: any) => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [activeFilters, setActiveFilters] = useState<any>({
        category: 'All',
        salary: 'Any',
        experience: 'Any'
    });

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState<any>({ type: '', title: '', options: [] });

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [jobs, searchQuery, activeFilters]);

    // Dynamic Filter Options
    const filterOptions = useMemo(() => {
        const categories = new Set(['All']);
        const salaries = new Set(['Any']);
        const experiences = new Set(['Any']);

        jobs.forEach(job => {
            if (job.department) categories.add(job.department);
            if (job.category) categories.add(job.category);
            if (job.salary) salaries.add(job.salary);
            if (job.experience) experiences.add(job.experience);
        });

        return {
            category: Array.from(categories),
            salary: Array.from(salaries),
            experience: Array.from(experiences)
        };
    }, [jobs]);

    const fetchJobs = async () => {
        try {
            const url = `${config.API_BASE_URL}/jobs`;
            const response = await fetchWithAuth(url);
            const textFn = await response.text();
            try {
                const data = JSON.parse(textFn);
                if (response.ok) {
                    setJobs(data);
                    setFilteredJobs(data);
                }
            } catch (e) {
                console.error('JSON Parse Error Jobs:', e);
            }
        } catch (error: any) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...jobs];

        if (searchQuery) {
            result = result.filter(job =>
                job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (activeFilters.category !== 'All') {
            result = result.filter(job => job.department === activeFilters.category || job.category === activeFilters.category);
        }

        if (activeFilters.salary !== 'Any') {
            result = result.filter(job => job.salary === activeFilters.salary);
        }

        if (activeFilters.experience !== 'Any') {
            result = result.filter(job => job.experience === activeFilters.experience);
        }

        setFilteredJobs(result);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchJobs();
        setRefreshing(false);
    }, []);

    const openFilterModal = (type: string) => {
        const title = type.charAt(0).toUpperCase() + type.slice(1);
        setModalConfig({
            type,
            title: `Filter by ${title}`,
            options: filterOptions[type as keyof typeof filterOptions]
        });
        setModalVisible(true);
    };

    const selectOption = (option: string) => {
        setActiveFilters((prev: any) => ({ ...prev, [modalConfig.type]: option }));
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>

                {!showSearch ? (
                    <>
                        <Text style={styles.headerTitle}>Job Listings</Text>
                        <TouchableOpacity style={styles.searchBtn} onPress={() => setShowSearch(true)}>
                            <Search size={22} color={COLORS.primary} />
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                        <TouchableOpacity onPress={() => {
                            setShowSearch(false);
                            setSearchQuery('');
                        }}>
                            <X size={20} color={COLORS.gray} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            >
                {/* Filters Row */}
                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.filterBtn, activeFilters.category !== 'All' && styles.activeFilterBtn]}
                        onPress={() => openFilterModal('category')}
                    >
                        <Text style={[styles.filterText, activeFilters.category !== 'All' && styles.activeFilterText]} numberOfLines={1}>
                            {activeFilters.category === 'All' ? 'Category' : activeFilters.category}
                        </Text>
                        <ChevronDown size={14} color={activeFilters.category !== 'All' ? COLORS.white : COLORS.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterBtn, activeFilters.salary !== 'Any' && styles.activeFilterBtn]}
                        onPress={() => openFilterModal('salary')}
                    >
                        <Text style={[styles.filterText, activeFilters.salary !== 'Any' && styles.activeFilterText]} numberOfLines={1}>
                            {activeFilters.salary === 'Any' ? 'Salary' : activeFilters.salary}
                        </Text>
                        <ChevronDown size={14} color={activeFilters.salary !== 'Any' ? COLORS.white : COLORS.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterBtn, activeFilters.experience !== 'Any' && styles.activeFilterBtn]}
                        onPress={() => openFilterModal('experience')}
                    >
                        <Text style={[styles.filterText, activeFilters.experience !== 'Any' && styles.activeFilterText]} numberOfLines={1}>
                            {activeFilters.experience === 'Any' ? 'Experience' : activeFilters.experience}
                        </Text>
                        <ChevronDown size={14} color={activeFilters.experience !== 'Any' ? COLORS.white : COLORS.primary} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.categoryLabel}>
                    {filteredJobs.length} Jobs matching your search
                </Text>

                {/* Job List */}
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
                ) : (
                    filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <TouchableOpacity
                                key={job.id}
                                style={styles.jobCard}
                                onPress={() => navigation.navigate('JobDetails', { job })}
                                activeOpacity={0.7}
                            >
                                <View style={styles.jobCardHeader}>
                                    <View style={styles.companyLogo}>
                                        {job.logo_url ? (
                                            <Image source={{ uri: job.logo_url }} style={styles.logoImage} />
                                        ) : (
                                            <Image source={require('../../assets/icon.png')} style={styles.logoImage} />
                                        )}
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
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

                                <View style={styles.applyBtn}>
                                    <Text style={styles.applyBtnText}>View Details</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.noResults}>
                            <Search size={48} color={COLORS.gray} style={{ marginBottom: 16, opacity: 0.2 }} />
                            <Text style={styles.noResultsText}>No jobs found matching your criteria</Text>
                            <TouchableOpacity onPress={() => {
                                setSearchQuery('');
                                setActiveFilters({ category: 'All', salary: 'Any', experience: 'Any' });
                            }}>
                                <Text style={{ color: COLORS.primary, fontWeight: '700', marginTop: 12 }}>Reset All Filters</Text>
                            </TouchableOpacity>
                        </View>
                    )
                )}
            </ScrollView>

            {/* Custom Filter Selection UI (Premium Bottom Sheet Style) */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{modalConfig.title}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalOptionsList} showsVerticalScrollIndicator={false}>
                            {modalConfig.options.map((option: string, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionItem,
                                        activeFilters[modalConfig.type] === option && styles.activeOptionItem
                                    ]}
                                    onPress={() => selectOption(option)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        activeFilters[modalConfig.type] === option && styles.activeOptionText
                                    ]}>
                                        {option}
                                    </Text>
                                    {activeFilters[modalConfig.type] === option && (
                                        <View style={styles.activeDot} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
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
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: 20,
        backgroundColor: COLORS.white,
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
        marginTop: 10,
        marginBottom: 25,
        gap: 8,
    },
    filterBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
    },
    filterText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        marginRight: 4,
    },
    activeFilterBtn: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    activeFilterText: {
        color: COLORS.white,
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
    companyLogo: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: COLORS.inputBg,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    logoImage: {
        width: 48,
        height: 48,
        resizeMode: 'cover',
    },
    companyLogoText: {
        fontSize: 16,
        fontWeight: '900',
        color: COLORS.primary,
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
    },
    applyBtnText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 14,
        marginLeft: 16,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: '600',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: SCREEN_HEIGHT * 0.7,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.inputBg,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
    },
    modalOptionsList: {
        padding: 16,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        borderRadius: 16,
        marginBottom: 8,
        backgroundColor: COLORS.white,
    },
    activeOptionItem: {
        backgroundColor: COLORS.inputBg,
    },
    optionText: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '600',
    },
    activeOptionText: {
        color: COLORS.primary,
        fontWeight: '800',
    },
    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
    },
    noResults: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    noResultsText: {
        fontSize: 16,
        color: COLORS.textMuted,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default JobListingsScreen;

