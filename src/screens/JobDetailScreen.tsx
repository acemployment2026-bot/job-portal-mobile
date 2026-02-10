import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import {
    ArrowLeft,
    Share2,
    MapPin,
    Briefcase,
    Clock,
    DollarSign,
    MessageCircle,
    Award
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const JobDetailScreen = ({ navigation, route }: any) => {
    const job = route.params?.job || {
        title: 'Frontend Developer – Chennai OMR',
        company: 'ACE FINS TECH SOLUTION',
        location: 'Chennai, IN',
        salary: '₹10 - 15 LPA',
        experience: '3-5 Years',
        type: 'Full-time'
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>JOB DETAILS</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Share2 size={22} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Job Basic Info */}
                <View style={styles.jobBadge}>
                    <Text style={styles.badgeText}>FULL-TIME • CHENNAI OMR</Text>
                </View>
                <Text style={styles.jobTitle}>{job.title}</Text>

                <View style={styles.companyRow}>
                    <View style={styles.companyInitial}>
                        <Text style={styles.initialText}>AF</Text>
                    </View>
                    <Text style={styles.companyName}>{job.company}</Text>
                </View>

                {/* Info Cards */}
                <View style={styles.infoCardsRow}>
                    <View style={styles.mainInfoCard}>
                        <View style={styles.infoIconBox}>
                            <DollarSign size={24} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>EXPECTED SALARY</Text>
                            <Text style={styles.infoValue}>{job.salary}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconBox}>
                            <MapPin size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.statLabel}>LOCATION</Text>
                        <Text style={styles.statValue}>{job.location}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statIconBox}>
                            <Briefcase size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.statLabel}>EXPERIENCE</Text>
                        <Text style={styles.statValue}>{job.experience || '3-5 Years'}</Text>
                    </View>
                </View>

                {/* Content Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Job Description</Text>
                    <Text style={styles.sectionDescription}>
                        We are seeking a passionate <Text style={{ fontWeight: '700' }}>Frontend Developer</Text> to join our dynamic team in Chennai. You will be responsible for building the 'client-side' of our web applications, translating our company and customer needs into functional and appealing interactive applications.
                    </Text>
                </View>

                {/* Responsibilities Section */}
                <View style={[styles.sectionCard, styles.darkSection]}>
                    <Text style={[styles.sectionTitle, { color: COLORS.white }]}>Key Responsibilities</Text>
                    {[
                        'Develop new user-facing features and modular components.',
                        'Build reusable code and libraries for future use.',
                        'Ensure technical feasibility of UI/UX designs.',
                        'Optimize applications for maximum speed and scalability.',
                        'Collaborate with cross-functional team members.'
                    ].map((item, index) => (
                        <View key={index} style={styles.responsibilityRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.responsibilityText}>{item}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.chatBtn}>
                    <MessageCircle size={20} color={COLORS.primary} />
                    <Text style={styles.chatBtnText}>CHAT WITH HR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => navigation.navigate('ApplyConfirmation', { job })}
                >
                    <Text style={styles.applyBtnText}>APPLY NOW</Text>
                </TouchableOpacity>
            </View>
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
        paddingVertical: SPACING.md,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: SIZES.small,
        fontWeight: '800',
        color: '#6c757d',
        letterSpacing: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: 120,
    },
    jobBadge: {
        backgroundColor: '#F1F3F5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 20,
        marginBottom: 10,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.primary,
        opacity: 0.6,
    },
    jobTitle: {
        fontSize: SIZES.h1 + 2,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 15,
        lineHeight: 38,
    },
    companyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    companyInitial: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F1F3F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    initialText: {
        fontSize: 12,
        fontWeight: '900',
        color: COLORS.primary,
    },
    companyName: {
        fontSize: SIZES.body + 2,
        fontWeight: '700',
        color: COLORS.primary,
        opacity: 0.8,
    },
    infoCardsRow: {
        marginBottom: 20,
    },
    mainInfoCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIconBox: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.primary,
        opacity: 0.4,
        letterSpacing: 1,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: SIZES.h2,
        fontWeight: '800',
        color: COLORS.primary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#F8F9FA',
        borderRadius: 24,
        padding: 20,
    },
    statIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    statLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: COLORS.primary,
        opacity: 0.4,
        letterSpacing: 1,
        marginBottom: 4,
    },
    statValue: {
        fontSize: SIZES.body,
        fontWeight: '800',
        color: COLORS.primary,
    },
    sectionCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#F1F3F5',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: SIZES.h2,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 15,
    },
    sectionDescription: {
        fontSize: SIZES.body,
        lineHeight: 24,
        color: COLORS.primary,
        opacity: 0.7,
    },
    darkSection: {
        backgroundColor: '#000531',
    },
    responsibilityRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FF1E1E',
        marginTop: 10,
        marginRight: 10,
    },
    responsibilityText: {
        flex: 1,
        fontSize: SIZES.body,
        lineHeight: 22,
        color: COLORS.white,
        opacity: 0.8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        paddingHorizontal: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F3F5',
    },
    chatBtn: {
        width: width * 0.35,
        height: 60,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.primary,
        marginLeft: 8,
    },
    applyBtn: {
        width: width * 0.5,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#FF1E1E',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF1E1E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    applyBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 1,
    },
});

export default JobDetailScreen;
