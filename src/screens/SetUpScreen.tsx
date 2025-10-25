import { AntDesign, Feather } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform, Pressable, StatusBar, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { useContext, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { DarkTheme, useNavigation } from "@react-navigation/native";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { validateContactNo, validateCountryCode, validateFirstName, validateLastName, validatePassword } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useUserRegistration } from "../components/UserContext";
import { createNewAccount } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

type SetUpScreenProps = NativeStackNavigationProp<RootStack, "SetUpScreen">

export default function SetUpScreen() {

    const navigation = useNavigation<SetUpScreenProps>();

    const { applied } = useTheme();

    const [getFirstName, setFirstName] = useState<string>("");
    const [getLastName, setLastName] = useState<string>("");

    const { userData, setUserData } = useUserRegistration();

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

                    <View className="dark:bg-black bg-white w-full flex-1 rounded-t-[28] mt-5 p-4 items-center">
                        <Text className="text-3xl text-slate-800 dark:text-slate-300 font-bold mt-14">User Registration</Text>
                        <Text className="text-sm text-slate-800 dark:text-slate-300 mt-4 tracking-wider">Create your account and join the conversation.</Text>

                        <View className=" mt-10 flex-1 justify-between">
                            <View>
                                <View className="flex mt-2 p-2">
                                    <Text className="text-lg font-normal text-slate-700 dark:text-slate-300">First Name</Text>
                                    <View className="flex flex-row w-full">
                                        <Text className="border-2 border-r-0 border-gray-800 rounded-l-2xl mt-3 p-2 w-1/6 text-center">
                                            {applied === "light" ? (
                                                <Feather name="user" size={24} color="black" />
                                            ) : (
                                                <Feather name="user" size={24} color="white" />
                                            )}
                                        </Text>
                                        <TextInput inputMode="text" value={getFirstName} onChangeText={(text) => { setFirstName(text) }}
                                            className="border-2 border-gray-800 rounded-r-2xl border-l-0 w-5/6 mt-3 p-3 dark:text-slate-200 text-slate-800"
                                            placeholder="First Name" placeholderTextColor={applied === "dark" ? `#334155` : `#cbd5e1`} />
                                    </View>
                                </View>

                                <View className="flex w-full mt-5 p-2">
                                    <Text className="text-lg font-normal text-slate-700 dark:text-slate-300">Last Name</Text>
                                    <View className="flex flex-row w-full">
                                        <Text className="border-2 border-r-0 border-gray-800 rounded-l-2xl mt-3 p-2 w-1/6 text-center">
                                            {applied === "light" ? (
                                                <Feather name="user" size={24} color="black" />
                                            ) : (
                                                <Feather name="user" size={24} color="white" />
                                            )}
                                        </Text>
                                        <TextInput inputMode="text" value={getLastName} onChangeText={(text) => { setLastName(text) }}
                                            className="border-2 border-gray-800 dark:text-slate-200 text-slate-800 rounded-r-2xl border-l-0 w-5/6 mt-3 p-3"
                                            placeholder="Last Name" placeholderTextColor={applied === "dark" ? `#334155` : `#cbd5e1`} />
                                    </View>
                                </View>
                            </View>

                            <View className="justify-center items-center p-5 mb-5">
                                <Pressable className="bg-sky-600 border-2 border-sky-500 rounded-full w-5/6 h-12 flex justify-center items-center flex-row"
                                    onPress={async () => {

                                        let vFirstName = validateFirstName(getFirstName);
                                        let vLastName = validateLastName(getLastName);

                                        if (vFirstName) {
                                            Toast.show({
                                                type: ALERT_TYPE.WARNING,
                                                title: "Warning",
                                                textBody: vFirstName,
                                            });
                                        } else if (vLastName) {
                                            Toast.show({
                                                type: ALERT_TYPE.WARNING,
                                                title: "Warning",
                                                textBody: vLastName,
                                            });
                                        } else {
                                            setUserData((prev) => ({
                                                ...prev,
                                                firstName: getFirstName,
                                                lastName: getLastName
                                            }));

                                            const response = await createNewAccount(userData);

                                            if (response.status) {
                                                navigation.replace("ProfileImageScreen",{userId:response.user.id});
                                            } else {
                                                Toast.show({
                                                    type: ALERT_TYPE.WARNING,
                                                    title: "Warning",
                                                    textBody: response.msg,
                                                });
                                            }
                                        }
                                    }}>
                                    <Text className="text-slate-100 font-bold text-xl">Register</Text>
                                </Pressable>
                            </View>
                        </View>

                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        </ThemeProvider>
    );
}