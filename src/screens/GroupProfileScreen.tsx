import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useContext, useState } from "react";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { DarkTheme, useFocusEffect, useNavigation } from "@react-navigation/native";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { validateContactNo, validateCountryCode, validateFirstName, validateLastName, validatePassword } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import * as LocalAuthentication from 'expo-local-authentication';
import { ContactProfileDetailsSocket } from "../socket/ContactProfileDetailsSocket";
import { blockUser, setChatLock, setGroupLock, updateContactStatus } from "../api/UserService";
import { GroupProfileDetailsSocket } from "../socket/GroupProfileDetailsSocket";
import { formatChatDate, formatChatTime } from "../util/DateFormatter";
import { ContactProfile } from "../socket/Chat";
import { RemoveGroupMemberSocket } from "../socket/RemoveGroupMemberSocket";
import { LeaveGroupSocket } from "../socket/LeaveGroupSocket";
import { DeleteGroupSocket } from "../socket/DeleteGroupSocket";
import { AuthContext } from "../components/AuthProvider";

type GroupProfileScreenProps = NativeStackScreenProps<RootStack, "GroupProfileScreen">;

const media = [
    {
        id: 1,
        date: "07 OCT 2025",
        image: require("../../assets/status_img.jpg"),
    },
    {
        id: 2,
        date: "07 OCT 2025",
        image: require("../../assets/status_img2.jpg"),
    },
    {
        id: 3,
        date: "07 OCT 2025",
        image: require("../../assets/status_img.jpg"),
    },
    {
        id: 4,
        date: "07/10/2025",
        image: require("../../assets/status_img.jpg"),
    },
    {
        id: 5,
        date: "07 OCT 2025",
        image: require("../../assets/status_img.jpg"),
    },
    {
        id: 6,
        date: "07 OCT 2025",
        image: require("../../assets/status_img.jpg"),
    },
];

