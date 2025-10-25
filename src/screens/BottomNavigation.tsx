import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./HomeScreen";
import GroupsScreen from "./GroupsScreen";
import CallsScreen from "./CallsScreen";
import UserProfileScreen from "./UserProfileScreen";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";

const Tabs = createBottomTabNavigator();

export default function BottomNavigation() {
    const { applied } = useTheme();

    return (
        <ThemeProvider>
            <Tabs.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    let iconName = "chatbubble-ellipses";
                    if (route.name === "Messages") iconName = "chatbubble-ellipses";
                    else if (route.name === "Groups") iconName = "people";
                    // else if (route.name === "Calls") iconName = "call";
                    else if (route.name === "Profile") iconName = "person";
                    return <Ionicons name={iconName as any} size={24} color={color} />;
                },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '800' },
                tabBarActiveTintColor: applied==="light"?("#0284c7"):("#7dd3fc"),
                tabBarInactiveTintColor: "#9ca3af",
                tabBarStyle: {
                    height: 60,
                    backgroundColor: applied==="light"?("#fff"):("#000"),
                    borderTopColor: applied==="light"?("#fff"):("#0f172a"),
                    paddingTop: 3
                }
            })}>
                <Tabs.Screen name="Messages" component={HomeScreen} options={{ headerShown: false }} />
                <Tabs.Screen name="Groups" component={GroupsScreen} options={{ headerShown: false }} />
                {/* <Tabs.Screen name="Calls" component={CallsScreen} /> */}
                <Tabs.Screen name="Profile" component={UserProfileScreen} options={{ headerShown: false }} />
            </Tabs.Navigator>
        </ThemeProvider>

    );
}