import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    Share,
    Alert,
    Image
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
    Award,
    IndianRupee
} from 'lucide-react-native';
import { fetchWithAuth } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const { width } = Dimensions.get('window');

const JobDetailScreen = ({ navigation, route }: any) => {
    const job = route.params?.job || {
        title: 'Frontend Developer – Chennai OMR',
        company: 'Job Search India',
        location: 'Chennai, IN',
        salary: '₹10 - 15 LPA',
        experience: '3-5 Years',
        type: 'Full-time'
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `Check out this job: ${job.title} at ${job.company} in ${job.location}`,
            });
        } catch (error: any) {
            console.error(error.message);
        }
    };

    const handleChatWithHR = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) {
                Alert.alert('Login Required', 'Please login to chat with HR', [
                    { text: 'Login', onPress: () => navigation.navigate('Login') },
                    { text: 'Cancel', style: 'cancel' }
                ]);
                return;
            }

            const receiverId = job.posted_by || 1; // Fallback to super admin if not specified

            const response = await fetchWithAuth(`${config.API_BASE_URL}/chat/start`, {
                method: 'POST',
                body: JSON.stringify({ receiverId })
            });

            const data = await response.json();
            if (response.ok) {
                navigation.navigate('MessagesTab', {
                    screen: 'ChatRoom',
                    params: {
                        conversationId: data.id,
                        participantName: job.company || 'HR Manager',
                        participantId: receiverId
                    }
                });
            } else {
                Alert.alert('Error', data.message || 'Could not start conversation');
            }
        } catch (error) {
            console.error('Chat error:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>JOB DETAILS</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
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
                        {job.logo_url ? (
                            <Image source={{ uri: job.logo_url }} style={styles.logoImage} />
                        ) : (
                            <Image source={require('../../assets/icon.png')} style={styles.logoImage} />
                        )}
                    </View>
                    <Text style={styles.companyName}>{job.company}</Text>
                </View>

                {/* Info Cards */}
                <View style={styles.infoCardsRow}>
                    <View style={styles.mainInfoCard}>
                        <View style={styles.infoIconBox}>
                            <IndianRupee size={24} color={COLORS.primary} />
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
                        {job.description || "We are seeking a passionate Frontend Developer to join our dynamic team in India. You will be responsible for building the 'client-side' of our web applications."}
                    </Text>
                </View>

                {/* Responsibilities Section */}
                <View style={[styles.sectionCard, styles.darkSection]}>
                    <Text style={[styles.sectionTitle, { color: COLORS.white }]}>Key Responsibilities</Text>
                    {(job.key_responsibilities ?
                        (typeof job.key_responsibilities === 'string' ? job.key_responsibilities.split('\n') : job.key_responsibilities)
                        : [
                            'Develop new user-facing features and modular components.',
                            'Build reusable code and libraries for future use.',
                            'Ensure technical feasibility of UI/UX designs.',
                            'Optimize applications for maximum speed and scalability.',
                            'Collaborate with cross-functional team members.'
                        ]
                    ).map((item: string, index: number) => (
                        <View key={index} style={styles.responsibilityRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.responsibilityText}>{item}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.chatBtn} onPress={handleChatWithHR}>
                    <MessageCircle size={18} color={COLORS.primary} />
                    <Text
                        style={styles.chatBtnText}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        CHAT WITH HR
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => navigation.navigate('ApplyConfirmation', { job })}
                >
                    <Text
                        style={styles.applyBtnText}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        APPLY NOW
                    </Text>
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
        paddingTop: Platform.OS === 'ios' ? 20 : 20,
        paddingBottom: 20,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.inputBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.textMuted,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    scrollContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: 140,
    },
    jobBadge: {
        backgroundColor: COLORS.inputBg,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 20,
        marginBottom: 16,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.primary,
        opacity: 0.8,
        letterSpacing: 0.5,
    },
    jobTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 12,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    companyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    companyInitial: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.inputBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    logoImage: {
        width: 44,
        height: 44,
        resizeMode: 'cover',
    },
    initialText: {
        fontSize: 16,
        fontWeight: '900',
        color: COLORS.primary,
    },
    companyName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
        opacity: 0.8,
    },
    infoCardsRow: {
        marginBottom: 24,
    },
    mainInfoCard: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIconBox: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: COLORS.primary,
        opacity: 0.5,
        letterSpacing: 1,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        width: '48%',
        backgroundColor: COLORS.inputBg,
        borderRadius: 24,
        padding: 20,
    },
    statIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.primary,
        opacity: 0.5,
        letterSpacing: 1,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
    },
    sectionCard: {
        backgroundColor: COLORS.white,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    sectionDescription: {
        fontSize: 16,
        lineHeight: 26,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    darkSection: {
        backgroundColor: COLORS.primary,
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
    },
    responsibilityRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.secondary,
        marginTop: 10,
        marginRight: 12,
    },
    responsibilityText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.white,
        opacity: 0.9,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        paddingHorizontal: SPACING.xl,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
        borderTopWidth: 1.5,
        borderTopColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chatBtn: {
        flex: 1.2,
        height: 56,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        paddingHorizontal: 8,
    },
    chatBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: COLORS.primary,
        marginLeft: 6,
    },
    applyBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        paddingHorizontal: 8,
    },
    applyBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 0.5,
    },
});

export default JobDetailScreen;
