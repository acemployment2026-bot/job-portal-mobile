import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Linking, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '../constants/theme';
import { ArrowLeft, FileText, UploadCloud } from 'lucide-react-native';
import config from '../config';
import * as DocumentPicker from 'expo-document-picker';
import { fetchWithAuth } from '../api/api';

const ResumeScreen = ({ navigation }: any) => {
    const [resumeData, setResumeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchResume();
    }, []);

    const fetchResume = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);

                if (user.resume_url) {
                    const finalUrl = user.resume_url.startsWith('http') ? user.resume_url : `${config.API_BASE_URL}${user.resume_url}`;
                    setResumeData({
                        name: user.resume_original_name || 'My Resume.pdf',
                        url: finalUrl,
                        date: user.updated_at || new Date().toISOString()
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load resume info', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchResume();
        setRefreshing(false);
    }, []);

    const handleDownload = () => {
        if (resumeData?.url) {
            Linking.openURL(resumeData.url).catch(err =>
                console.error("Couldn't load page", err)
            );
        }
    };

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: false,
            });

            if (result.canceled) {
                return;
            }

            setLoading(true);
            const userData = await AsyncStorage.getItem('user');
            const user = userData ? JSON.parse(userData) : null;

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

            formData.append('userId', user.id);

            const response = await fetchWithAuth(`${config.API_BASE_URL}/resume/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Resume uploaded successfully!");
                // Update local storage user data if needed, or just refresh screen state
                user.resume_url = data.resume.url;
                user.resume_original_name = data.resume.name;
                user.updated_at = data.resume.date;
                await AsyncStorage.setItem('user', JSON.stringify(user));

                const resumeUrl = data.resume.file_url || data.resume.url;
                const finalUrl = resumeUrl.startsWith('http') ? resumeUrl : `${config.API_BASE_URL}${resumeUrl}`;

                setResumeData({
                    name: data.resume.original_name || data.resume.name,
                    url: finalUrl,
                    date: data.resume.uploaded_at || data.resume.date
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
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Resume</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            >
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                ) : resumeData ? (
                    <View style={styles.resumeCard}>
                        <FileText size={48} color={COLORS.primary} strokeWidth={1} style={{ marginBottom: 20 }} />
                        <Text style={styles.fileName} numberOfLines={1}>{resumeData.name}</Text>
                        <Text style={styles.fileSize}>Uploaded on {new Date(resumeData.date).toLocaleDateString()}</Text>

                        <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
                            <Text style={styles.btnText}>View Resume</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.resumeCard}>
                        <Text style={{ marginBottom: 20, color: COLORS.textMuted }}>No resume uploaded yet.</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
                    <UploadCloud size={24} color={COLORS.white} style={{ marginRight: 10 }} />
                    <Text style={styles.uploadText}>{resumeData ? 'Replace Resume' : 'Upload Resume'}</Text>
                </TouchableOpacity>
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
        paddingHorizontal: SPACING.xl,
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
    content: {
        flex: 1,
        padding: SPACING.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resumeCard: {
        width: '100%',
        backgroundColor: COLORS.inputBg,
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
    },
    fileName: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 8,
    },
    fileSize: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 30,
        fontWeight: '500',
    },
    actionBtn: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
    },
    btnText: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    uploadBtn: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        paddingHorizontal: 30,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    uploadText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});

export default ResumeScreen;
