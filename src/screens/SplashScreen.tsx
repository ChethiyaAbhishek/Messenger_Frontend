import { Text, View } from "react-native";
import { useTheme } from "../themes/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackNavigationProp<RootStack, "SplashScreen">

export default function SplashScreen() {

    const navigation = useNavigation<Props>();

    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 3500 });

        const timer = setTimeout(() => {
            navigation.replace("SetUpScreen");
        }, 3500);
        return () => {
            clearInterval(timer);
        }

    }, [navigation, opacity]);

    const animatedStyle = useAnimatedStyle(() => {
        return { opacity: opacity.value };
    });

    const { applied } = useTheme();
    return (
        <View className="flex-1 bg-sky-600">
            <Animated.View style={animatedStyle} className="flex-1">
                <View className="flex-1 justify-center items-center">
                    <Text className="font-bold text-4xl color-slate-200">Messenger.</Text>
                    <View className="flex-1 justify-center items-center absolute bottom-5">
                        <Text className="color-slate-300">POWERED BY {process.env.EXPO_PUBLIC_APP_OWNER} </Text>
                        <Text className="color-slate-300">VERSION {process.env.EXPO_PUBLIC_APP_VERSION} </Text>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}