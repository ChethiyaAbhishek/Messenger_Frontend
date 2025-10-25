import { FlatList, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { GroupListSocket } from "../socket/GroupListSocket";
import { formatChatTime } from "../util/DateFormatter";
import * as LocalAuthentication from 'expo-local-authentication';

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">

export default function GroupsScreen() {

    const { applied } = useTheme();

    const navigation = useNavigation<HomeScreenProps>();
    const [search, setSearch] = useState("");
    const groupList = GroupListSocket();

    async function authenticateUser(): Promise<boolean> {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            return false;
        }

        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (supportedTypes.length === 0) {
            console.log(supportedTypes);
            return false;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Enter passcode",
            fallbackLabel: 'Enter passcode',
        });

        if (result.success) {
            return true;
        } else {
            return false;
        }
    }

    let unreadGroupCount = groupList.filter((item) => item.unreadCount > 0).length

    const filteredGroups = groupList.filter((group) => {
        return (
            group.groupName.toLowerCase().includes(search.toLowerCase()) ||
            group.lastMsg.toLowerCase().includes(search.toLowerCase())
        );
    });

    const renderItem = ({ item }: any) => (
        <TouchableOpacity className="flex-row items-center py-2 px-3 my-0.5"
            onPress={async () => {

                let unlocked = false;

                if (item.lockedStatus && item.lockedStatus === "LOCKED") {
                    unlocked = await authenticateUser();
                } else {
                    unlocked = true;
                }

                if (unlocked) {
                    navigation.navigate("GroupChatScreen", {
                        groupId: item.groupId,
                        profileImg: item.groupProfileImage ? item.groupProfileImage : null,
                    });
                }

            }}>

            <Image source={item.groupProfileImage
                ? ({ uri: item.groupProfileImage })
                : (require("../../assets/default-profile.png"))}
                className="h-20 w-20 rounded-full" />

            <View className="flex-1 ms-3">
                <View className="flex-row justify-between">
                    <Text className="font-bold flex-1 text-xl text-gray-600 dark:text-gray-300"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >{item.groupName}</Text>
                    <Text className={`font-light ms-1 text-sm ${item.unreadCount > 0 ? (`text-sky-500`) : (`text-gray-500`)}`}>{formatChatTime(item.lastMsgTime)}</Text>
                </View>

                <View className="flex-row justify-between items-center">
                    {item.lockedStatus && item.lockedStatus === "LOCKED" ? (
                        <View className="flex-row bg-gray-800/55 p-1 px-3 rounded-full gap-2 justify-center items-center">
                            <Text className="dark:text-slate-500 text-slate-200 text-sm tracking-wider" numberOfLines={1} ellipsizeMode="tail">
                                LOCKED
                            </Text>
                            <FontAwesome name="lock" size={14} color={applied === "dark" ? (`#64748b`) : (`#e2e8f0`)} />
                        </View>
                    ) : (
                        <Text className={`text-base ${item.lastMsg === "New Group" ? (`dark:bg-sky-300/50 bg-sky-700/70 border-2 border-sky-300/75 rounded-full px-3 text-slate-50`) : (`flex-1 text-gray-500`)}`}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            <Text className="font-bold">{item.lastUserName ? (item.lastUserName + ": ") : ("")}</Text>
                            {item.lastMsg}
                        </Text>
                    )}

                    {item.unreadCount > 0 && (
                        <View className="bg-sky-400 rounded-full h-6 w-6 justify-center items-center ms-2">
                            <Text className="text-slate-700 text-xs font-bold">{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemeProvider>
            <SafeAreaView className="flex-1 bg-white dark:bg-black">
                <View className="p-3 justify-between items-center flex-row">
                    <Text className="text-sky-600 dark:text-sky-500 font-bold text-3xl">Messenger</Text>
                    <View className="justify-center items-center flex-row gap-5">
                        <Pressable className="justify-center items-center">
                            {applied === "light" ? (
                                <Entypo name="camera" size={24} color="#6b7280" />
                            ) : (
                                <Entypo name="camera" size={24} color="#9ca3af" />
                            )}
                        </Pressable>

                        <Pressable className="justify-center items-center">
                            {applied === "light" ? (
                                <Entypo name="menu" size={30} color="#6b7280" />
                            ) : (
                                <Entypo name="menu" size={30} color="#9ca3af" />
                            )}
                        </Pressable>
                    </View>
                </View>
                <View className="p-3">
                    <View className="bg-gray-100 dark:bg-gray-900 h-14 w-full rounded-full p-1 px-3">
                        <TextInput placeholder="Search Group" className="dark:text-slate-300 text-slate-500 font-bold text-base"
                            placeholderTextColor={applied === "light" ? ("#64748b") : ("#cbd5e1")} value={search} onChangeText={(text) => setSearch(text)} />
                    </View>
                </View>

                <View className="m-3 ml-5">
                    <Text className="dark:text-slate-400 font-bold text-2xl">Groups</Text>
                </View>

                <View className="p-3 flex-row gap-3">
                    <Pressable className="bg-gray-100 dark:bg-gray-900 h-10 rounded-full p-1 px-5 justify-center items-center"
                    onPress={()=>navigation.navigate("NewGroupScreen")}>
                        <Text className="dark:text-slate-50 text-slate-800 text-sm">Create New Group</Text>
                    </Pressable>
                    <Pressable className="bg-gray-100 dark:bg-gray-900 h-10 rounded-full px-5 justify-center items-center flex-row gap-2">
                        <Text className="dark:text-slate-50 text-slate-800 text-sm">Unread</Text>
                        {unreadGroupCount > 0 ? (
                            <View className="bg-sky-400 rounded-full p-1 h-6 w-6 justify-center items-center">
                                <Text className="text-slate-900 text-xs">{unreadGroupCount}</Text>
                            </View>
                        ) : (null)}
                    </Pressable>
                    <Pressable className="bg-gray-100 dark:bg-gray-900 h-10 rounded-full p-1 px-5 justify-center items-center">
                        <Text className="dark:text-slate-50 text-slate-800 text-sm">Favorites</Text>
                    </Pressable>
                </View>

                <View className="mt-1">
                    <FlatList data={filteredGroups} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 125 }} />
                </View>

            </SafeAreaView>
        </ThemeProvider>
    );
}