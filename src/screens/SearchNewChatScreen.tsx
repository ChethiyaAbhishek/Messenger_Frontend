import { FlatList, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const chats = [
    {
        id: 1,
        name: "Sahan Perera",
        lastMessage: "Hello, Kamal",
        time: "9:46 pm",
        unread: 2,
        profile: require("../../assets/avatar/avatar_1.png")
    },
    {
        id: 2,
        name: "077 1236789",
        lastMessage: "~ Busy ~",
        time: "",
        unread: 0,
        profile: require("../../assets/avatar/avatar_2.png")
    },
    {
        id: 3,
        name: "Janithi Perera AllahuAkbar",
        lastMessage: "Hello, Kusal",
        time: "2025/9/24",
        unread: 0,
        profile: require("../../assets/avatar/avatar_3.png")
    },
    {
        id: 4,
        name: "Kusal Perera",
        lastMessage: "Hello, Janith",
        time: "10:00 pm",
        unread: 3,
        profile: require("../../assets/avatar/avatar_4.png")
    },
    {
        id: 5,
        name: "Supun Perera",
        lastMessage: "Hello, Sahan",
        time: "9:46 pm",
        unread: 2,
        profile: require("../../assets/avatar/avatar_5.png")
    },
    {
        id: 6,
        name: "Ayesha Perera",
        lastMessage: "Hello, Ayesha",
        time: "9:46 pm",
        unread: 0,
        profile: require("../../assets/avatar/avatar_6.png")
    },
    {
        id: 7,
        name: "Ayesha Perera",
        lastMessage: "Hello, Ayesha",
        time: "9:46 pm",
        unread: 0,
        profile: require("../../assets/avatar/avatar_6.png")
    },
    {
        id: 8,
        name: "Ayesha Perera",
        lastMessage: "Hello, Ayesha",
        time: "9:46 pm",
        unread: 0,
        profile: require("../../assets/avatar/avatar_6.png")
    },
];

type SearchChatScreenProps = NativeStackNavigationProp<RootStack, "SearchNewChatScreen">

export default function SearchNewChatScreen() {

    const { applied } = useTheme();

    const navigation = useNavigation<SearchChatScreenProps>();
    const [search, setSearch] = useState("");

    const textInputMode = "text";

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
            <View>
                <Image source={item.profile} className="h-20 w-20 rounded-full" />
                <View className="h-3 w-3 bg-green-500 rounded-full self-end me-2 mt-[-13]"></View>
            </View>
            <View className="flex-1 ms-3 flex-row justify-between">
                <View className="flex-col justify-center flex-1">
                    <Text className="font-bold flex-1 text-xl text-gray-600 dark:text-gray-300"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >{item.name}</Text>
                    <Text className="text-gray-500 flex-1 text-base"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >{item.lastMessage}</Text>
                </View>
                <View className="flex-col items-center justify-center">
                    {item.time ? (
                        <View className="justify-between items-center flex-1">
                            <Text className={`font-light ms-1 text-sm ${item.unread > 0 ? (`text-sky-500`) : (`text-gray-500`)}`}>{item.time}</Text>
                            {item.unread > 0 && (
                                <View className="bg-sky-400 rounded-full h-6 w-6 justify-center items-center ms-2">
                                    <Text className="text-slate-700 text-xs font-bold">{item.unread}</Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        <Pressable className="bg-sky-600 px-5 w-28 py-2 justify-center items-center rounded-full">
                            <Text className="text-slate-200 font-bold text-lg">Chat</Text>
                        </Pressable>
                    )}

                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemeProvider>
            <SafeAreaView className="flex-1 bg-white dark:bg-black">
                <View className="p-3 gap-3 items-center flex-row">
                    <Pressable onPress={()=>navigation.goBack()}>
                        <AntDesign name="caret-left" size={24} color={`${applied === "light" ? (`#6b7280`) : (`#9ca3af`)}`} />
                    </Pressable>
                    <Text className="text-sky-600 dark:text-sky-500 font-bold text-3xl">Messenger</Text>
                    <View className="justify-center items-center flex-row gap-5">
                        {/* <Pressable className="justify-center items-center">
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
                        </Pressable> */}
                    </View>
                </View>
                <View className="p-3 mb-3">
                    <View className="bg-gray-100 dark:bg-gray-900 h-14 flex-row w-full rounded-full p-1 px-3">
                        <TextInput placeholder="Search" className="dark:text-slate-300 w-11/12 text-slate-500 font-bold text-base" inputMode={textInputMode}
                            placeholderTextColor={applied === "light" ? ("#64748b") : ("#cbd5e1")} value={search} onChangeText={(text) => setSearch(text)} />
                        <Pressable className="w-1/12 justify-center items-center">
                            <Entypo name="dial-pad" size={24} color="#6b7280" />
                        </Pressable>
                    </View>
                </View>

                <View className="m-3 ml-5">
                    <Text className="dark:text-slate-400 font-bold text-2xl">Your Contacts</Text>
                </View>

                <View className="mt-3">
                    <FlatList data={filteredChats} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 125 }} />
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