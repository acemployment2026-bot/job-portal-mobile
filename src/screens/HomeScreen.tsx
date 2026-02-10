import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <View style={styles.locationRow}>
                        <MapPin size={14} color={COLORS.primary} />
                        <Text style={styles.locationText}>CHENNAI, TAMIL NADU</Text>
                    </View>
                    <Text style={styles.greeting}>Hi Karthik</Text>
                </View>
                <TouchableOpacity style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <User size={24} color={COLORS.primary} />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Search size={20} color={COLORS.gray} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search jobs in Chennai..."
                        placeholderTextColor={COLORS.gray}
                    />
                </View>

                {/* Recommended Jobs */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recommended Jobs</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('JobsTab')}>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScroll}>
                    <TouchableOpacity
                        style={styles.jobCard}
                        onPress={() => navigation.navigate('JobsTab', {
                            screen: 'JobDetails',
                            params: {
                                job: {
                                    title: 'Software Engineer',
                                    company: 'TCS',
                                    location: 'OMR, Chennai',
                                    salary: '₹60k - 1L',
                                    type: 'Full-time'
                                }
                            }
                        })}
                    >
                        <View style={styles.jobCardTop}>
                            <View style={[styles.companyLogo, { backgroundColor: '#004B49' }]}>
                                <Text style={styles.logoText}>TCS</Text>
                            </View>
                            <TouchableOpacity>
                                <Bookmark size={20} color={COLORS.gray} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.jobTitle}>Software Engineer</Text>
                        <Text style={styles.companyName}>TCS</Text>
                        <View style={styles.tagRow}>
                            <View style={[styles.tag, { backgroundColor: '#FFEBEB' }]}>
                                <Text style={[styles.tagText, { color: '#FF1E1E' }]}>OMR, CHENNAI</Text>
                            </View>
                            <View style={[styles.tag, { backgroundColor: '#F1F3F5' }]}>
                                <Text style={[styles.tagText, { color: COLORS.primary }]}>FULL-TIME</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.jobCard}
                        onPress={() => navigation.navigate('JobsTab', {
                            screen: 'JobDetails',
                            params: {
                                job: {
                                    title: 'Product Manager',
                                    company: 'Zoho',
                                    location: 'Guduvanchery, Chennai',
                                    salary: '₹80k - 1.2L',
                                    type: 'Full-time'
                                }
                            }
                        })}
                    >
                        <View style={styles.jobCardTop}>
                            <View style={[styles.companyLogo, { backgroundColor: '#006B44' }]}>
                                <Text style={styles.logoText}>ZOHO</Text>
                            </View>
                            <TouchableOpacity>
                                <Bookmark size={20} color={COLORS.gray} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.jobTitle}>Product Manager</Text>
                        <Text style={styles.companyName}>Zoho</Text>
                        <View style={styles.tagRow}>
                            <View style={[styles.tag, { backgroundColor: '#FFF9DB' }]}>
                                <Text style={[styles.tagText, { color: '#F59F00' }]}>GUDUVANCHERY</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                {/* Popular Companies */}
                <Text style={styles.sectionTitle}>Popular Companies</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.companiesScroll}>
                    {[
                        { name: 'Zoho', color: '#006B44' },
                        { name: 'Freshworks', color: '#446B2C' },
                        { name: 'TCS OMR', color: '#004B49' },
                        { name: 'Accenture', color: '#444444' }
                    ].map((item, index) => (
                        <View key={index} style={styles.companyItem}>
                            <View style={[styles.companyCircle, { backgroundColor: item.color }]}>
                                <Text style={styles.circleText}>{item.name[0]}</Text>
                            </View>
                            <Text style={styles.companyLabel}>{item.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Quick Links */}
                <Text style={styles.sectionTitle}>Quick Links</Text>
                <View style={styles.quickLinksGrid}>
                    <TouchableOpacity style={styles.linkCard}>
                        <View style={styles.linkIconBox}>
                            <User size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.linkLabel}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkCard}>
                        <View style={styles.linkIconBox}>
                            <FileText size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.linkLabel}>Resume</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkCard}>
                        <View style={styles.linkIconBox}>
                            <Briefcase size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.linkLabel}>Applications</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkCard}>
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
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
        marginLeft: 4,
        opacity: 0.6,
    },
    greeting: {
        fontSize: SIZES.h1,
        fontWeight: '800',
        color: COLORS.primary,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F1F3F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: 100,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F3F5',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginTop: 20,
        marginBottom: 30,
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: SIZES.body,
        color: COLORS.text,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: SIZES.h2,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 15,
        marginTop: 10,
    },
    seeAll: {
        color: '#FF1E1E',
        fontWeight: '700',
        fontSize: SIZES.small,
    },
    recommendedScroll: {
        marginBottom: 30,
        marginLeft: -SPACING.xl,
        paddingLeft: SPACING.xl,
    },
    jobCard: {
        width: width * 0.7,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 20,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#F1F3F5',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    jobCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    companyLogo: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: COLORS.white,
        fontWeight: '900',
        fontSize: 10,
    },
    jobTitle: {
        fontSize: SIZES.body + 2,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 4,
    },
    companyName: {
        fontSize: SIZES.body,
        color: COLORS.primary,
        opacity: 0.6,
        marginBottom: 15,
    },
    tagRow: {
        flexDirection: 'row',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '800',
    },
    companiesScroll: {
        marginBottom: 30,
    },
    companyItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    companyCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    circleText: {
        color: COLORS.white,
        fontSize: SIZES.h2,
        fontWeight: '800',
    },
    companyLabel: {
        fontSize: SIZES.small,
        fontWeight: '600',
        color: COLORS.primary,
    },
    quickLinksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    linkCard: {
        width: '48%',
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: '#F1F3F5',
    },
    linkIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F1F3F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    linkLabel: {
        fontSize: SIZES.body,
        fontWeight: '700',
        color: COLORS.primary,
    }
});

export default HomeScreen;
