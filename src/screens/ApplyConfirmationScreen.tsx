import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    XCircle,
    Building2
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ApplyConfirmationScreen = ({ navigation, route }: any) => {
    const job = route.params?.job || {
        title: 'Senior Financial Analyst',
        company: 'ACE FINS TECH SOLUTION',
        location: 'Chennai'
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Apply Confirmation</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Job Brief */}
                <View style={styles.jobBriefSection}>
                    <View style={styles.jobTextCol}>
                        <Text style={styles.reviewLabel}>REVIEW APPLICATION</Text>
                        <Text style={styles.jobTitle}>{job.title}</Text>
                        <Text style={styles.companyMeta}>{job.company} • {job.location || 'Chennai'}</Text>
                    </View>
                    <View style={styles.companyAvatarBox}>
                        <Building2 size={32} color={COLORS.primary} opacity={0.3} />
                    </View>
                </View>

                {/* Resume Section */}
                <Text style={styles.sectionHeading}>Your Resume</Text>
                <View style={styles.resumeCard}>
                    <View style={styles.resumeIconBox}>
                        <FileText size={24} color={COLORS.white} />
                    </View>
                    <View style={styles.resumeInfo}>
                        <Text style={styles.fileName}>john_doe_resume.pdf</Text>
                        <Text style={styles.fileMeta}>1.2 MB • Uploaded today</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.changeResumeBtn}>
                    <Text style={styles.changeResumeText}>Change Resume</Text>
                </TouchableOpacity>

                {/* Info Box */}
                <View style={styles.disclaimerBox}>
                    <Text style={styles.disclaimerText}>
                        By submitting, you agree to share your profile and contact information with ACE FINS TECH SOLUTION for recruitment purposes.
                    </Text>
                </View>

            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={() => {
                        // Here you would normally handle the API call
                        alert('Application Submitted Successfully!');
                        navigation.navigate('Home');
                    }}
                >
                    <Text style={styles.submitBtnText}>Submit Application</Text>
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
    scrollContent: {
        paddingHorizontal: SPACING.xl,
        paddingTop: 40,
    },
    jobBriefSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 50,
    },
    jobTextCol: {
        flex: 1,
        marginRight: 20,
    },
    reviewLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.gray,
        letterSpacing: 1,
        marginBottom: 10,
    },
    jobTitle: {
        fontSize: SIZES.h1 + 2,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 10,
    },
    companyMeta: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: COLORS.gray,
    },
    companyAvatarBox: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#F1F3F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeading: {
        fontSize: SIZES.h2,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: SPACING.lg,
    },
    resumeCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    resumeIconBox: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    resumeInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: SIZES.body + 1,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 4,
    },
    fileMeta: {
        fontSize: SIZES.small,
        color: COLORS.gray,
        fontWeight: '600',
    },
    changeResumeBtn: {
        alignItems: 'center',
        marginBottom: 50,
    },
    changeResumeText: {
        color: '#FF1E1E',
        fontWeight: '800',
        fontSize: SIZES.body,
    },
    disclaimerBox: {
        backgroundColor: '#F8F9FA',
        borderRadius: 24,
        padding: 30,
        borderWidth: 1,
        borderColor: '#F1F3F5',
        marginBottom: 100,
    },
    disclaimerText: {
        fontSize: SIZES.body,
        lineHeight: 24,
        color: COLORS.gray,
        textAlign: 'center',
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: SPACING.xl,
        paddingBottom: 40,
        backgroundColor: COLORS.white,
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        height: 65,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    submitBtnText: {
        color: COLORS.white,
        fontSize: SIZES.body + 1,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});

export default ApplyConfirmationScreen;
