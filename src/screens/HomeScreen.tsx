import { FlatList, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ChatListSocket } from "../socket/ChatListSocket";
import { formatChatTime } from "../util/DateFormatter";

const status = [
    {
        id: 1,
        name: "You",
        image: require("../../assets/avatar/avatar_6.png"),
        status: "seen"
    },
    {
        id: 2,
        name: "Sahan",
        image: require("../../assets/avatar/avatar_2.png"),
        status: "unseen"
    },
    {
        id: 3,
        name: "Sahan",
        image: require("../../assets/avatar/avatar_5.png"),
        status: "seen"
    },
    {
        id: 4,
        name: "Sahan",
        image: require("../../assets/avatar/avatar_5.png"),
        status: "seen"
    },
    {
        id: 5,
        name: "Sahan",
        image: require("../../assets/avatar/avatar_5.png"),
        status: "seen"
    },
    {
        id: 6,
        name: "Sahan",
        image: require("../../assets/avatar/avatar_5.png"),
        status: "seen"
    },
];

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">

export default function HomeScreen() {

    const { applied } = useTheme();
    const navigation = useNavigation<HomeScreenProps>();

    const [search, setSearch] = useState("");
    const chatList = ChatListSocket();


    const filteredChats = chatList.filter((chat) => {
        return (
            chat.friendFirstName.toLowerCase().includes(search.toLowerCase()) ||
            chat.friendLastName.toLowerCase().includes(search.toLowerCase()) ||
            chat.contactNumber.includes(search)
        );
    });

    const renderItem = ({ item }: any) => (
        <TouchableOpacity className="flex-row items-center py-2 px-3 my-0.5"
            onPress={() => {
                navigation.navigate("ChatScreen", {
                    contactId: item.friendId,
                    name: item.friendFirstName + " " + item.friendLastName,
                    lastSeen: formatChatTime(item.lastTimeStamp),
                    profileImg: item.profileImage ? item.profileImage : null,
                });
            }}>
            <View>
                <Image source={item.savedStatus === "UNSAVED"
                    ? ({ uri: `https://ui-avatars.com/api/?name=${item.friendFirstName}+${item.friendLastName}` })
                    : item.profileImage ? ({ uri: item.profileImage })
                        : (require("../../assets/default-profile.png"))}
                    className="h-20 w-20 rounded-full" />
                <View className={`h-3 w-3 ${item.friendStatus === "ONLINE" ? (`bg-green-500`) : (`bg-gray-500`)} rounded-full self-end me-2 mt-[-13]`}></View>
            </View>
            <View className="flex-1 ms-3">
                <View className="flex-row justify-between">
                    <Text className="font-semibold flex-1 text-xl text-gray-600 dark:text-gray-300"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.savedStatus === "UNSAVED"
                            ? (item.contactCountryCode + " " + item.contactNumber)
                            : (item.friendFirstName + " " + item.friendLastName)}</Text>
                    <Text className={`font-light ms-1 text-sm ${item.unreadCount > 0 ? (`text-sky-500`) : (`text-gray-500`)}`}>{formatChatTime(item.lastMsgTimeStamp)}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 flex-1 text-base"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >{item.lastMessage}</Text>
                    {item.unreadCount > 0 && (
                        <View className="bg-sky-400 rounded-full h-6 w-6 justify-center items-center ms-2">
                            <Text className="text-slate-700 text-xs font-bold">{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderStatus = ({ item }: any) => (
        <TouchableOpacity className="flex-col items-center py-2 px-3 my-0.5"
            onPress={() => {
                // navigation.navigate("SingleChatScreen", {
                //     chatId: 1,
                //     friendName: "Kusal Omega",
                //     lastSeenTime: "8:07 pm",
                //     profileImage: require("../../assets/avatar/avatar_1.png"),
                // });
            }}>
            <View className={`border-2 ${item.status === "seen" && applied === "dark" ? (`border-gray-700`)
                : item.status === "seen" && applied === "light" ? (`border-gray-400`)
                    : item.status === "unseen" && applied === "dark" ? (`border-sky-300`)
                        : (`border-sky-500`)} rounded-full ${item.name === "You" ? (`border-dashed`) : (`border-solid`)} p-1`}>
                <Image source={item.image} className={`h-16 w-16 rounded-full ${item.status === "seen" ? (`opacity-45`) : (`opacity-70`)}`} />
            </View>
            <Text className="dark:text-slate-100 text-slate-600 mt-2">{item.name}</Text>
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
                        <TextInput placeholder="Search" className="dark:text-slate-300 text-slate-500 text-base"
                            placeholderTextColor={applied === "light" ? ("#64748b") : ("#cbd5e1")} value={search} onChangeText={(text) => setSearch(text)} />
                    </View>
                </View>

                <View className="mt-3">
                    <Text className="dark:text-slate-300 px-5">Recent Stories</Text>
                    <FlatList data={status} renderItem={renderStatus} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 5, paddingTop: 5 }} />
                </View>

                <View className="mt-1">
                    <FlatList data={filteredChats} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 125 }} />
                </View>

                <Pressable className="absolute bg-sky-600 bottom-8 right-8 h-16 w-16 rounded-full items-center justify-center"
                    onPress={() => navigation.navigate("SearchNewChatScreen")}>
                    <MaterialCommunityIcons name="message-plus" size={24} color="white" className="scale-x-[-1] scale-y-[-1]" />
                </Pressable>

            </SafeAreaView>
        </ThemeProvider>
    );
}