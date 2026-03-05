import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    Home as HomeIcon,
    Briefcase,
    Circle,
    User,
    Search,
    CheckSquare,
    Settings,
    MessageSquare,
    Map,
} from 'lucide-react-native';
import { COLORS } from '../constants/theme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpLoginScreen from '../screens/OtpLoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import JobListingsScreen from '../screens/JobListingsScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import ApplyConfirmationScreen from '../screens/ApplyConfirmationScreen';
import ChatListScreen from '../screens/Chat/ChatListScreen';
import ChatRoomScreen from '../screens/Chat/ChatRoomScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ApplicationsScreen from '../screens/ApplicationsScreen';
import ResumeScreen from '../screens/ResumeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Sub-stack for Jobs to allow navigation between Listings and Details within the Tab
const JobsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="JobListings" component={JobListingsScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailScreen} />
        <Stack.Screen name="ApplyConfirmation" component={ApplyConfirmationScreen} />
    </Stack.Navigator>
);

// Sub-stack for Chat
const ChatStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
    </Stack.Navigator>
);

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    height: Platform.OS === 'ios' ? 85 : 80,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F1F3F5',
                    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
                    paddingTop: 0,
                },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: Platform.OS === 'ios' ? 60 : 55,
                },
                tabBarIcon: ({ focused }) => {
                    let icon;
                    if (route.name === 'HomeTab') {
                        icon = <HomeIcon size={22} color={focused ? COLORS.primary : COLORS.gray} />;
                    } else if (route.name === 'JobsTab') {
                        icon = <Map size={22} color={focused ? COLORS.primary : COLORS.gray} />;
                    } else if (route.name === 'MessagesTab') {
                        icon = <MessageSquare size={22} color={focused ? COLORS.primary : COLORS.gray} />;
                    } else if (route.name === 'SavedTab') {
                        icon = <CheckSquare size={22} color={focused ? COLORS.primary : COLORS.gray} />;
                    } else if (route.name === 'ProfileTab') {
                        icon = <Settings size={22} color={focused ? COLORS.primary : COLORS.gray} />;
                    }

                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {icon}
                        </View>
                    );
                },
            })
            }
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} />
            <Tab.Screen name="JobsTab" component={JobsStack} />
            <Tab.Screen name="MessagesTab" component={ChatStack} />
            <Tab.Screen name="SavedTab" component={ApplicationsScreen} />
            <Tab.Screen name="ProfileTab" component={ProfileScreen} />
        </Tab.Navigator >
    );
};

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#FFFFFF' },
            }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OtpLogin" component={OtpLoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            {/* Once logged in, move to the Tab Navigator */}
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Applications" component={ApplicationsScreen} />
            <Stack.Screen name="Resume" component={ResumeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
};


export default AppNavigator;
