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
import { blockUser, setChatLock, updateContactStatus } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

type ContactProfileScreenProps = NativeStackScreenProps<RootStack, "ContactProfileScreen">;

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

export default function ContactProfileScreen({ route, navigation }: ContactProfileScreenProps) {

    const { contactId } = route.params;
    const contactDetails = ContactProfileDetailsSocket(contactId).contactProfileDetails;
    const { applied } = useTheme();
    const auth = useContext(AuthContext);

    const userId = auth?.userId ?? "0";

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
                                    ellipsizeMode="tail">{contactDetails?.contact.firstName + " " + contactDetails?.contact.lastName}</Text>
                                <Text className={`text-lg text-gray-500`}>
                                    {contactDetails?.contact.countryCode + " " + contactDetails?.contact.contactNo}
                                </Text>
                            </View>
                            <View className="dark:border-gray-700 border-gray-400 border-2 p-1 rounded-full">
                                <Image source={contactDetails?.profileImage ? ({ uri: contactDetails?.profileImage })
                                    : (require("../../assets/default-profile.png"))} className="w-48 h-48 rounded-full" />
                            </View>
                        </View>

                        <View className="w-full items-center">
                            <View className="flex-row w-5/6 p-2 justify-between">

                                <View className={`items-center ${contactDetails?.contactStatus === "BLOCKED" ? (`opacity-30`) : (``)}`}>
                                    <Pressable className="dark:bg-gray-700/50 bg-gray-800/75 py-3 px-5 rounded-xl"
                                        disabled={contactDetails?.contactStatus === "BLOCKED"}
                                        onPress={async () => {
                                            const response = await setChatLock(userId, contactId.toString()); /// auth user id

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
                                        {contactDetails?.contactLockStatus === "LOCKED" ? (
                                            <MaterialCommunityIcons name="lock-minus" size={23} color="white" />
                                        ) : (
                                            <FontAwesome name="lock" size={24} color="white" />
                                        )}
                                    </Pressable>
                                    <Text className="dark:text-slate-200 text-slate-600 text-sm mt-1">
                                        {contactDetails?.contactLockStatus === "LOCKED" ? (
                                            "Reset"
                                        ) : (
                                            "Lock"
                                        )}
                                    </Text>
                                </View>
                                <View className="items-center">
                                    <View className="dark:bg-gray-700/50 bg-gray-800/75 py-3 px-5 rounded-xl">
                                        <FontAwesome name="phone" size={22} color="white" />
                                    </View>
                                    <Text className="dark:text-slate-200 text-slate-600 text-sm mt-1">Audio</Text>
                                </View>
                                <View className="items-center">
                                    <View className="dark:bg-gray-700/50 bg-gray-800/75 py-3 px-5 rounded-xl">
                                        <FontAwesome5 name="video" size={20} color="white" />
                                    </View>
                                    <Text className="dark:text-slate-200 text-slate-600 text-sm mt-1">Video</Text>
                                </View>
                                <View className="items-center">
                                    <View className="dark:bg-gray-700/50 bg-gray-800/75 py-3 px-5 rounded-xl">
                                        <FontAwesome name="share" size={20} color="white" />
                                    </View>
                                    <Text className="dark:text-slate-200 text-slate-600 text-sm mt-1">Share</Text>
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

                            <View className="mt-5 p-3">
                                <Text className="dark:text-slate-100 text-slate-700 font-bold text-xl">More Actions</Text>
                                <View className="mt-3 gap-3">
                                    {contactDetails?.contactStatus === "BLOCKED" ? (null) : (
                                        <Pressable className="p-5 dark:bg-gray-500/25 bg-gray-700/70 rounded-xl flex-row items-center gap-3"
                                            onPress={async () => {
                                                const response = await updateContactStatus(userId, contactId.toString()); /// auth user id

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

                                            <MaterialIcons name={
                                                contactDetails?.contactStatus === "ACTIVE" ? ("person-off")
                                                    : ("person-add")} size={24} color="white" />

                                            <Text className="text-slate-100 font-bold text-lg">{
                                                contactDetails?.contactStatus === "ACTIVE" ? ("Remove Contact")
                                                    : contactDetails?.contactStatus === "UNSAVED" ? ("Save Contact") : ("Save Contact")}
                                            </Text>

                                        </Pressable>
                                    )}
                                    {contactDetails?.contactStatus ? (
                                        <Pressable className="p-5 dark:bg-red-500/25 bg-red-700/80 rounded-xl flex-row items-center gap-3"
                                            onPress={async () => {
                                                const response = await blockUser(userId, contactId.toString()); /// auth user id

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
                                            {contactDetails?.contactStatus === "BLOCKED" ? (
                                                <Octicons name="person-add" size={24} color="white" />
                                            ) : (
                                                <MaterialIcons name="block" size={24} color="white" />
                                            )}
                                            <Text className="text-slate-100 font-bold text-lg">
                                                {contactDetails?.contactStatus === "BLOCKED" ? ("Unblock ") : ("Block ")}
                                                {contactDetails?.contact.firstName + " " + contactDetails?.contact.lastName}
                                            </Text>
                                        </Pressable>
                                    ) : (null)}
                                </View>
                            </View>
                        </ScrollView>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        </ThemeProvider>
    );
}