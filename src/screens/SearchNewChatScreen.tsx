import { FlatList, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { SearchListSocket } from "../socket/SearchListSocket";
import { formatChatTime } from "../util/DateFormatter";
import * as LocalAuthentication from 'expo-local-authentication';
import { blockUser } from "../api/UserService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { AuthContext } from "../components/AuthProvider";

type SearchChatScreenProps = NativeStackNavigationProp<RootStack, "SearchNewChatScreen">

export default function SearchNewChatScreen() {

    const { applied } = useTheme();

    const navigation = useNavigation<SearchChatScreenProps>();
    const [search, setSearch] = useState("");
    const searchList = SearchListSocket();
    const auth = useContext(AuthContext);

    const userId = auth?.userId ?? "0";
    const textInputMode = "text";

    const filteredContacts = searchList.filter((contact) => {
        return (
            contact.friendFirstName.toLowerCase().includes(search.toLowerCase()) ||
            contact.friendLastName.toLowerCase().includes(search.toLowerCase()) ||
            contact.contactNumber.includes(search)
        );
    });

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

    const renderItem = ({ item }: any) => (
        <Pressable className="flex-row items-center py-2 px-3 my-0.5" onPress={() => {
            if (item.lockedStatus && item.lockedStatus !== "LOCKED" && (item.savedStatus === "ACTIVE" || item.savedStatus === "UNSAVED")) {
                navigation.navigate("ChatScreen", {
                    contactId: item.friendId,
                    name: item.friendFirstName + " " + item.friendLastName,
                    lastSeen: formatChatTime(item.lastTimeStamp),
                    profileImg: item.profileImage ? item.profileImage : null,
                    savedStatus: item.savedStatus
                });
            }
        }}>
            <View>
                <Image source={item.profileImage ? (
                    { uri: item.profileImage }
                ) : item.savedStatus ? (
                    require("../../assets/default-profile.png")
                ) : (
                    { uri: `https://ui-avatars.com/api/?name=${item.friendFirstName}+${item.friendLastName}&background=random` }
                )} className="h-20 w-20 rounded-full" />
                <View className={`h-3 w-3 ${item.friendStatus === "ONLINE" ? (`bg-green-500`) : (`bg-gray-500`)} rounded-full self-end me-2 mt-[-13]`}></View>
            </View>
            <View className="flex-1 ms-3 flex-row justify-between">
                <View className="flex-col justify-center flex-1">
                    <Text className="font-bold flex-1 text-xl text-gray-600 dark:text-gray-300"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >{item.savedStatus ? (
                        item.friendFirstName + " " + item.friendLastName
                    ) : (
                        item.contactCountryCode + " " + item.contactNumber
                    )}</Text>
                    <Text className="text-gray-500 flex-1 text-base"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >{item.lockedStatus ? item.lockedStatus === "LOCKED" ? (`${item.contactCountryCode} ${item.contactNumber}`)
                        : item.lockedStatus === "NORMAL" && item.lastMessage
                            ? (`${item.lastMessage}`)
                            : (`${item.contactCountryCode} ${item.contactNumber}`)
                        : (`${item.friendFirstName} ${item.friendLastName}`)}</Text>
                </View>
                <View className="flex-col items-center justify-center">
                    {item.lockedStatus && item.lockedStatus === "LOCKED" ? (
                        <Pressable className="bg-gray-800 flex-row gap-2 px-5 py-2 justify-center items-center rounded-full"
                            onPress={async () => {
                                const unlocked = await authenticateUser();
                                if (unlocked) {
                                    navigation.navigate("ChatScreen", {
                                        contactId: item.friendId,
                                        name: item.friendFirstName + " " + item.friendLastName,
                                        lastSeen: formatChatTime(item.lastTimeStamp),
                                        profileImg: item.profileImage ? item.profileImage : null,
                                        savedStatus: item.savedStatus ? item.savedStatus : "UNSAVED"
                                    });
                                }
                            }}>
                            <Text className="text-slate-200 font-bold text-lg">Locked</Text>
                            <FontAwesome name="lock" size={18} color="white" />
                        </Pressable>
                    ) : item.savedStatus === "ACTIVE" || item.savedStatus === "UNSAVED" ? (
                        <View className="justify-between items-end flex-1">
                            <Text className={`font-light ms-1 text-sm ${item.unreadCount > 0 ? (`text-sky-500`) : (`text-gray-500`)}`}>{formatChatTime(item.lastMsgTimeStamp)}</Text>
                            {item.unreadCount > 0 && (
                                <View className="bg-sky-400 rounded-full h-6 w-6 justify-center items-center ms-2">
                                    <Text className="text-slate-700 text-xs font-bold">{item.unreadCount}</Text>
                                </View>
                            )}
                        </View>
                    ) : item.savedStatus === "BLOCKED" ? (
                        <Pressable className="bg-emerald-800/75 px-5 w-32 py-2 justify-center items-center rounded-full"
                            onPress={async () => {
                                const response = await blockUser(userId, item.friendId); /// auth user id

                                if (response.status) {
                                    navigation.replace("HomeScreen");
                                } else {
                                    Toast.show({
                                        type: ALERT_TYPE.WARNING,
                                        title: "Warning",
                                        textBody: response.msg,
                                    });
                                }
                            }}>
                            <Text className="text-slate-200 font-bold text-lg">Unblock</Text>
                        </Pressable>
                    ) : (
                        <Pressable className="px-5 w-28 py-2 bg-sky-800 justify-center items-center rounded-full"
                            onPress={() => {
                                navigation.navigate("ChatScreen", {
                                    contactId: item.friendId,
                                    name: item.friendFirstName + " " + item.friendLastName,
                                    lastSeen: formatChatTime(item.lastTimeStamp),
                                    profileImg: item.profileImage ? item.profileImage : null,
                                    savedStatus: item.savedStatus ? item.savedStatus : "UNSAVED"
                                });
                            }}>
                            <Text className="text-slate-200 font-bold text-lg">Chat</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </Pressable>
    );

    return (
        <ThemeProvider>
            <SafeAreaView className="flex-1 bg-white dark:bg-black">
                <View className="p-3 gap-3 items-center flex-row">
                    <Pressable onPress={() => navigation.goBack()}>
                        <AntDesign name="caret-left" size={24} color={`${applied === "light" ? (`#6b7280`) : (`#9ca3af`)}`} />
                    </Pressable>
                    <Text className="text-sky-600 dark:text-sky-500 font-bold text-3xl">Messenger</Text>
                </View>
                <View className="p-3 mb-3">
                    <View className="bg-gray-100 dark:bg-gray-900 h-14 flex-row w-full rounded-full p-1 px-3">
                        <TextInput placeholder="Search" className="dark:text-slate-300 text-slate-500 font-bold text-base" inputMode={textInputMode}
                            placeholderTextColor={applied === "light" ? ("#64748b") : ("#cbd5e1")} value={search} onChangeText={(text) => setSearch(text)} />
                    </View>
                </View>

                <View className="m-3 ml-5">
                    <Text className="dark:text-slate-400 font-bold text-2xl">Suggestions</Text>
                </View>

                <View className="mt-3">
                    <FlatList data={filteredContacts} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 125 }} />
                </View>

                {/* <View className="absolute bg-sky-600 bottom-8 right-8 h-16 w-16 rounded-full">
                    <TouchableOpacity className="h-16 w-16 rounded-full justify-center items-center">
                        <MaterialCommunityIcons name="message-plus" size={24} color="white" className="scale-x-[-1] scale-y-[-1]" />
                    </TouchableOpacity>
                </View> */}

            </SafeAreaView>
        </ThemeProvider>
    );
}