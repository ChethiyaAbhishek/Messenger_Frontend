import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { validateGroupName, validateProfileImage } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createNewGroup } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

type NewGroupScreenProps = NativeStackNavigationProp<RootStack, "NewGroupScreen">;

export default function NewGroupScreen() {

    const navigation = useNavigation<NewGroupScreenProps>();
    const auth = useContext(AuthContext);

    const userId = auth?.userId? parseInt(auth.userId) : 0; // ---- auth

    const { applied } = useTheme();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [groupName, setGroupName] = useState<string>("");

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

                    <View className="dark:bg-black bg-white w-full flex-1 rounded-t-[28] mt-5 p-4 justify-between">

                        <View className="p-3">
                            <Text className="font-bold text-2xl text-slate-700 dark:text-slate-200">Create New Group</Text>
                        </View>

                        <View>
                            <View className="gap-3 my-3 items-center">
                                <View className="dark:border-gray-700 border-gray-400 border-2 p-1 my-4 rounded-full">
                                    <Image source={profileImage ? (
                                        { uri: profileImage }
                                    ) : (
                                        require("../../assets/default-profile.png")
                                    )} className="w-56 h-56 rounded-full" />
                                </View>
                                <Pressable>
                                    <Pressable className="bg-gray-700/75 rounded-full p-3 mt-[-75] ml-36" onPress={() => {
                                        pickImage();
                                    }}>
                                        <MaterialIcons name="mode-edit-outline" size={24} color="white" />
                                    </Pressable>
                                </Pressable>
                            </View>
                            <View className="flex mt-2 p-2">
                                <Text className="text-lg font-normal text-slate-700 dark:text-slate-300">Group Name</Text>
                                <View className="flex flex-row w-full">
                                    <Text className="dark:bg-gray-700/50 bg-gray-400/50 rounded-l-2xl mt-3 p-2 w-1/6 text-center">
                                        {applied === "light" ? (
                                            <MaterialCommunityIcons name="account-group-outline" size={24} color="black" />
                                        ) : (
                                            <MaterialCommunityIcons name="account-group-outline" size={24} color="white" />
                                        )}
                                    </Text>
                                    <TextInput inputMode="text" value={groupName} onChangeText={(text) => { setGroupName(text) }}
                                        className="dark:bg-gray-700/50 bg-gray-400/50 rounded-r-2xl w-5/6 mt-3 p-3 dark:text-slate-200 text-slate-800"
                                        placeholder="Group Name" placeholderTextColor={applied === "dark" ? `#334155` : `#334155`} />
                                </View>
                            </View>
                        </View>

                        <View className="mt-3 p-3">
                            <View className="mt-3 gap-3">
                                <Pressable className="p-5 dark:bg-sky-500/25 bg-sky-700/85 rounded-xl flex-row items-center justify-center gap-2"
                                    onPress={async () => {

                                        const vName = validateGroupName(groupName);
                                        let vImage = null;
                                        if (profileImage) {
                                            vImage = validateProfileImage(profileImage
                                                ? { uri: profileImage, type: "", fileSize: 0 }
                                                : null);
                                        }

                                        if (vName) {
                                            Toast.show({
                                                type: ALERT_TYPE.WARNING,
                                                title: "Warning",
                                                textBody: vName,
                                            });
                                        } else if (vImage) {
                                            Toast.show({
                                                type: ALERT_TYPE.WARNING,
                                                title: "Warning",
                                                textBody: vImage,
                                            });
                                        } else {
                                            const response = await createNewGroup(groupName, profileImage, userId);
                                            if (response.status) {
                                                navigation.navigate("AddGroupMemberScreen", { groupId: response.groupId })
                                            } else {
                                                Toast.show({
                                                    type: ALERT_TYPE.WARNING,
                                                    title: "Warning",
                                                    textBody: response.msg,
                                                });
                                            }
                                        }
                                    }}>
                                    <Text className="text-slate-100 font-bold text-lg">Add Group Members</Text>
                                    <Entypo name="chevron-right" size={24} color={"white"} />
                                </Pressable>
                            </View>
                        </View>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        </ThemeProvider>
    );
}