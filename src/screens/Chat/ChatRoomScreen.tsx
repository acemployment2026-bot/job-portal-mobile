import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Send, ArrowLeft, Paperclip } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { io } from 'socket.io-client';
import config from '../../config';
import { fetchWithAuth } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatRoomScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { conversationId, participantName, participantId } = route.params;
    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState('');
    const [user, setUser] = useState<any>(null);
    const socketRef = useRef<any>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        initChat();
        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);

    const initChat = async () => {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);

            const socket = io(config.API_BASE_URL.replace('/api', ''));
            socketRef.current = socket;

            socket.emit('join', userData.id);

            socket.on('receive_message', (newMessage: any) => {
                if (newMessage.conversation_id === conversationId) {
                    setMessages((prevInside: any) => [...prevInside, newMessage]);
                }
            });

            socket.on('message_sent', (newMessage: any) => {
                if (newMessage.conversation_id === conversationId) {
                    setMessages((prevInside: any) => [...prevInside, newMessage]);
                }
            });

            fetchMessages();
        }
    };

    const fetchMessages = async () => {
        try {
            // Use fetchWithAuth to handle token refresh automatically
            const response = await fetchWithAuth(`${config.API_BASE_URL}/chat/messages/${conversationId}`);

            const data = await response.json();
            if (response.ok) {
                setMessages(data);
            } else {
                console.log('Error fetching messages:', data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = () => {
        if (messageText.trim() && user) {
            socketRef.current.emit('send_message', {
                senderId: user.id,
                receiverId: participantId,
                message: messageText.trim(),
                conversationId: conversationId
            });
            setMessageText('');
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMine = item.sender_id === user?.id;
        return (
            <View style={[styles.messageWrapper, isMine ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
                <View style={[styles.messageBubble, isMine ? styles.myBubble : styles.theirBubble]}>
                    <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
                        {item.message}
                    </Text>
                </View>
                <Text style={styles.messageTime}>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#212529" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{participantName}</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Paperclip size={24} color="#adb5bd" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!messageText.trim()}
                    >
                        <Send size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
    },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
    },
    headerStatus: {
        fontSize: 12,
        color: '#40C057',
    },
    messagesList: {
        padding: 15,
        paddingBottom: 20,
    },
    messageWrapper: {
        marginBottom: 15,
        maxWidth: '80%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    theirMessageWrapper: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    messageBubble: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    myBubble: {
        backgroundColor: COLORS.primary,
        borderTopRightRadius: 4,
    },
    theirBubble: {
        backgroundColor: '#F1F3F5',
        borderTopLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
    },
    myText: {
        color: '#FFFFFF',
    },
    theirText: {
        color: '#212529',
    },
    messageTime: {
        fontSize: 10,
        color: '#ADB5BD',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F3F5',
        backgroundColor: '#FFFFFF',
    },
    attachButton: {
        padding: 5,
        marginRight: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        fontSize: 16,
        maxHeight: 100,
        color: '#212529',
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    sendButtonDisabled: {
        backgroundColor: '#E9ECEF',
    },
});

export default ChatRoomScreen;
