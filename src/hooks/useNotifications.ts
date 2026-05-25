import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import client from '../api/client';

const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}

export const useNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState<string>('');
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        if (isExpoGo) return;

        registerForPushNotificationsAsync().then(token => {
            if (token) {
                setExpoPushToken(token);
                saveTokenToServer(token);
            }
        });

        if (typeof Notifications.addNotificationReceivedListener === 'function') {
            notificationListener.current = Notifications.addNotificationReceivedListener(n => {
                setNotification(n);
            });
        }

        if (typeof Notifications.addNotificationResponseReceivedListener === 'function') {
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log('Notification response:', response);
            });
        }

        return () => {
            if (typeof Notifications.removeNotificationSubscription === 'function') {
                if (notificationListener.current) {
                    Notifications.removeNotificationSubscription(notificationListener.current);
                }
                if (responseListener.current) {
                    Notifications.removeNotificationSubscription(responseListener.current);
                }
            }
        };
    }, []);

    const saveTokenToServer = async (token: string) => {
        try {
            await client.post('/api/users/save-push-token', { pushToken: token });
        } catch (error) {
            console.error('Error saving push token:', error);
        }
    };

    return { expoPushToken, notification };
};

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        try {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        } catch (_) {}
    }

    if (Device.isDevice) {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') return;

            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId;

            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        } catch (_) {}
    }

    return token;
}
