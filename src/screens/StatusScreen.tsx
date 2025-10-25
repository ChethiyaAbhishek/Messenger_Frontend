import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Animated, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { DarkTheme, useFocusEffect, useNavigation } from "@react-navigation/native";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { validateContactNo, validateCountryCode, validateFirstName, validateLastName, validatePassword } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import * as LocalAuthentication from 'expo-local-authentication';
import { ContactProfileDetailsSocket } from "../socket/ContactProfileDetailsSocket";
import { blockUser, setChatLock, updateContactStatus } from "../api/UserService";

// type StatusScreenProps = NativeStackScreenProps<RootStack, "StatusScreen">;

const images = [
    require("../../assets/status_img.jpg"),
    require("../../assets/status_img2.jpg"),
    require("../../assets/status_img3.jpeg")
];

export default function StatusScreen() {

    // const { contactId } = route.params;
    // const contactDetails = ContactProfileDetailsSocket(contactId).contactProfileDetails;

    const { applied } = useTheme();

    const [currentImageId, setNewImageId] = useState<number>(0);

    function changeImage() {
        if (images.length > (currentImageId + 1)) {
            setNewImageId(currentImageId + 1);
        } else {
            console.log("iwrai")
        }
    }

    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        progress.setValue(0);

        const animation = Animated.timing(progress, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: false,
        });

        animation.start(() => {
            changeImage();
        });

        return () => animation.stop();
    }, [currentImageId]);

    return (
        <ThemeProvider>
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} className="flex-1 justify-center items-center">
                <SafeAreaView className="flex-1 items-center w-full bg-sky-600 h-full">
                    <StatusBar hidden={false} className="bg-sky-600" />

                    <View className="flex-row items-center mt-3">
                        <View className="w-2/12">
                            <Pressable onPress={() => {}} className="bg-slate-100/40 w-10 h-10 ml-3 border-2 border-slate-100/50 rounded-full justify-center items-center">
                                <AntDesign name="left" size={18} color="white" />
                            </Pressable>
                        </View>
                        <View className="w-8/12 justify-center items-center">
                            <Text className="text-slate-100 text-4xl font-bold">Messenger</Text>
                        </View>
                        <View className="w-2/12"></View>
                    </View>

                    <View className="dark:bg-black bg-white w-full flex-1 rounded-t-[28] mt-5 p-4 justify-between">

                        <View>
                            <View className="flex-row gap-2 items-center p-3 dark:bg-gray-700/40 bg-gray-400/50 rounded-3xl">
                                <View>
                                    <Image source={(require("../../assets/default-profile.png"))} className="w-14 h-14 rounded-full" />
                                </View>
                                <View>
                                    <Text className="font-bold text-xl text-slate-800 dark:text-slate-200">Kasun Kumara</Text>
                                    <Text className={`text-base dark:text-gray-500 text-gray-600`}>06:29 PM</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity className="flex-1 justify-center items-center rounded-xl mt-3" onPress={changeImage}>
                            <Image source={images[currentImageId]} className=" h-full w-full rounded-xl" resizeMode="contain" />
                        </TouchableOpacity>


                        <View className="mt-3 gap-3">

                            <View className="items-center">
                                <View className="flex-row gap-3">
                                    {images.map((_, index) => (
                                        <Octicons name={`${currentImageId == index ? (`dot`) : (`dot-fill`)}`} size={15} color={`${applied === "light" ? ("#64748b") : ("#cbd5e1")}`} key={index} />
                                    ))}
                                </View>
                            </View>

                            <View className="p-2">
                                <Text className="dark:text-slate-200 text-slate-800">Adulting: 1/10, would not recommend, Adulting: 1/10, would not recommend</Text>
                            </View>

                            <Pressable className="p-1 dark:bg-gray-500/25 bg-gray-300/70 rounded-full flex-row items-center gap-3"
                                onPress={async () => { }}>

                                <TextInput placeholder="Reply" multiline className="dark:text-slate-300 text-slate-500 font-bold text-base w-5/6 px-4"
                                    placeholderTextColor={applied === "light" ? ("#64748b") : ("#64748b")} />
                                <TouchableOpacity className="w-12 h-12 justify-center items-center">
                                    <Ionicons name="send" size={24} color={applied === "light"?"black":"white"} />
                                </TouchableOpacity>

                            </Pressable>
                        </View>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        </ThemeProvider>
    );
}