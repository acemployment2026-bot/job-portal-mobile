import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ArrowLeft, User, Phone, MapPin, Briefcase, Camera } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { fetchWithAuth } from '../api/api';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState({
        fullName: '',
        phone: '',
        location: '',
        gender: '',
        highestEducation: '',
        skills: '',
        profilePictureUrl: ''
    });
    const [profileImageAsset, setProfileImageAsset] = useState<any>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUserData({
                    fullName: user.full_name || '',
                    phone: user.phone || '',
                    location: user.location || '',
                    gender: user.gender || '',
                    highestEducation: user.highest_education || '',
                    skills: user.skills || '',
                    profilePictureUrl: user.profile_picture_url || ''
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!userData.fullName || !userData.phone) {
            Alert.alert('Error', 'Full Name and Phone are required.');
            return;
        }

        setSaving(true);
        try {
            // Check if we need to upload profile picture
            let newProfilePictureUrl = userData.profilePictureUrl;

            if (profileImageAsset) {
                const formData = new FormData();
                const uri = profileImageAsset.uri;
                let fileName = profileImageAsset.fileName;
                let mimeType = profileImageAsset.mimeType;

                if (!fileName) {
                    const uriParts = uri.split('/');
                    fileName = uriParts[uriParts.length - 1] || 'profile.jpg';
                }
                if (!mimeType) {
                    const extParts = fileName.split('.');
                    const ext = extParts.length > 1 ? extParts[extParts.length - 1].toLowerCase() : 'jpg';
                    mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
                }

                formData.append('profilePicture', {
                    uri: uri,
                    name: fileName,
                    type: mimeType,
                } as any);

                const picResponse = await fetchWithAuth(`${config.API_BASE_URL}/users/profile-picture`, {
                    method: 'POST',
                    body: formData,
                });

                if (picResponse.ok) {
                    const picData = await picResponse.json();
                    newProfilePictureUrl = picData.profileUrl;
                } else {
                    console.error('Failed to upload profile picture');
                }
            }

            const response = await fetchWithAuth(`${config.API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const updatedUser = await response.json();

            if (response.ok) {
                // Update local storage
                const storedUser = await AsyncStorage.getItem('user');
                const user = storedUser ? JSON.parse(storedUser) : {};
                const newUser = {
                    ...user,
                    ...updatedUser,
                    full_name: updatedUser.full_name,
                    profile_picture_url: newProfilePictureUrl || updatedUser.profile_picture_url || user.profile_picture_url
                };
                await AsyncStorage.setItem('user', JSON.stringify(newUser));

                Alert.alert('Success', 'Profile updated successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', updatedUser.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Profile Picture Upload */}
                    <View style={styles.profilePicContainer}>
                        <TouchableOpacity
                            style={styles.profilePicWrapper}
                            onPress={async () => {
                                const result = await ImagePicker.launchImageLibraryAsync({
                                    mediaTypes: ['images'],
                                    allowsEditing: true,
                                    aspect: [1, 1],
                                    quality: 0.8,
                                });

                                if (!result.canceled && result.assets && result.assets.length > 0) {
                                    setProfileImageAsset(result.assets[0]);
                                }
                            }}
                        >
                            {profileImageAsset || userData.profilePictureUrl ? (
                                <Image
                                    source={{ uri: profileImageAsset ? profileImageAsset.uri : userData.profilePictureUrl }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <User size={40} color={COLORS.primary} />
                                </View>
                            )}
                            <View style={styles.editIconBadge}>
                                <Camera size={14} color={COLORS.white} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputWrapper}>
                            <User size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={userData.fullName}
                                onChangeText={(text) => setUserData({ ...userData, fullName: text })}
                                placeholder="Enter your full name"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputWrapper}>
                            <Phone size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={userData.phone}
                                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Location</Text>
                        <View style={styles.inputWrapper}>
                            <MapPin size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={userData.location}
                                onChangeText={(text) => setUserData({ ...userData, location: text })}
                                placeholder="E.g. Chennai, Tamil Nadu"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Highest Education</Text>
                        <View style={styles.inputWrapper}>
                            <Briefcase size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={userData.highestEducation}
                                onChangeText={(text) => setUserData({ ...userData, highestEducation: text })}
                                placeholder="E.g. B.Tech Computer Science"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Skills (Comma separated)</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, { paddingLeft: 12 }]}
                                value={userData.skills}
                                onChangeText={(text) => setUserData({ ...userData, skills: text })}
                                placeholder="E.g. React, Node.js, Python"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.inputBg,
    },
    backBtn: {
        padding: 8,
        marginLeft: -8,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: SPACING.xl,
        paddingBottom: 40,
    },
    profilePicContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profilePicWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.inputBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIconBadge: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '500',
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 4,
    },
    saveBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    }
});

export default EditProfileScreen;
