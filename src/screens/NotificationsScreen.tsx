import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { Bell, CheckCircle2, Calendar, MessageSquare, X, ChevronLeft } from 'lucide-react-native';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationsScreen = ({ navigation }: any) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${config.API_BASE_URL}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await fetch(`${config.API_BASE_URL}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await fetch(`${config.API_BASE_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "application": return <CheckCircle2 size={24} color={COLORS.primary} />;
            case "interview": return <Calendar size={24} color="#1A2F63" />;
            case "message": return <MessageSquare size={24} color="#2D6A4F" />;
            default: return <Bell size={24} color={COLORS.gray} />;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.notificationCard, !item.is_read && styles.unreadCard]}
            onPress={() => markAsRead(item.id)}
        >
            <View style={styles.iconContainer}>
                {getIcon(item.type)}
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{formatTime(item.created_at)}</Text>
                </View>
                <Text style={styles.message}>{item.message}</Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteNotification(item.id)}
            >
                <X size={16} color={COLORS.gray} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => {
                            setRefreshing(true);
                            fetchNotifications();
                        }} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Bell size={64} color={COLORS.gray} opacity={0.2} />
                            <Text style={styles.emptyText}>No notifications yet</Text>
                        </View>
                    }
                />
            )}
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
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: SIZES.h2,
        fontWeight: '800',
        color: COLORS.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: SPACING.lg,
        paddingBottom: 50,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F3F5',
    },
    unreadCard: {
        backgroundColor: '#FFEBEB',
        borderColor: '#FFD1D1',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
        flex: 1,
    },
    time: {
        fontSize: 10,
        color: COLORS.gray,
        marginLeft: 8,
    },
    message: {
        fontSize: 12,
        color: COLORS.primary,
        opacity: 0.7,
        lineHeight: 18,
    },
    deleteButton: {
        padding: 4,
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: SIZES.body,
        color: COLORS.gray,
        fontWeight: '600',
    }
});

export default NotificationsScreen;
