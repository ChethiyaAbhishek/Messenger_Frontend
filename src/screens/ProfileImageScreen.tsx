import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, Image, Pressable, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { uploadProfileImage } from "../api/UserService";

type ProfileImageScreenProp = NativeStackNavigationProp<RootStack, "ProfileImageScreen">;

export default function ProfileImageScreen() {

    const navigation = useNavigation<ProfileImageScreenProp>();

    const { applied } = useTheme();
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const avatars = [
        require("../../assets/avatar/avatar_1.png"),
        require("../../assets/avatar/avatar_2.png"),
        require("../../assets/avatar/avatar_3.png"),
        require("../../assets/avatar/avatar_4.png"),
        require("../../assets/avatar/avatar_5.png"),
        require("../../assets/avatar/avatar_6.png"),
    ];


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
            <SafeAreaView className="flex-1 items-center w-full bg-sky-600 h-full">
                <StatusBar hidden={false} className="bg-sky-600" />

                <View className="justify-center items-center mt-3">
                    <Text className="text-slate-100 text-4xl font-bold">Messenger</Text>
                </View>

                <View className="dark:bg-black bg-white w-full flex-1 rounded-t-[28] mt-5 p-4 items-center">
                    <Text className="text-3xl text-slate-800 dark:text-slate-300 font-bold mt-14">User Profile</Text>
                    <Text className="text-sm text-slate-800 dark:text-slate-300 mt-4 tracking-wider">Upload a photo so your friends know it’s you.</Text>

                    <View className="justify-between mt-10 flex-1">
                        <View className="justify-center items-center">
                            <View>
                                <View className="h-[58] w-[58] rounded-full border-2 border-gray-200">
                                    {profileImage ? (
                                        <Image source={{ uri: profileImage }} className="h-56 w-56 rounded-full" />
                                    ) : (
                                        <Image source={require("../../assets/default-profile.png")} className="h-56 w-56 rounded-full" />
                                    )}
                                </View>
                                <Pressable className="flex items-end mt-[-35] me-8" onPress={pickImage}>
                                    <View className="w-10 h-10 bg-sky-600 items-center justify-center rounded-full p-2">
                                        <MaterialIcons name="mode-edit" size={20} color="white" />
                                    </View>
                                </Pressable>
                            </View>
                        </View>

                        <FlatList
                            data={avatars}
                            horizontal
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setProfileImage(Image.resolveAssetSource(item).uri);
                                    }}
                                >
                                    <Image source={item} className="h-20 w-20 rounded-full mx-2 border-2 border-gray-200" />
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={{ paddingHorizontal: 10, marginTop: 30 }}
                            showsHorizontalScrollIndicator={false}
                        />

                        <View className=" justify-center items-center px-3 py-3 gap-5">
                            <Pressable className="bg-sky-600 border-2 border-sky-500 rounded-full w-5/6 h-12 flex justify-center items-center flex-row"
                                onPress={async () => {
                                    if (profileImage) {
                                        const response = await uploadProfileImage("2", profileImage); // set User id
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
                                        Toast.show({
                                            type: ALERT_TYPE.WARNING,
                                            title: "Warning",
                                            textBody: "Select a profile image to save.",
                                        });
                                    }
                                }}>
                                <Text className="text-slate-100 font-bold text-xl">Save Profile</Text>
                            </Pressable>
                            <Pressable className="border-2 border-sky-600 rounded-full w-5/6 h-12 flex justify-center items-center flex-row"
                                onPress={() => { navigation.replace("HomeScreen") }}>
                                <Text className="text-slate-200 font-bold text-xl">Skip Now</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ThemeProvider>
    );
}