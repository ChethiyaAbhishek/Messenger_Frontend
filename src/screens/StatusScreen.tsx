import { Animated, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { AntDesign, Feather, Octicons } from "@expo/vector-icons";

// const images = [
//     {
//         id: 1,
//         image: require("../../assets/status_img.jpg")
//     },
//     {
//         id: 2,
//         image: require("../../assets/status_img2.jpg")
//     },
//     {
//         id: 3,
//         image: require("../../assets/status_img3.jpg")
//     }
// ];
const images = [
    require("../../assets/status_img.jpg"), require("../../assets/status_img2.jpg"), require("../../assets/status_img3.jpg")
];

export default function StatusScreen() {

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

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    const { applied } = useTheme();

    return (
        <ThemeProvider>
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} className="flex-1 justify-center items-center">
                <SafeAreaView className="dark:bg-black bg-white">

                    <View className="flex-row p-3 mb-2 gap-3 items-center border-b-2 border-b-gray-200 dark:border-b-slate-700">
                        <Pressable>
                            <AntDesign name="caret-left" size={24} color={`${applied === "light" ? (`#64748b`) : (`#cbd5e1`)}`} />
                        </Pressable>
                        <View className="border-2 border-gray-400 dark:border-gray-500 rounded-full p-1">
                            <Image source={require("../../assets/avatar/avatar_5.png")} className={`h-14 w-14 rounded-full`} />
                        </View>
                        <View className="">
                            <Text className="font-bold text-lg text-gray-600 dark:text-gray-200">Sahan Kumara</Text>
                            <Text className="text-sm text-gray-500 dark:text-gray-300">7.23 AM</Text>
                        </View>
                    </View>

                    <TouchableOpacity className="items-center flex-1 justify-center" onPress={changeImage}>
                        <Image source={images[currentImageId]} className="w-full h-full" resizeMode="contain" />
                    </TouchableOpacity>

                    <View className="items-center my-5">
                        <View className="flex-row gap-3">
                            {images.map((_, index) => (
                                <Octicons name={`${currentImageId == index ? (`dot`) : (`dot-fill`)}`} size={20} color={`${applied === "light" ? ("#64748b") : ("#cbd5e1")}`} key={index} />
                            ))}
                        </View>
                    </View>

                    <View className="px-5">
                        <View className="bg-gray-300 dark:bg-gray-900 h-14 w-full rounded-full p-1 px-3 mb-3 flex-row justify-between">
                            <TextInput placeholder="Search" className="dark:text-slate-300 text-slate-500 font-bold text-base w-5/6"
                                placeholderTextColor={applied === "light" ? ("#64748b") : ("#cbd5e1")} />
                            <TouchableOpacity className="w-12 h-12 dark:bg-sky-800 bg-sky-600 justify-center items-center rounded-full">
                                <Feather name="send" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>

        </ThemeProvider>
    );
}