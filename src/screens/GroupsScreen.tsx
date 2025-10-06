import { FlatList, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const chats = [
    {
        id: 1,
        name: "Music Group",
        lastSender: "Yonal",
        lastMessage: "Hello, Kamal",
        time: "9:46 pm",
        unread: 2,
        profile: require("../../assets/avatar/avatar_1.png")
    },
    {
        id: 2,
        name: "Fathima Kushra AllahuAkbar",
        lastSender: "Sunil",
        lastMessage: "Hello, Sahan. How are you doing? I was just checking on you.",
        time: "Yesterday",
        unread: 2,
        profile: require("../../assets/avatar/avatar_2.png")
    },
    {
        id: 3,
        name: "Janithi Perera",
        lastSender: "Yonal",
        lastMessage: "Hello, Kusal",
        time: "2025/9/24",
        unread: 0,
        profile: require("../../assets/avatar/avatar_3.png")
    },
    {
        id: 4,
        name: "Kusal Perera",
        lastSender: "Yonal",
        lastMessage: "Hello, Janith",
        time: "10:00 pm",
        unread: 3,
        profile: require("../../assets/avatar/avatar_4.png")
    },
    {
        id: 5,
        name: "Supun Perera",
        lastSender: "Yonal",
        lastMessage: "Hello, Sahan",
        time: "9:46 pm",
        unread: 2,
        profile: require("../../assets/avatar/avatar_5.png")
    },
    {
        id: 6,
        name: "Ayesha Perera",
        lastSender: "Yonal",
        lastMessage: "Hello, Ayesha",
        time: "9:46 pm",
        unread: 0,
        profile: require("../../assets/avatar/avatar_6.png")
    },
    {
        id: 7,
        name: "Ayesha Perera",
        lastSender: "Yonal",
        lastMessage: "Hello, Ayesha",
        time: "9:46 pm",
        unread: 0,
        profile: require("../../assets/avatar/avatar_6.png")
    },
    {
        id: 8,
        name: "Ayesha Perera",
        lastSender: "Yonal",
        lastMessage: "Hello, Ayesha",
        time: "9:46 pm",
        unread: 0,
        profile: require("../../assets/avatar/avatar_6.png")
    },
];

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">

export default function GroupsScreen() {

    const { applied } = useTheme();

    const navigation = useNavigation<HomeScreenProps>();
    const [search, setSearch] = useState("");

    const filteredChats = chats.filter((chat) => {
        return (
            chat.name.toLowerCase().includes(search.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(search.toLowerCase())
        );
    });

    const renderItem = ({ item }: any) => (
        <TouchableOpacity className="flex-row items-center py-2 px-3 my-0.5"
            onPress={() => {
                // navigation.navigate("SingleChatScreen", {
                //     chatId: 1,
                //     friendName: "Kusal Omega",
                //     lastSeenTime: "8:07 pm",
                //     profileImage: require("../../assets/avatar/avatar_1.png"),
                // });
            }}>
            <Image source={item.profile} className="h-20 w-20 rounded-full" />
            <View className="flex-1">
                <View className="flex-row justify-between">
                    <Text className="font-bold flex-1 text-xl text-gray-600 dark:text-gray-300"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >{item.name}</Text>
                    <Text className={`font-light ms-1 text-sm ${item.unread > 0 ? (`text-sky-500`) : (`text-gray-500`)}`}>{item.time}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 flex-1 text-base"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        <Text className="font-bold">{item.lastSender}</Text>
                        : {item.lastMessage}</Text>
                    {item.unread > 0 && (
                        <View className="bg-sky-400 rounded-full h-6 w-6 justify-center items-center ms-2">
                            <Text className="text-slate-700 text-xs font-bold">{item.unread}</Text>
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
                    <Pressable className="bg-gray-100 dark:bg-gray-900 h-10 rounded-full p-1 px-5 justify-center items-center">
                        <Text className="dark:text-slate-50 text-slate-800 text-sm">Create New Group</Text>
                    </Pressable>
                    <Pressable className="bg-gray-100 dark:bg-gray-900 h-10 rounded-full px-5 justify-center items-center flex-row gap-2">
                        <Text className="dark:text-slate-50 text-slate-800 text-sm">Unread</Text>
                        <View className="bg-sky-400 rounded-full p-1 h-6 w-6 justify-center items-center">
                            <Text className="text-slate-900 text-xs">2</Text>
                        </View>
                    </Pressable>
                    <Pressable className="bg-gray-100 dark:bg-gray-900 h-10 rounded-full p-1 px-5 justify-center items-center">
                        <Text className="dark:text-slate-50 text-slate-800 text-sm">Favorites</Text>
                    </Pressable>
                </View>

                <View className="mt-1">
                    <FlatList data={filteredChats} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 125 }} />
                </View>

                <View className="absolute bg-sky-600 bottom-8 right-8 h-16 w-16 rounded-full">
                    <TouchableOpacity className="h-16 w-16 rounded-full justify-center items-center">
                        <MaterialCommunityIcons name="message-plus" size={24} color="white" className="scale-x-[-1] scale-y-[-1]" />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </ThemeProvider>
    );
}