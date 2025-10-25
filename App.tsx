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
import ChatScreen from './src/screens/ChatScreen';
import SearchNewChatScreen from './src/screens/SearchNewChatScreen';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import MobileVerificationScreen from './src/screens/MobileVerificationScreen';
import BiometricVerificationScreen from './src/screens/BiometricVerificationScreen';
import { UserRegistrationProvider } from './src/components/UserContext';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './src/components/AuthProvider';
import { WebSocketProvider } from './src/socket/WebSocketProvider';
import GroupChatScreen from './src/screens/GroupChatScreen';
import ContactProfileScreen from './src/screens/ContactProfileScreen';
import GroupProfileScreen from './src/screens/GroupProfileScreen';
import AddGroupMemberScreen from './src/screens/AddGroupMemberScreen';
import NewGroupScreen from './src/screens/NewGroupScreen';

export type RootStack = {
  SplashScreen: undefined;
  MobileVerificationScreen: undefined;
  SetUpScreen: undefined;
  ProfileImageScreen: {
    userId: number
  };
  HomeScreen: undefined;
  SearchNewChatScreen: undefined;
  ChatScreen: {
    contactId: string;
    name: string;
    lastSeen: string;
    profileImg: string | null;
    savedStatus: string;
  };
  ContactProfileScreen: {
    contactId: number;
  };
  GroupChatScreen: {
    groupId: string;
    profileImg: string | null;
  };
  GroupProfileScreen: {
    groupId: number;
  };
  NewGroupScreen: undefined;
  AddGroupMemberScreen: {
    groupId: number;
  };
};

const Stack = createNativeStackNavigator<RootStack>();

function Msg_ChatApp() {
  const auth = useContext(AuthContext);
  return (
    <WebSocketProvider userId={auth ? Number(auth.userId) : 0}>
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>

              {auth?.isLoading ? (
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
              ) : auth?.userId === null ? (
                <Stack.Group>
                  <Stack.Screen name="MobileVerificationScreen" component={MobileVerificationScreen} />
                  <Stack.Screen name="SetUpScreen" component={SetUpScreen} />
                  <Stack.Screen name="ProfileImageScreen" component={ProfileImageScreen} />
                </Stack.Group>
              ) : (
                <Stack.Group>
                  <Stack.Screen name="HomeScreen" component={BottomNavigation} />
                  <Stack.Screen name="SearchNewChatScreen" component={SearchNewChatScreen} />
                  <Stack.Screen name="ChatScreen" component={ChatScreen} />
                  <Stack.Screen name="ContactProfileScreen" component={ContactProfileScreen} />
                  <Stack.Screen name="GroupChatScreen" component={GroupChatScreen} />
                  <Stack.Screen name="GroupProfileScreen" component={GroupProfileScreen} />
                  <Stack.Screen name="NewGroupScreen" component={NewGroupScreen} />
                  <Stack.Screen name="AddGroupMemberScreen" component={AddGroupMemberScreen} />
                </Stack.Group>
              )}

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
