import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import { UserProfileDetailsSocket } from "../socket/UserProfileDetailsSocket";
import { validateFirstName, validateProfileImage } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { updateProfile, uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

export default function UserProfileScreen() {
    const auth = useContext(AuthContext);
    const userId = auth?.userId ? parseInt(auth.userId) : 0; // ---- auth

    const profileDetails = UserProfileDetailsSocket().profileDetails;
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [getFirstName, setFirstName] = useState<string>("");
    const [getLastName, setLastName] = useState<string>("");

    const { applied } = useTheme();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <ThemeProvider>
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} className="flex-1 justify-center items-center">
                <SafeAreaView className="flex-1 items-center w-full bg-sky-600 h-full">
                    <StatusBar hidden={false} className="bg-sky-600" />

                    <View className="justify-center items-center mt-3">
                        <Text className="text-slate-100 text-4xl font-bold">Messenger</Text>
                    </View>

                    <View className="dark:bg-black bg-white w-full flex-1 rounded-t-[28] mt-5 p-4 justify-between">
                        <View className="gap-3 my-3 items-center">
                            <View className="space-y-2 items-center mt-3">
                                <Text className="font-bold text-3xl text-slate-700 dark:text-slate-200" numberOfLines={1}
                                    ellipsizeMode="tail">{profileDetails?.contact.firstName + " " + profileDetails?.contact.lastName}</Text>
                                <Text className={`text-lg text-gray-500`}>
                                    {profileDetails?.contact.countryCode + " " + profileDetails?.contact.contactNo}
                                </Text>
                            </View>
                            <View className="dark:border-gray-700 border-gray-400 border-2 p-1 rounded-full">
                                <Image source={profileImage ? (
                                    { uri: profileImage }
                                ) : profileDetails?.profileImage ? (
                                    { uri: profileDetails.profileImage }
                                ) : (
                                    require("../../assets/default-profile.png")
                                )} className="w-48 h-48 rounded-full" />
                            </View>
                            <Pressable>
                                <Pressable className="bg-gray-700/75 rounded-full p-3 mt-[-70] ml-36" onPress={() => {
                                    pickImage();
                                }}>
                                    <MaterialIcons name="mode-edit-outline" size={24} color="white" />
                                </Pressable>
                            </Pressable>
                        </View>

                        <View>
                            <View>
                                <View className="flex mt-2 p-2">
                                    <Text className="text-lg font-normal text-slate-700 dark:text-slate-300">First Name</Text>
                                    <View className="flex flex-row w-full">
                                        <Text className="dark:bg-gray-700/50 bg-gray-300/75 rounded-l-2xl mt-3 p-2 w-1/6 text-center">
                                            {applied === "light" ? (
                                                <Feather name="user" size={24} color="black" />
                                            ) : (
                                                <Feather name="user" size={24} color="white" />
                                            )}
                                        </Text>
                                        <TextInput inputMode="text" value={getFirstName} onChangeText={(text) => { setFirstName(text) }}
                                            className="dark:bg-gray-700/50 bg-gray-300/75 rounded-r-2xl w-5/6 mt-3 p-3 dark:text-slate-200 text-slate-800"
                                            placeholder="First Name" placeholderTextColor={applied === "dark" ? `#334155` : `#334155`} />
                                    </View>
                                </View>

                                <View className="flex w-full mt-5 p-2">
                                    <Text className="text-lg font-normal text-slate-700 dark:text-slate-300">Last Name</Text>
                                    <View className="flex flex-row w-full">
                                        <Text className="rounded-l-2xl mt-3 p-2 w-1/6 text-center dark:bg-gray-700/50 bg-gray-300/75">
                                            {applied === "light" ? (
                                                <Feather name="user" size={24} color="black" />
                                            ) : (
                                                <Feather name="user" size={24} color="white" />
                                            )}
                                        </Text>
                                        <TextInput inputMode="text" value={getLastName} onChangeText={(text) => { setLastName(text) }}
                                            className="dark:text-slate-200 text-slate-800 dark:bg-gray-700/50 bg-gray-300/75 rounded-r-2xl w-5/6 mt-3 p-3"
                                            placeholder="Last Name" placeholderTextColor={applied === "dark" ? `#334155` : `#334155`} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View className="mt-3 gap-3">
                            <Pressable className="p-5 dark:bg-gray-500/25 bg-gray-800/70 rounded-xl flex-row justify-center items-center gap-3"
                                onPress={async () => {

                                    if (getFirstName || getLastName) {

                                        const vFName = validateFirstName(getFirstName);
                                        const vLName = validateFirstName(getLastName);
                                        let vImage = null;
                                        if (profileImage) {
                                            vImage = validateProfileImage(profileImage
                                                ? { uri: profileImage, type: "", fileSize: 0 }
                                                : null);
                                        }

                                        if (vFName) {
                                            Toast.show({
                                                type: ALERT_TYPE.WARNING,
                                                title: "Warning",
                                                textBody: vFName,
                                            });
                                        } else if (vLName) {
                                            Toast.show({
                                                type: ALERT_TYPE.WARNING,
                                                title: "Warning",
                                                textBody: vLName,
                                            });
                                        } else if (vImage) {
                                            Toast.show({
                                                type: ALERT_TYPE.WARNING,
                                                title: "Warning",
                                                textBody: vImage,
                                            });
                                        } else {
                                            const response = await updateProfile(getFirstName, getLastName, profileImage, userId);
                                            if (response.status) {
                                                Toast.show({
                                                    type: ALERT_TYPE.SUCCESS,
                                                    title: "Alert",
                                                    textBody: "Profile Updated.",
                                                });
                                            } else {
                                                Toast.show({
                                                    type: ALERT_TYPE.WARNING,
                                                    title: "Warning",
                                                    textBody: response.msg,
                                                });
                                            }
                                        }
                                    } else if (profileImage) {

                                        const vImage = validateProfileImage(profileImage
                                            ? { uri: profileImage, type: "", fileSize: 0 }
                                            : null);

                                        if (vImage) {
                                            Toast.show({
                                                type: ALERT_TYPE.WARNING,
                                                title: "Warning",
                                                textBody: vImage,
                                            });
                                        } else {
                                            const response = await uploadProfileImage(userId.toString(), profileImage); // set User id auth
                                            if (response.status) {
                                                Toast.show({
                                                    type: ALERT_TYPE.SUCCESS,
                                                    title: "Alert",
                                                    textBody: "Profile Image Updated.",
                                                });
                                            } else {
                                                Toast.show({
                                                    type: ALERT_TYPE.WARNING,
                                                    title: "Warning",
                                                    textBody: response.msg,
                                                });
                                            }
                                        }
                                    } else {
                                        Toast.show({
                                            type: ALERT_TYPE.INFO,
                                            title: "Alert",
                                            textBody: "No any profile updates.",
                                        });
                                    }

                                }}>
                                <Text className="text-slate-100 font-bold text-lg">Save Updates</Text>
                            </Pressable>
                        </View>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        </ThemeProvider>
    );
}