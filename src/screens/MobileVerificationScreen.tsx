import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
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
import CountrySelect, { ICountry } from "react-native-country-select";
import { useUserRegistration } from "../components/UserContext";
import { checkContactNumber } from "../api/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../components/AuthProvider";

type MobileVerificationScreenProps = NativeStackNavigationProp<RootStack, "MobileVerificationScreen">

export default function MobileVerificationScreen() {

    const navigation = useNavigation<MobileVerificationScreenProps>();
    const auth = useContext(AuthContext);

    const [callingCode, setCallingCode] = useState("");
    const [contactNo, setContactNo] = useState("");

    const { applied } = useTheme();

    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

    const { setUserData } = useUserRegistration();

    return (
        <ThemeProvider>
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} className="flex-1 justify-center items-center">
                <SafeAreaView className="flex-1 items-center w-full bg-sky-600 h-full">
                    <StatusBar hidden={false} className="bg-sky-600" />

                    <View className="justify-center items-center mt-3">
                        <Text className="text-slate-100 text-4xl font-bold">Messenger</Text>
                    </View>

                    <View className="dark:bg-black bg-white w-full flex-1 rounded-t-[28] mt-5 p-4 items-center">
                        <Text className="text-3xl text-slate-800 dark:text-slate-300 font-bold mt-14">Mobile Verification</Text>
                        <Text className="text-sm text-slate-800 dark:text-slate-300 mt-4 tracking-wider">Enter your mobile to continue or access your account.</Text>

                        <View className="justify-between mt-10 flex-1">
                            <View>
                                <View className="flex w-full mt-2 p-2">
                                    <Text className="text-lg font-normal text-slate-700 dark:text-slate-300">Country</Text>
                                    <Pressable className="">
                                        <View className="border-2 border-gray-800 rounded-2xl mt-3 p-2">
                                            <CountrySelect
                                                visible={showPicker}
                                                onClose={() => setShowPicker(false)}
                                                onSelect={(country) => {
                                                    setSelectedCountry(country);
                                                    setCallingCode(country.idd.root);
                                                }}
                                                theme={`${applied === "dark" ? `dark` : `light`}`}
                                            />
                                            <Pressable onPress={() => setShowPicker(true)} >
                                                <View className="flex-row items-center gap-5">
                                                    <Text className="dark:text-slate-200 text-slate-800 p-1">{selectedCountry ? (`${selectedCountry.flag}`) : ("Select Country")}</Text>
                                                    <Text className="dark:text-slate-200 text-slate-800 p-1">{selectedCountry ? (`${selectedCountry.idd.root}`) : ("")}</Text>
                                                    <Text className="dark:text-slate-200 text-slate-800 p-1">{selectedCountry ? (`${selectedCountry.name.common}`) : ("")}</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                    </Pressable>
                                </View>

                                <View className="flex w-full mt-5 p-2">
                                    <Text className="text-lg font-normal text-slate-700 dark:text-slate-300">Mobile</Text>
                                    <View className="flex flex-row">
                                        <Pressable className="w-1/6">
                                            <View className="border-2 border-r-0 border-gray-800 rounded-l-2xl mt-3 p-2">
                                                <Feather name="phone" size={24} color={`${applied === "light" ? `black` : `white`}`} className="ml-1" />
                                            </View>
                                        </Pressable>
                                        <TextInput inputMode="tel" value={contactNo} onChangeText={(text) => setContactNo(text)}
                                            className="border-2 border-gray-800 dark:text-slate-200 text-slate-800 rounded-r-2xl border-l-0 mt-3 p-2 w-5/6"
                                            placeholder="77 123 6789" placeholderTextColor={applied === "dark" ? `#334155` : `#cbd5e1`} />
                                    </View>
                                </View>
                            </View>

                            <View className="justify-center items-center p-5 mb-5">
                                <Pressable className="bg-sky-600 border-2 border-sky-500 rounded-full w-5/6 h-12 flex justify-center items-center flex-row"
                                    onPress={async () => {
                                        let vCountryCode = validateCountryCode(callingCode);
                                        let vContactNo = validateContactNo(contactNo);

                                        if (vCountryCode) {
                                            Toast.show({
                                                type: ALERT_TYPE.WARNING,
                                                title: "Warning",
                                                textBody: vCountryCode,
                                            });
                                        } else if (vContactNo) {
                                            Toast.show({
                                                type: ALERT_TYPE.WARNING,
                                                title: "Warning",
                                                textBody: vContactNo,
                                            });
                                        } else {
                                            const response = await checkContactNumber(callingCode, contactNo);
                                            if (response.status) {
                                                if (response.msg === "1") {
                                                    // navigation.replace("HomeScreen");
                                                    if (auth) {
                                                        await auth.signUp(String(response.user.id));
                                                    }
                                                } else {
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        countryCode: callingCode,
                                                        contactNo: contactNo
                                                    }));
                                                    navigation.navigate("SetUpScreen");
                                                }
                                            } else {
                                                Toast.show({
                                                    type: ALERT_TYPE.WARNING,
                                                    title: "Warning",
                                                    textBody: response.msg,
                                                });
                                            }
                                        }
                                    }}>
                                    <Text className="text-slate-100 font-bold text-xl">Next</Text>
                                    <Text className="ml-2 mt-0.5">
                                        <AntDesign name="caret-right" size={18} color="white" />
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        </ThemeProvider>
    );
}