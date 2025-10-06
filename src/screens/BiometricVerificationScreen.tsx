import { AntDesign, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform, Pressable, StatusBar, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { DarkTheme, useFocusEffect, useNavigation } from "@react-navigation/native";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { validateContactNo, validateCountryCode, validateFirstName, validateLastName, validatePassword } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import * as LocalAuthentication from 'expo-local-authentication';

type BiometricVerificationScreenProps = NativeStackNavigationProp<RootStack, "BiometricVerificationScreen">

export default function BiometricVerificationScreen() {

    const navigation = useNavigation<BiometricVerificationScreenProps>();

    const { applied } = useTheme();

    useFocusEffect(
        useCallback(() => {
            const checkAuth = async () => {
                // const token = await SecureStore.getItemAsync('userToken');
                // if (token) {
                let response = await authenticateUser(); // triggers the OS biometric prompt
                console.log(response);
                // }
            };
            checkAuth();
        }, [])
    );

    async function authenticateUser(): Promise<string> {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            return 'No biometric hardware found';
            // return false;
        }

        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (supportedTypes.length === 0) {
            console.log(supportedTypes);
            return 'No biometrics enrolled';
            // return false;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Enter passcode",
            fallbackLabel: 'Enter passcode',
        });

        if (result.success) {
            // const token = await SecureStore.getItemAsync('userToken');
            // if (token) {
            //     console.log('Authenticated ✅, Token:', token);
            //     return true;
            // } else {
            //     Alert.alert('No token found, please log in again.');
            //     return false;
            // }
            console.log(result);
            // console.log("done");
            return "done";
        } else {
            return 'Authentication failed';
            // return false;
        }
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

                    <View className="dark:bg-black bg-white w-full flex-1 rounded-t-[28] mt-5 p-4 items-center">
                        <Text className="text-3xl text-slate-800 dark:text-slate-300 font-bold mt-14">Biometric Authentication</Text>
                        <Text className="text-sm text-slate-800 dark:text-slate-300 mt-4 tracking-wider">Verify your identity with biometrics.</Text>

                        <View className="justify-center items-center flex-1">
                            <View className="w-72 h-72 border-2 dark:border-slate-100 border-slate-700 rounded-full justify-center items-center">
                                <View className="w-48 h-48 border-2 dark:border-slate-100 border-slate-700 rounded-full justify-center items-center">
                                    <Pressable onPress={async () => { await authenticateUser() }}>
                                        <Ionicons name="finger-print-outline" size={60} color={`${applied === "light" ? `black` : `white`}`} />
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        <View className="p-5 justify-center items-center text-center">
                            <Text className="text-sm text-slate-800 dark:text-slate-300">Place your finger on the device in order to scan it.</Text>
                        </View>

                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>
        </ThemeProvider>
    );
}