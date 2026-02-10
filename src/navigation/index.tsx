import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    Home as HomeIcon,
    Briefcase,
    Circle,
    User,
    Search,
    CheckSquare,
    Settings
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

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    height: 48,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F1F3F5',
                    paddingBottom: 0,
                    paddingTop: 0,
                },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 48,
                },
                tabBarIcon: ({ focused }) => {
                    let icon;
                    if (route.name === 'HomeTab') {
                        icon = <HomeIcon size={22} color={focused ? COLORS.primary : COLORS.gray} />;
                    } else if (route.name === 'JobsTab') {
                        icon = <Search size={22} color={focused ? COLORS.primary : COLORS.gray} />;
                    } else if (route.name === 'SavedTab') {
                        icon = <CheckSquare size={22} color={focused ? COLORS.primary : COLORS.gray} />;
                    } else if (route.name === 'ProfileTab') {
                        icon = <Settings size={22} color={focused ? COLORS.primary : COLORS.gray} />;
                    }

                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {icon}
                            {focused && <View style={styles.activeDot} />}
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} />
            <Tab.Screen name="JobsTab" component={JobsStack} />
            <Tab.Screen name="SavedTab" component={HomeScreen} />
            <Tab.Screen name="ProfileTab" component={HomeScreen} />
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
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FF1E1E',
        marginTop: 2,
        position: 'absolute',
        bottom: -6,
    }
});

export default AppNavigator;
