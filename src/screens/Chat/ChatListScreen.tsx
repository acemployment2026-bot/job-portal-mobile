import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, ChevronRight } from 'lucide-react-native';
import { COLORS, SIZES } from '../../constants/theme';
import config from '../../config';
import { fetchWithAuth } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatListScreen = () => {
    const navigation = useNavigation<any>();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            // Use fetchWithAuth to handle token refresh automatically
            const response = await fetchWithAuth(`${config.API_BASE_URL}/chat/conversations`);

            const data = await response.json();
            if (response.ok) {
                setConversations(data);
            } else {
                console.log('Error fetching conversations:', data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.chatCard}
            onPress={() => navigation.navigate('ChatRoom', {
                conversationId: item.id,
                participantName: item.participant_name,
                participantId: item.participant_id
            })}
        >
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                    {item.participant_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                </Text>
            </View>
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.name}>{item.participant_name}</Text>
                    <Text style={styles.time}>
                        {new Date(item.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <View style={styles.chatFooter}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.last_message || 'No messages yet'}
                    </Text>
                    {item.unread_count > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unread_count}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>
            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No conversations yet</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
    },
    listContainer: {
        paddingVertical: 10,
    },
    chatCard: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#FFFFFF',
        marginBottom: 1,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    chatInfo: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212529',
    },
    time: {
        fontSize: 12,
        color: '#868E96',
    },
    chatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: 14,
        color: '#495057',
        flex: 1,
        marginRight: 10,
    },
    unreadBadge: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#868E96',
    },
});

export default ChatListScreen;
