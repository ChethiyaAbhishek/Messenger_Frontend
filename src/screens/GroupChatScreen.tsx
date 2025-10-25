import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useContext, useLayoutEffect, useState } from "react";
import { AntDesign, Entypo, FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { Chat, GroupChat, GroupChatPayload } from "../socket/Chat";
import { formatChatDate, formatChatTime, formatTime } from "../util/DateFormatter";
import { SendChatSocket } from "../socket/SendChatSocket";
import { GroupMsgsSocket } from "../socket/GroupMsgsSocket";
import { SendGroupChatSocket } from "../socket/SendGroupChatSocket";
import { AuthContext } from "../components/AuthProvider";

type GroupChatScreenProp = NativeStackScreenProps<RootStack, "GroupChatScreen">;

export default function GroupChatScreen({ route, navigation }: GroupChatScreenProp) {

    const { groupId, profileImg } = route.params;
    const groupChat = GroupMsgsSocket(parseInt(groupId));
    const messages = groupChat.messages;
    const group = groupChat.group;
    const sendMessage = SendGroupChatSocket();
    const [input, setInput] = useState("");
    const auth = useContext(AuthContext);

    const userId = auth?.userId ?? "0";

    let chatDate = "";
    let set = true;
    let last = false;
    // let prevSender = 0;
    // let prevStatus = "";

    // let prevData:Chat = null;

    const { applied } = useTheme();

    const colors = applied === "dark" ? [
        'bg-green-200/20',
        'bg-yellow-200/20',
        'bg-pink-200/20',
        'bg-indigo-200/20',
        'bg-red-200/20'
    ] : [
        'bg-green-900/30',
        'bg-yellow-900/30',
        'bg-pink-900/30',
        'bg-indigo-900/30',
        'bg-red-900/30'
    ];

    const renderItem = ({ item, index }: { item: GroupChatPayload, index: number }) => {
        const user = item.chat.fromUser.id === parseInt(userId); ////// ----------- set from auth
        let showDate = false;
        let group = false;

        let curSender = item.chat.fromUser.id;
        let curStatus = item.chat.status;

        if (set) {
            chatDate = formatChatDate(item.chat.createdAt);
            set = false;
        }

        if (chatDate !== formatChatDate(item.chat.createdAt)) {
            showDate = true;
            set = true;
        }

        if (index === messages.length - 1) {
            last = true;
        }

        // if(prevSender === curSender && prevStatus === curStatus){
        //     group = true;
        //     prevSender = curSender;
        //     prevStatus = curStatus;
        // }

        return (
            <View className="mt-4">

                <View>
                    {last ? (
                        <View className="mb-3">
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-slate-600 dark:text-slate-200 text-sm tracking-wider">{formatChatDate(item.chat.createdAt)}</Text>
                            </View>
                        </View>
                    ) : (null)}
                    {user ? (null) : (
                        <View className="flex-row gap-2 items-center">
                            <Image source={item.contactProfileImg && item.contactStatus ? (
                                { uri: item.contactProfileImg }
                            ) : item.contactStatus && item.contactStatus === "ACTIVE" ? (
                                require("../../assets/default-profile.png")
                            ) : (
                                { uri: `https://ui-avatars.com/api/?name=${item.chat.fromUser.firstName}+${item.chat.fromUser.lastName}&background=random` }
                            )} className={`h-6 w-6 rounded-full ${user ? (`self-end`) : (`self-start`)}`} />

                            <View className={`${colors[Math.floor(Math.random() * colors.length)]} px-3 rounded-full justify-center items-center`}>
                                <Text className="dark:text-slate-100 text-slate-800 tracking-wider">{item.contactStatus && item.contactStatus === "ACTIVE"
                                    ? item.chat.fromUser.firstName + " " + item.chat.fromUser.lastName
                                    : item.chat.fromUser.countryCode + " " + item.chat.fromUser.contactNo}</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View className={`my-1 px-3 py-1 mt-2 max-w-[75%]
                ${user ? `self-end bg-sky-600 rounded-tl-xl rounded-bl-xl rounded-br-lg rounded-tr-sm` : `self-start bg-gray-700 rounded-tr-xl rounded-br-xl rounded-bl-lg rounded-tl-sm`}`}>
                    <Text className={`text-white text-base`}>{item.chat.message}</Text>
                </View>
                <View className="justify-end">
                    <Text className={`text-slate-400 text-xs ${user ? (`self-end me-2`) : (`self-start ml-2`)} `}>{formatTime(item.chat.createdAt)}
                        {user && <Ionicons size={15}
                            color={item.chat.status === "READ" ? "#0284c7" : "#64748b"}
                            name={item.chat.status === "READ" ? "checkmark-done-sharp" : item.chat.status === "DELIVERED" ? "checkmark-done-sharp" : "checkmark"} />}
                    </Text>
                </View>

                {showDate ? (
                    <View>
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-slate-600 dark:text-slate-200 text-sm tracking-wider">{chatDate}</Text>
                        </View>
                    </View>
                ) : (
                    null
                )}
            </View>

        );
    }

    const handleSendChat = () => {
        if (!input.trim()) {
            return;
        }
        sendMessage(parseInt(groupId), input);
        setInput("");
    };

    const chatHeader = () => {
        return (
            <View className="flex-1 justify-center items-center">
                <Image source={profileImg ? (
                    { uri: profileImg }
                ) : (
                    require("../../assets/default-profile.png")
                )} className="h-44 w-44 rounded-full" />
                <Text className="text-3xl font-bold text-slate-700 dark:text-slate-200 m-5">{group?.groupName}</Text>

                <Pressable className="p-2 rounded-full h-12 px-10 bg-gray-200 dark:bg-gray-800 justify-center items-center "
                    onPress={() => {
                        navigation.navigate("GroupProfileScreen", {
                            groupId: parseInt(groupId)
                        })
                    }}>
                    <Text className="text-slate-600 dark:text-slate-100 font-bold">View Profile</Text>
                </Pressable>

                <View className="m-3 justify-center flex-row w-72 mb-5">
                    <FontAwesome name="lock" size={15} color="#94a3b8" />
                    <Text className="dark:text-slate-400 text-slate-500 text-center text-xs">Messages and Calls are secured with end-to-end encryption. Only people in this chat can read, listen to, or share them.</Text>
                </View>

                <View className="justify-center items-center mb-16">
                    <View className="dark:bg-gray-900/75 bg-gray-200/75 p-1 justify-center items-center px-4 rounded-full">
                        <Text className="dark:text-gray-600 text-gray-400 tracking-wider text-sm">Created on {formatChatDate(group?.createdAt ? group.createdAt : "")}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const chatFooter = () => {

        if (group?.lockedStatus !== "ACTIVE") {
            return (
                <View className="justify-center items-center my-5">
                    <View className="dark:bg-gray-900/75 bg-gray-200/75 p-1 justify-center items-center px-4 rounded-full">
                        <Text className="dark:text-gray-600 text-gray-400 tracking-wider text-sm">{group?.lockedStatus === "LEFT" ? (
                            "YOU LEFT THE GROUP"
                        ) : group?.lockedStatus === "REMOVED" ? (
                            "REMOVED BY THE ADMIN"
                        ) : ("")}</Text>
                    </View>
                </View>
            );
        }
    }

    return (
        <ThemeProvider>

            <SafeAreaView className="flex-1 bg-white dark:bg-black">

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} className="flex-1">

                    <View className="flex-row justify-between">
                        <View className="flex-row items-center gap-2 p-4">
                            <Pressable onPress={() => navigation.goBack()}>
                                <AntDesign name="caret-left" size={24} color={`${applied === "light" ? (`#0284c7`) : (`#0ea5e9`)}`} />
                            </Pressable>
                            <Pressable className="flex-row items-center"
                                onPress={() => {
                                    navigation.navigate("GroupProfileScreen", {
                                        groupId: parseInt(groupId)
                                    })
                                }}>
                                <View className="dark:border-gray-700 border-gray-300 border-2 p-1 rounded-full">
                                    <Image source={profileImg ? (
                                        { uri: profileImg }
                                    ) : (
                                        require("../../assets/default-profile.png")
                                    )} className="h-12 w-12 rounded-full" />
                                </View>
                                <View className="space-y-2 ms-2">
                                    <Text className="font-bold text-xl text-slate-700 dark:text-slate-200" numberOfLines={1}
                                        ellipsizeMode="tail">{group?.groupName}</Text>
                                    {/* <Text className={`text-sm ${contact && contact.status === "ONLINE" ? (`text-sky-300 font-bold`) : (`text-gray-500`)}`}>
                                    {contact ? contact.status === "ONLINE" ?
                                        (`Online`)
                                        : (`Active at ${formatChatTime(contact.updatedAt)}`)
                                        : (`Active at ${lastSeen}`)}
                                </Text> */}
                                </View>
                            </Pressable>
                        </View>
                        <View className="flex-row gap-3 p-4 items-center justify-center">
                            <Pressable>
                                <Ionicons name="call" size={22} color="#0ea5e9" />
                            </Pressable>
                            <Pressable>
                                <Ionicons name="videocam" size={26} color="#0ea5e9" />
                            </Pressable>
                            <Pressable>
                                <MaterialCommunityIcons name="information-slab-circle" size={24} color="#0ea5e9" />
                            </Pressable>
                        </View>
                    </View>

                    <FlatList data={messages} renderItem={renderItem} className="px-3 flex-1" contentContainerStyle={{ paddingBottom: 60 }}
                        keyExtractor={(item) => item.chat.id.toString()} inverted ListFooterComponent={chatHeader} ListHeaderComponent={chatFooter} />

                    <View className="flex-row p-2 bottom-0 right-0 gap-2 items-center">
                        <View className="flex-row gap-2 justify-center items-center">
                            <FontAwesome name="camera" size={20} color={applied === "light" ? (`#0284c7`) : (`#0ea5e9`)} />
                            <FontAwesome6 name="image" size={20} color={applied === "light" ? (`#0284c7`) : (`#0ea5e9`)} />
                        </View>
                        <TextInput value={input} onChangeText={(text) => setInput(text)} multiline placeholder="Message" editable={group?.lockedStatus === "ACTIVE"}
                            placeholderTextColor={applied === "light" ? ("#1e293b") : ("#e2e8f0")}
                            className="flex-1 min-h-12 max-h-32 h-auto px-5 py-2 bg-gray-300 dark:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-3xl text-base" />
                        <TouchableOpacity className="w-10 items-center justify-center rounded-full"
                            onPress={handleSendChat}>
                            <Ionicons name="send" size={24} color={applied === "light" ? (`#0284c7`) : (`#0ea5e9`)} />
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>

            </SafeAreaView>
        </ThemeProvider>
    );
}