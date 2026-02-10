import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput
} from 'react-native';
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
    const jobs = [
        {
            id: 1,
            title: 'Senior iOS Developer',
            company: 'ACE FINS TECH SOLUTION',
            location: 'Velachery, Chennai',
            salary: '₹80k - 1.2L',
            type: 'Full-time',
            modality: 'On-site',
            isNew: true
        },
        {
            id: 2,
            title: 'Financial Analyst',
            company: 'ACE FINS TECH SOLUTION',
            location: 'T Nagar, Chennai',
            salary: '₹50k - 75k',
            type: 'Full-time',
            modality: 'Hybrid',
            isNew: false
        },
        {
            id: 3,
            title: 'Product Manager',
            company: 'ACE FINS TECH SOLUTION',
            location: 'OMR, Chennai',
            salary: '₹90k - 1.5L',
            type: 'Full-time',
            modality: 'On-site',
            isNew: false
        }
    ];

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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
                {jobs.map((job) => (
                    <View key={job.id} style={styles.jobCard}>
                        <View style={styles.jobCardHeader}>
                            <View>
                                <Text style={styles.jobTitle}>{job.title}</Text>
                                <Text style={styles.companyName}>{job.company}</Text>
                            </View>
                            {job.isNew && (
                                <View style={styles.newBadge}>
                                    <Text style={styles.newBadgeText}>NEW</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.jobInfoGrid}>
                            <View style={styles.infoRow}>
                                <MapPin size={16} color={COLORS.gray} />
                                <Text style={styles.infoText}>{job.location}</Text>
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
                                <Text style={styles.infoText}>{job.modality}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.applyBtn}
                            onPress={() => navigation.navigate('JobDetails', { job })}
                        >
                            <Text style={styles.applyBtnText}>Apply Now</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.white,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: SIZES.h2,
        fontWeight: '800',
        color: COLORS.primary,
    },
    searchBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F3F5',
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
        marginTop: 15,
        marginBottom: 20,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        marginRight: 6,
    },
    categoryLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.gray,
        letterSpacing: 2,
        marginBottom: 20,
        marginTop: 10,
    },
    jobCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
    },
    jobCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    jobTitle: {
        fontSize: SIZES.h2,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 4,
    },
    companyName: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: COLORS.primary,
        opacity: 0.8,
    },
    newBadge: {
        backgroundColor: '#F1F3F5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    newBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.primary,
    },
    jobInfoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    infoRow: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        fontSize: SIZES.small,
        color: COLORS.primary,
        opacity: 0.7,
        marginLeft: 8,
        fontWeight: '600',
    },
    applyBtn: {
        backgroundColor: '#FF1E1E',
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF1E1E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    applyBtnText: {
        color: COLORS.white,
        fontSize: SIZES.body,
        fontWeight: '700',
    }
});

export default JobListingsScreen;
