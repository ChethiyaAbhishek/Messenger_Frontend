import { FlatList, Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatListSocket } from "../socket/ChatListSocket";
import { formatChatTime } from "../util/DateFormatter";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as LocalAuthentication from 'expo-local-authentication';
import { Chat } from "../socket/Chat";
import { AuthContext } from "../components/AuthProvider";

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">

export default function HomeScreen() {

    const { applied } = useTheme();
    const navigation = useNavigation<HomeScreenProps>();

    const [search, setSearch] = useState("");
    const chatList = ChatListSocket();
    const [modalVisible, setModalVisible] = useState(false);
    const auth = useContext(AuthContext);

    // const [permission, requestPermission] = useCameraPermissions();
    // const [photo, setPhoto] = useState<string | null>(null);
    // const cameraRef = useRef<CameraView | null>(null);

    // useEffect(() => {
    //     if (!permission?.granted) {
    //         requestPermission();
    //     }
    // }, []);

    // const takePicture = async () => {
    //     if (cameraRef.current) {
    //         const photo = await cameraRef.current.takePictureAsync();
    //         setPhoto(photo.uri);
    //         console.log('Photo URI:', photo.uri);
    //     }
    // };

    // if (!permission?.granted) {
    //     return (
    //         <Pressable onPress={requestPermission} >
    //             <Text>Grant Camera Permission</Text>
    //         </Pressable>
    //     );
    // }

    async function authenticateUser(): Promise<boolean> {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            return false;
        }

        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (supportedTypes.length === 0) {
            console.log(supportedTypes);
            return false;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Enter passcode",
            fallbackLabel: 'Enter passcode',
        });

        if (result.success) {
            return true;
        } else {
            return false;
        }
    }

    const filteredChats = chatList.filter((chat) => {
        return (
            chat.friendFirstName.toLowerCase().includes(search.toLowerCase()) ||
            chat.friendLastName.toLowerCase().includes(search.toLowerCase()) ||
            chat.contactNumber.includes(search)
        );
    });

    const renderItem = ({ item }: any) => (
        <TouchableOpacity className="flex-row items-center py-2 px-3 my-0.5"
            onPress={async () => {

                let navigate = false;

                if (item.lockedStatus === "LOCKED") {
                    const unlocked = await authenticateUser();
                    navigate = unlocked;
                } else {
                    navigate = true;
                }

                if (navigate) {
                    navigation.navigate("ChatScreen", {
                        contactId: item.friendId,
                        name: item.friendFirstName + " " + item.friendLastName,
                        lastSeen: formatChatTime(item.lastTimeStamp),
                        profileImg: item.profileImage ? item.profileImage : null,
                        savedStatus: item.savedStatus
                    });
                }
            }}>
            <View>
                <Image source={item.savedStatus === "UNSAVED"
                    ? ({ uri: `https://ui-avatars.com/api/?name=${item.friendFirstName}+${item.friendLastName}&background=random` })
                    : item.profileImage ? ({ uri: item.profileImage })
                        : (require("../../assets/default-profile.png"))}
                    className="h-20 w-20 rounded-full" />
                <View className={`h-3 w-3 ${item.friendStatus === "ONLINE" ? (`bg-green-500`) : (`bg-gray-500`)} rounded-full self-end me-2 mt-[-13]`}></View>
            </View>
            <View className="flex-1 ms-3">
                <View className="flex-row justify-between">
                    <Text className="font-semibold flex-1 text-xl text-gray-600 dark:text-gray-300"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.savedStatus === "UNSAVED"
                            ? (item.contactCountryCode + " " + item.contactNumber)
                            : (item.friendFirstName + " " + item.friendLastName)}</Text>
                    <Text className={`font-light ms-1 text-sm ${item.unreadCount > 0 ? (`text-sky-500`) : (`text-gray-500`)}`}>{formatChatTime(item.lastMsgTimeStamp)}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    {item.lockedStatus === "LOCKED" ? (
                        <View className="flex-row bg-gray-800/55 p-1 px-3 rounded-full gap-2 justify-center items-center">
                            <Text className="dark:text-slate-500 text-slate-200 text-sm tracking-wider" numberOfLines={1} ellipsizeMode="tail">
                                LOCKED
                            </Text>
                            <FontAwesome name="lock" size={14} color={applied === "dark" ? (`#64748b`) : (`#e2e8f0`)} />
                        </View>
                    ) : (
                        <Text className="text-gray-500 flex-1 text-base"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >{item.lastMessage}</Text>
                    )}
                    {item.unreadCount > 0 && (
                        <View className="bg-sky-400 rounded-full h-6 w-6 justify-center items-center ms-2">
                            <Text className="text-slate-700 text-xs font-bold">{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity >
    );

    const renderContacts = ({ item }: { item: Chat }) => {
        if (item.friendStatus === "ONLINE") {
            return (
                <View className="flex-col items-center py-2 px-3 my-0.5">
                    <View className={`border-2 dark:border-sky-700 border-sky-400 rounded-full border-solid p-1`}>
                        <Image source={item.savedStatus === "ACTIVE" && item.profileImage ? (
                            { uri: item.profileImage }
                        ) : item.savedStatus === "ACTIVE" ? (
                            require("../../assets/default-profile.png")
                        ) : (
                            { uri: `https://ui-avatars.com/api/?name=${item.friendFirstName}+${item.friendLastName}&background=random` }
                        )} className={`h-16 w-16 rounded-full`} />
                    </View>
                    <Text className="dark:text-slate-100 text-slate-600 mt-2">{item.friendFirstName}</Text>
                </View>
            );
        } else {
            return null;
        }
    };

    const contactHeader = () => (
        <View className="flex-col items-center py-2 px-3 my-0.5">
            <View className={`border-2 dark:border-sky-700 border-sky-400 rounded-full border-solid p-1`}>
                <View className="h-16 w-16 justify-center items-center dark:bg-sky-300/50 bg-sky-600/50 rounded-full">
                    <Text className="dark:text-slate-200 text-slate-800">YOU</Text>
                </View>
            </View>
            <Text className="dark:text-slate-100 text-slate-900 mt-2">You</Text>
        </View>
    );

    return (
        <ThemeProvider>
            <SafeAreaView className="flex-1 bg-white dark:bg-black">
                <View className="p-3 justify-between items-center flex-row">
                    <Text className="text-sky-600 dark:text-sky-500 font-bold text-3xl">Messenger</Text>

                    {/* {!photo ? (
                        <CameraView ref={cameraRef} className="flex-1" facing="back" />
                    ) : (
                        <Image source={{ uri: photo }} className="flex-1" />
                    )} */}

                    <View className="justify-center items-center flex-row gap-5">
                        <Pressable className="justify-center items-center">
                            {applied === "light" ? (
                                <Entypo name="camera" size={24} color="#6b7280" />
                            ) : (
                                <Entypo name="camera" size={24} color="#9ca3af" />
                            )}
                        </Pressable>

                        <Pressable className="justify-center items-center" onPress={() => setModalVisible(true)}>
                            {applied === "light" ? (
                                <Entypo name="menu" size={30} color="#6b7280" />
                            ) : (
                                <Entypo name="menu" size={30} color="#9ca3af" />
                            )}
                        </Pressable>

                        <Modal animationType="fade" visible={modalVisible} transparent={true}
                            onRequestClose={() => setModalVisible(false)}>

                            <Pressable className="flex-1 bg-transparent" onPress={() => {
                                setModalVisible(false);
                            }}>
                                <Pressable className="bg-transparent"
                                    onPress={(e) => {
                                        e.stopPropagation();
                                    }}>

                                    <View className="justify-end items-end p-5">
                                        <View
                                            className="dark:bg-black/75 bg-gray-200/95 rounded-lg w-48 p-2"
                                            style={{
                                                shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
                                            }}
                                        >
                                            <TouchableOpacity className="h-12 my-2 justify-center items-center"
                                                onPress={() => {
                                                    setModalVisible(false);
                                                }}>
                                                <Text className="font-bold text-lg dark:text-slate-100 text-slate-800">Profile</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="h-12 my-2 justify-center items-center"
                                                onPress={() => {
                                                    if (auth) {
                                                        auth.signOut();
                                                    }
                                                }}>
                                                <Text className="font-bold text-lg dark:text-slate-100 text-slate-800">Log Out</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Pressable>
                            </Pressable>
                        </Modal>

                    </View>
                </View>
                <View className="p-3">
                    <View className="bg-gray-100 dark:bg-gray-900 h-14 w-full rounded-full p-1 px-3">
                        <TextInput placeholder="Search" className="dark:text-slate-300 text-slate-500 text-base"
                            placeholderTextColor={applied === "light" ? ("#64748b") : ("#cbd5e1")} value={search} onChangeText={(text) => setSearch(text)} />
                    </View>
                </View>

                <View className="mt-3">
                    <Text className="dark:text-slate-300 px-5">Online Contacts</Text>
                    <FlatList data={filteredChats} renderItem={renderContacts} ListHeaderComponent={contactHeader} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 5, paddingTop: 5 }} />
                </View>

                <View className="mt-4">
                    <FlatList data={filteredChats} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 125 }} />
                </View>

                <Pressable className="absolute bg-sky-600 bottom-8 right-8 h-16 w-16 rounded-full items-center justify-center"
                    onPress={() => navigation.navigate("SearchNewChatScreen")}>
                    <MaterialCommunityIcons name="message-plus" size={24} color="white" className="scale-x-[-1] scale-y-[-1]" />
                </Pressable>

            </SafeAreaView>
        </ThemeProvider>
    );
}