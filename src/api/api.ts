import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
    let token: string | null = await AsyncStorage.getItem('token');

    // Add Authorization header
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // If uploading file (multipart/form-data), let the browser set Content-Type
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    try {
        let response = await fetch(url, { ...options, headers });

        if (response.status === 401 || response.status === 403) {
            console.log('Token expired, attempting refresh...');

            // Attempt to refresh token
            const refreshToken = await AsyncStorage.getItem('refreshToken');

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const refreshResponse = await fetch(`${config.API_BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                const newToken = data.token;

                if (newToken) {
                    await AsyncStorage.setItem('token', newToken);

                    // Retry original request with new token
                    console.log('Token refreshed, retrying request...');
                    headers['Authorization'] = `Bearer ${newToken}`;
                    response = await fetch(url, { ...options, headers });
                }
            } else {
                console.log('Refresh token failed, logging out...');
                await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
                throw new Error('Session expired. Please login again.');
            }
        }

        return response;
    } catch (error) {
        throw error;
    }
};
