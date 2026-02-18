import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    ActivityIndicator,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    XCircle,
    Building2,
    UploadCloud
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect } from 'react';
import { fetchWithAuth } from '../api/api';

const { width } = Dimensions.get('window');

const ApplyConfirmationScreen = ({ navigation, route }: any) => {
    const job = route.params?.job || {
        title: 'Senior Financial Analyst',
        company: 'ACE FINS TECH SOLUTION',
        location: 'Chennai'
    };

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [resume, setResume] = useState<any>(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                if (parsedUser.resume_url) {
                    setResume({
                        name: parsedUser.resume_original_name || 'My Resume.pdf',
                        url: parsedUser.resume_url,
                        date: parsedUser.updated_at
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load user', error);
        }
    };

    const handleChangeResume = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: false,
            });

            if (result.canceled) {
                return;
            }

            setLoading(true);

            if (!user) {
                Alert.alert("Error", "User session not found. Please login again.");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            const asset = result.assets[0];

            formData.append('resume', {
                uri: asset.uri,
                name: asset.name,
                type: asset.mimeType || 'application/pdf',
            } as any);
            formData.append('userId', user.id);

            const response = await fetchWithAuth(`${config.API_BASE_URL}/resume/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Resume updated successfully!");
                // Update local storage user data
                user.resume_url = data.resume.url;
                user.resume_original_name = data.resume.name;
                user.updated_at = data.resume.date;
                await AsyncStorage.setItem('user', JSON.stringify(user));
                setUser({ ...user }); // Force re-render

                setResume({
                    name: data.resume.name,
                    url: `${config.API_BASE_URL}${data.resume.url}`,
                    date: data.resume.date
                });
            } else {
                Alert.alert("Upload Failed", data.message || "Something went wrong");
            }

        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "Failed to upload resume");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!resume) {
            Alert.alert("Error", "Please upload a resume before applying.");
            return;
        }

        setLoading(true);
        try {
            if (!user) {
                Alert.alert('Error', 'Please login to apply');
                navigation.navigate('Login');
                return;
            }

            const response = await fetchWithAuth(`${config.API_BASE_URL}/applications/apply`, {
                method: 'POST',
                body: JSON.stringify({
                    job_id: job.id,
                    user_id: user.id,
                    applied_via: 'mobile',
                    resume_name: resume.name,
                    resume_link: resume.url
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Application Submitted Successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('Home') }
                ]);
            } else {
                Alert.alert('Application Failed', data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Apply Error:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
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

                {resume ? (
                    <View style={styles.resumeCard}>
                        <View style={styles.resumeIconBox}>
                            <FileText size={24} color={COLORS.white} />
                        </View>
                        <View style={styles.resumeInfo}>
                            <Text style={styles.fileName}>{resume.name}</Text>
                            <Text style={styles.fileMeta}>Uploaded on {new Date(resume.date).toLocaleDateString()}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.resumeCard, { borderStyle: 'dashed', borderWidth: 2, borderColor: COLORS.gray, backgroundColor: 'transparent' }]}>
                        <View style={[styles.resumeIconBox, { backgroundColor: COLORS.gray }]}>
                            <UploadCloud size={24} color={COLORS.white} />
                        </View>
                        <View style={styles.resumeInfo}>
                            <Text style={[styles.fileName, { color: COLORS.gray }]}>No Resume Uploaded</Text>
                            <Text style={styles.fileMeta}>Please upload a resume to apply</Text>
                        </View>
                    </View>
                )}

                <TouchableOpacity style={styles.changeResumeBtn} onPress={handleChangeResume}>
                    <Text style={styles.changeResumeText}>{resume ? 'Change Resume' : 'Upload Resume'}</Text>
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
                    onPress={handleApply}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.submitBtnText}>Submit Application</Text>
                    )}
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
        paddingBottom: 150,
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
