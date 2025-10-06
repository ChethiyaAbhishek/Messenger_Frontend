import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider, useTheme } from './src/themes/ThemeProvider';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import SetUpScreen from './src/screens/SetUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import "./global.css";
import ProfileImageScreen from './src/screens/ProfileImageScreen';
import BottomNavigation from './src/screens/BottomNavigation';
import StatusScreen from './src/screens/StatusScreen';
import ChatScreen from './src/screens/ChatScreen';
import SearchNewChatScreen from './src/screens/SearchNewChatScreen';
// import { CountryCode } from 'react-native-country-picker-modal';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import MobileVerificationScreen from './src/screens/MobileVerificationScreen';
import BiometricVerificationScreen from './src/screens/BiometricVerificationScreen';
import { UserRegistrationProvider } from './src/components/UserContext';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './src/components/AuthProvider';
import { WebSocketProvider } from './src/socket/WebSocketProvider';

export type RootStack = {
  SplashScreen: undefined;
  MobileVerificationScreen: undefined;
  BiometricVerificationScreen: undefined;
  SetUpScreen: undefined;
  ProfileImageScreen: undefined;
  HomeScreen: undefined;
  StatusScreen: undefined;
  ChatScreen: {
    contactId: string;
    name: string;
    lastSeen: string;
    profileImg: string | null;
  };
  SearchNewChatScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStack>();

function Msg_ChatApp() {
  // const auth = useContext(AuthContext);
  return (
    <WebSocketProvider userId={1}>
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="MobileVerificationScreen" component={MobileVerificationScreen} />
              <Stack.Screen name="BiometricVerificationScreen" component={BiometricVerificationScreen} />
              <Stack.Screen name="SetUpScreen" component={SetUpScreen} />
              <Stack.Screen name="ProfileImageScreen" component={ProfileImageScreen} />
              <Stack.Screen name="HomeScreen" component={BottomNavigation} />
              <Stack.Screen name="StatusScreen" component={StatusScreen} />
              <Stack.Screen name="ChatScreen" component={ChatScreen} />
              <Stack.Screen name="SearchNewChatScreen" component={SearchNewChatScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    </WebSocketProvider>
  );
}

export default function App() {
  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <Msg_ChatApp />
      </AuthProvider>
    </AlertNotificationRoot>
  );
}
