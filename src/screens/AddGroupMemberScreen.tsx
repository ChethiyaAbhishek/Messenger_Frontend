import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useContext, useState } from "react";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { DarkTheme, useFocusEffect, useNavigation } from "@react-navigation/native";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { ContactProfile } from "../socket/Chat";
import { LoadAllUsersSocket } from "../socket/LoadAllUsersSocket";
import { AddGroupMemberSocket } from "../socket/AddGroupMemberSocket";
import { AuthContext } from "../components/AuthProvider";

type AddGroupMemberScreenProps = NativeStackScreenProps<RootStack, "AddGroupMemberScreen">;

export default function AddGroupMemberScreen({ route, navigation }: AddGroupMemberScreenProps) {

    const { groupId } = route.params;
    const allUsers = LoadAllUsersSocket(groupId).allUsers;
    const addUser = AddGroupMemberSocket();
    const [search, setSearch] = useState("");
    const auth = useContext(AuthContext);
    const { applied } = useTheme();

    const userId = auth ? auth.userId : 0;

    const filteredGroups = allUsers?.filter((group) => {
        return (
            group.contact.firstName.toLowerCase().includes(search.toLowerCase()) ||
            group.contact.lastName.toLowerCase().includes(search.toLowerCase()) ||
            group.contact.contactNo.includes(search.toLowerCase())
        );
    });

    const renderUser = ({ item }: { item: ContactProfile }) => {
        return (
            <View className="p-2">
                <View className="dark:bg-gray-700/45 bg-gray-300/80 rounded-xl p-3 flex-row justify-between">
                    <View className="flex-row gap-2 items-center">
                        <Image source={item.profileImage ? (
                            { uri: item.profileImage }
                        ) : item.contactStatus && item.contactStatus === "ACTIVE" ? (
                            require("../../assets/default-profile.png")
                        ) : (
                            { uri: `https://ui-avatars.com/api/?name=${item.contact.firstName}+${item.contact.lastName}&background=random` }
                        )
                        } className="w-14 h-14 rounded-full" />
                        <View>
                            <Text className="dark:text-slate-200 text-slate-800 font-bold">{item.contact.id === userId ? (
                                "You"
                            ) : item.contactStatus && item.contactStatus === "ACTIVE" ? (
                                item.contact.firstName + " " + item.contact.lastName
                            ) : (
                                item.contact.countryCode + " " + item.contact.contactNo
                            )}</Text>
                            <Text className="dark:text-slate-400 text-slate-600">{item.contact.id === userId ? (
                                item.contact.firstName + " " + item.contact.lastName
                            ) : item.contactStatus && item.contactStatus === "ACTIVE" ? (
                                item.contact.countryCode + " " + item.contact.contactNo
                            ) : (
                                item.contact.firstName + " " + item.contact.lastName
                            )}</Text>
                        </View>
                    </View>

                    <View className="p-2">
                        <Pressable className={`dark:bg-gray-700/50 bg-gray-800/75 rounded-lg p-2 px-4 ${item.groupStatus ? (`dark:opacity-30 opacity-60`) : (``)}`}
                            disabled={item.groupStatus ? (true) : (false)}
                            onPress={() => {
                                if (!item.groupStatus) {
                                    addUser(groupId, item.contact.id);
                                }
                            }}
                        >
                            <Text className="text-slate-200">{item.groupStatus ? (
                                "Added"
                            ) : (
                                "Add"
                            )
                            }</Text>
                        </Pressable>
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

                        <View className="p-3">
                            <Text className="dark:text-slate-200 text-slate-900 text-2xl tracking-wider font-bold">+ Add Group Members</Text>
                        </View>

                        <View className="p-1">
                            <View className="bg-gray-100 dark:bg-gray-900 h-12 w-full rounded-full px-3">
                                <TextInput placeholder="Search User" className="dark:text-slate-300 text-slate-500 font-bold text-base"
                                    placeholderTextColor={applied === "light" ? ("#64748b") : ("#cbd5e1")} value={search} onChangeText={(text) => setSearch(text)} />
                            </View>
                        </View>

                        <View className="mt-5">
                            <FlatList data={filteredGroups} className="max-h-[34rem]" renderItem={renderUser} />
                        </View>

                        <View className="mt-2 p-3">
                            <View className="mt-3 gap-3">
                                <Pressable className="p-5 dark:bg-sky-500/25 bg-sky-700/85 rounded-xl flex-row items-center justify-center gap-2"
                                    onPress={() => {
                                        navigation.replace("HomeScreen");
                                    }}>
                                    <Text className="text-slate-100 font-bold text-lg">Done</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        </ThemeProvider>
    );
}