export default function GroupProfileScreen({ route, navigation }: GroupProfileScreenProps) {

    const { groupId } = route.params;
    const groupDetails = GroupProfileDetailsSocket(groupId);
    const group = groupDetails.group;
    const members = groupDetails.members;
    const removeMember = RemoveGroupMemberSocket();
    const leaveGroup = LeaveGroupSocket();
    const deleteGroup = DeleteGroupSocket();
    const auth = useContext(AuthContext);

    const userId = auth?.userId ? parseInt(auth.userId) : 0; // ---- auth

    const { applied } = useTheme();

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

    const renderMedia = ({ item }: any) => (
        <TouchableOpacity className="items-center p-2"
            onPress={() => { }}>
            <View>
                <View className="bg-gray-600/50 rounded-t-lg items-center z-10">
                    <Text className="text-slate-100 text-sm">{item.date}</Text>
                </View>
                <Image source={item.image} className={`h-36 w-36 rounded-lg mt-[-18]`} />
            </View>
        </TouchableOpacity>
    );

    const renderMember = ({ item }: { item: ContactProfile }) => {
        return (
            <View className="p-2">
                <View className="dark:bg-gray-700/45 bg-gray-300/75 rounded-xl">
                    <View className={`${item.groupStatus === "ADMIN" ? (`dark:bg-sky-300/65 bg-sky-700/65`) : (`dark:bg-emerald-300/65 bg-emerald-700/65`)} rounded-t-xl justify-center items-center`}>
                        <Text className="text-sm tracking-wider text-slate-200">{item.groupStatus}</Text>
                    </View>
                    <View className="p-3 gap-2">
                        <View className="flex-row gap-2 items-center">
                            <Image source={item.profileImage ? (
                                { uri: item.profileImage }
                            ) : item.contactStatus && item.contactStatus === "ACTIVE" ? (
                                require("../../assets/default-profile.png")
                            ) : (
                                { uri: `https://ui-avatars.com/api/?name=${item.contact.firstName}+${item.contact.lastName}&background=random` }
                            )} className="w-10 h-10 rounded-full" />
                            <View>
                                <Text className="dark:text-slate-200 text-slate-800 font-bold">{userId === item.contact.id || item.contactStatus && item.contactStatus === "ACTIVE" ? (
                                    item.contact.firstName + " " + item.contact.lastName
                                ) : (
                                    item.contact.countryCode + " " + item.contact.contactNo
                                )}</Text>
                                <Text className="dark:text-slate-400 text-slate-600 text-sm">{userId === item.contact.id || item.contactStatus && item.contactStatus === "ACTIVE" ? (
                                    item.contact.countryCode + " " + item.contact.contactNo
                                ) : (
                                    item.contact.firstName + " " + item.contact.lastName
                                )}</Text>
                            </View>
                        </View>
                        {group?.memberStatus === "ADMIN" ? (
                            <View className="p-1">
                                <Pressable className="bg-red-400/35 px-2 rounded-full p-2 border-2 border-red-600/35 justify-center items-center"
                                    onPress={() => {
                                        if (item.contact.id === userId) {
                                            leaveGroup(groupId);
                                        } else {
                                            removeMember(groupId, item.contact.id);
                                        }
                                    }}>
                                    <Text className="dark:text-slate-300 text-slate-800 tracking-wider">{item.contact.id === userId ? ("Leave") : ("Remove")}</Text>
                                </Pressable>
                            </View>
                        ) : (null)}

                        <View className="p-1">
                            <Pressable className="dark:bg-black/30 bg-white/50 px-2 rounded-full p-2 justify-center items-center"
                                onPress={async () => {
                                    if (userId !== item.contact.id) {
                                        if (item.contactLockStatus && item.contactLockStatus === "LOCKED") {
                                            const unlocked = await authenticateUser();
                                            if (unlocked) {
                                                navigation.navigate("ChatScreen", {
                                                    contactId: (item.contact.id).toString(),
                                                    name: item.contact.firstName + " " + item.contact.lastName,
                                                    lastSeen: formatChatTime(item.contact.updatedAt),
                                                    profileImg: item.profileImage ? item.profileImage : null,
                                                    savedStatus: item.contactStatus ? item.contactStatus : ""
                                                });
                                            }
                                        } else if (item.contactStatus && item.contactStatus === "BLOCKED") {
                                            const response = await blockUser(userId.toString(), (item.contact.id).toString()); /// auth user id

                                            if (response.status) {
                                                navigation.replace("HomeScreen");
                                            } else {
                                                Toast.show({
                                                    type: ALERT_TYPE.WARNING,
                                                    title: "Warning",
                                                    textBody: response.msg,
                                                });
                                            }
                                        } else {
                                            navigation.navigate("ChatScreen", {
                                                contactId: (item.contact.id).toString(),
                                                name: item.contact.firstName + " " + item.contact.lastName,
                                                lastSeen: formatChatTime(item.contact.updatedAt),
                                                profileImg: item.profileImage ? item.profileImage : null,
                                                savedStatus: item.contactStatus ? item.contactStatus : ""
                                            });
                                        }
                                    }
                                }}>
                                <Text className="dark:text-slate-300 text-slate-700">{
                                    userId === item.contact.id ? (
                                        "You"
                                    ) : item.contactLockStatus && item.contactLockStatus === "LOCKED" ? (
                                        "Locked Chat"
                                    ) : item.contactStatus && item.contactStatus === "ACTIVE" ? (
                                        "Chat"
                                    ) : item.contactStatus && item.contactStatus === "BLOCKED" ? (
                                        "Unblock"
                                    ) : (
                                        "Save Contact"
                                    )
                                }</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <ThemeProvider>
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} className="flex-1 justify-center items-center">
                <SafeAreaView className="flex-1 items-center w-full bg-sky-600 h-full">
                    <StatusBar hidden={false} className="bg-sky-600" />

                    <View className="flex-row items-center mt-3">
                        <View className="w-2/12">
                            <Pressable onPress={() => navigation.goBack()} className="bg-slate-100/40 w-10 h-10 ml-3 border-2 border-slate-100/50 rounded-full justify-center items-center">
                                <AntDesign name="left" size={18} color="white" />
                            </Pressable>
                        </View>
                        <View className="w-8/12 justify-center items-center">
                            <Text className="text-slate-100 text-4xl font-bold">Messenger</Text>
                        </View>
                        <View className="w-2/12"></View>
                    </View>

                    <View className="dark:bg-black bg-white w-full flex-1 rounded-t-[28] mt-5 p-4">
                        <View className="gap-3 my-3 items-center">
                            <View className="space-y-2 items-center mt-3">
                                <Text className="font-bold text-3xl text-slate-700 dark:text-slate-200" numberOfLines={1}
                                    ellipsizeMode="tail">{group?.groupName}</Text>
                                <Text className={`text-lg text-gray-500`}>
                                    {group?.memberCount} Members
                                </Text>
                            </View>
                            <View className="dark:border-gray-700 border-gray-400 border-2 p-1 rounded-full">
                                <Image source={group?.profileImg ? (
                                    { uri: group.profileImg }
                                ) : (
                                    require("../../assets/default-profile.png")
                                )} className="w-44 h-44 rounded-full" />
                            </View>
                            <View className="px-4 p-1 rounded-full bg-gray-700/30">
                                <Text className="text-sm text-slate-500 tracking-wider">Created on {formatChatDate(group?.createdAt ? group.createdAt : "")}</Text>
                            </View>
                        </View>

                        <View className="w-full items-center">
                            <View className="flex-row w-5/6 p-2 justify-between">

                                <View className={`items-center ${group?.userStatus !== "ACTIVE" ? (`opacity-30`) : (``)}`}>
                                    <Pressable className="dark:bg-gray-700/50 bg-gray-800/75 py-3 px-5 rounded-xl"
                                        disabled={group?.userStatus !== "ACTIVE"}
                                        onPress={async () => {
                                            if (group?.userStatus === "ACTIVE") {
                                                const response = await setGroupLock(userId.toString(), groupId.toString()); /// auth user id

                                                if (response.status) {
                                                    navigation.replace("HomeScreen");
                                                } else {
                                                    Toast.show({
                                                        type: ALERT_TYPE.WARNING,
                                                        title: "Warning",
                                                        textBody: response.msg,
                                                    });
                                                }
                                            }
                                        }}>
                                        {group?.lockedStatus === "LOCKED" ? (
                                            <MaterialCommunityIcons name="lock-minus" size={23} color="white" />
                                        ) : (
                                            <FontAwesome name="lock" size={24} color="white" />
                                        )}
                                    </Pressable>
                                    <Text className="dark:text-slate-200 text-slate-600 text-sm mt-1">
                                        {group?.lockedStatus === "LOCKED" ? (
                                            "Reset"
                                        ) : (
                                            "Lock"
                                        )}
                                    </Text>
                                </View>
                                <View className={`items-center ${group?.userStatus !== "ACTIVE" ? (`opacity-30`) : (``)}`}>
                                    <View className="dark:bg-gray-700/50 bg-gray-800/75 py-3 px-5 rounded-xl">
                                        <FontAwesome name="phone" size={22} color="white" />
                                    </View>
                                    <Text className="dark:text-slate-200 text-slate-600 text-sm mt-1">Audio</Text>
                                </View>
                                <View className={`items-center ${group?.userStatus !== "ACTIVE" ? (`opacity-30`) : (``)}`}>
                                    <View className="dark:bg-gray-700/50 bg-gray-800/75 py-3 px-5 rounded-xl">
                                        <FontAwesome5 name="video" size={20} color="white" />
                                    </View>
                                    <Text className="dark:text-slate-200 text-slate-600 text-sm mt-1">Video</Text>
                                </View>
                                <View className={`items-center ${group?.memberStatus !== "ADMIN" ? (`opacity-30`) : (``)}`}>
                                    <Pressable className={`dark:bg-gray-700/50 bg-gray-800/75 py-3 px-5 rounded-xl`}
                                        disabled={group?.memberStatus !== "ADMIN"}
                                        onPress={() => {
                                            if (group?.memberStatus === "ADMIN") {
                                                navigation.navigate("AddGroupMemberScreen", {
                                                    groupId: groupId
                                                })
                                            }
                                        }}>
                                        <MaterialIcons name={"person-add"} size={22} color="white" />
                                    </Pressable>
                                    <Text className="dark:text-slate-200 text-slate-600 text-sm mt-1">Add</Text>
                                </View>
                            </View>
                        </View>

                        <ScrollView>
                            <View className="mt-5 p-3">
                                <Text className="dark:text-slate-100 text-slate-700 font-bold text-xl">Media</Text>
                                <View className="mt-3">
                                    <FlatList data={media} renderItem={renderMedia} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 5, paddingTop: 5 }} />
                                </View>
                            </View>

                            <View className="mt-3 p-3">
                                <Text className="dark:text-slate-100 text-slate-700 font-bold text-xl">Group Members</Text>
                                <View className="mt-3">
                                    <FlatList data={members} renderItem={renderMember} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 5, paddingTop: 5 }} />
                                </View>
                            </View>

                            <View className="mt-3 p-3">
                                <Text className="dark:text-slate-100 text-slate-700 font-bold text-xl">More Actions</Text>
                                <View className="mt-3 gap-3">
                                    <Pressable className="p-5 dark:bg-red-500/25 bg-red-700/80 rounded-xl flex-row items-center gap-3"
                                        onPress={async () => {
                                            if (group?.userStatus === "ACTIVE") {
                                                leaveGroup(groupId);
                                            } else {
                                                deleteGroup(groupId);
                                                navigation.replace("HomeScreen");
                                            }
                                        }}>
                                        <MaterialIcons name="block" size={24} color="white" />
                                        <Text className="text-slate-100 font-bold text-lg">{
                                            group?.userStatus === "ACTIVE" ? (
                                                "Leave"
                                            ) : group?.userStatus === "LEFT" || group?.userStatus === "REMOVED" ? (
                                                "Delete"
                                            ) : ("")} {group?.groupName}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </ScrollView>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        </ThemeProvider>
    );
}