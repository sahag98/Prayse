import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Platform,
  Linking,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import prayer from "../assets/prayer-nobg.png";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useFonts } from "expo-font";
import Unorderedlist from "react-native-unordered-list";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider } from "react-native-paper";
import {
  Container,
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import { Modal } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useIsFocused } from "@react-navigation/native";
import Animated, { FadeIn } from "react-native-reanimated";
import { PROJECT_ID, NOTIFICATION_API } from "@env";
import moment from "moment";
import { addQuickFolder } from "../redux/folderReducer";
import uuid from "react-native-uuid";
import { KeyboardAvoidingView } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Keyboard } from "react-native";
import { addPrayer } from "../redux/prayerReducer";
import * as Updates from "expo-updates";
import { Badge, Menu, PaperProvider } from "react-native-paper";
import { addNoti, deleteAll } from "../redux/notiReducer";
import NotiItem from "../components/NotiItem";
import { FlatList } from "react-native";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const data = notification.request.content.data;

    if (data && data.screen) {
      // navigate to the screen specified in the data object
      navigation.navigate(data.screen);
    }
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

async function sendToken(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };
  await fetch(NOTIFICATION_API, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log(status);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log(
        "To recieve notifications in the future, enable Notifications from the App Settings."
      );
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
}

export default function Welcome({ navigation }) {
  const theme = useSelector((state) => state.user.theme);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.expoToken);
  const [greeting, setGreeting] = useState("");
  const [toolVisible, setToolVisible] = useState(false);
  const [icon, setIcon] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const handlePress = () => setExpanded(!expanded);
  const notis = useSelector((state) => state.noti.notifications);
  const folders = useSelector((state) => state.folder.folders);
  const quickFolderExists = useSelector(
    (state) => state.folder.quickFolderExists
  );

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      console.log(`Error fetching latest update: ${error}`);
    }
  }

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator
          size="large"
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </View>
    );
  };

  async function handleQuickPrayer() {
    console.log(quickFolderExists);
    if (quickFolderExists === undefined || quickFolderExists === false) {
      console.log("its undefined");
      try {
        await dispatch(
          addQuickFolder({
            id: 4044,
            name: "Quick Prayers",
            prayers: [],
          })
        );
      } catch (error) {
        console.log(error);
      }
      console.log("folder created");
      handleSubmit();
    } else if (quickFolderExists === true) {
      console.log("folder already exists, adding prayer to it");
      handleSubmit();
    }
  }

  function handleSubmit() {
    dispatch(
      addPrayer({
        prayer: quickprayervalue,
        folder: "Quick Prayers",
        folderId: 4044,
        category: quickcategoryvalue,
        date: new Date().toLocaleString(),
        id: uuid.v4(),
      })
    );
    setQuickModal(false);
    setQuickprayervalue("");
  }

  function handleCloseTooltip() {
    setToolVisible(false);
  }

  function handleCloseModal() {
    setQuickprayervalue("");
    setQuickModal(false);
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [quickModal, setQuickModal] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const isFocused = useIsFocused();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const [inputHeight, setInputHeight] = useState(60);
  const [quickprayervalue, setQuickprayervalue] = useState("");
  const [quickcategoryvalue, setQuickcategoryvalue] = useState("");
  const [notiVisible, setNotiVisible] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data
    ) {
      const data = lastNotificationResponse.notification.request.content.data;
      const body = lastNotificationResponse.notification.request.content.body;

      if (data && data.updateLink) {
        console.log("in update");
        if (Platform.OS === "ios") {
          Linking.openURL(
            "https://apps.apple.com/us/app/prayerlist-app/id6443480347"
          );
        } else if (Platform.OS === "android") {
          Linking.openURL(
            "https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp"
          );
        }
      }

      if (data && data.screen) {
        console.log("in screen");
        //navigate to the screen specified in the data object
        if (data.screen == "VerseOfTheDay") {
          navigation.navigate(data.screen, {
            verse: body,
            title: data.verseTitle,
          });
        } else {
          navigation.navigate(data.screen);
        }
      }
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();

    getHour();
    function getHour() {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Good morning ");
        setIcon(
          <Feather
            name="sun"
            size={24}
            color={theme == "dark" ? "#d8d800" : "#ffff27"}
          />
        );
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting("Good afternoon ");
        setIcon(
          <Feather
            name="sun"
            size={24}
            color={theme == "dark" ? "#d8d800" : "#c4c400"}
          />
        );
      } else {
        setGreeting("Good Evening ");
        setIcon(
          <Feather
            name="moon"
            size={24}
            color={theme == "dark" ? "#a6a6a6" : "#9a9a9a"}
          />
        );
      }
    }
  }, [isFocused]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => sendToken(token).then(console.log("token sent")))
      .catch((err) => console.log(err));
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        let date = moment(notification.date);

        dispatch(
          addNoti({
            noti_id: uuid.v4(),
            date: date.format("M/D/YYYY h:mm A"),
            notification: notification.request.content.body,
            screen: notification.request.content.data.screen,
          })
        );
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const body = response.notification.request.content.body;
        const res = response.notification.request.content.data;
      });

    onFetchUpdateAsync();
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const data = [
    {
      key: "General",
      value: "General",
    },
    {
      key: "People",
      value: "People",
    },
    {
      key: "Personal",
      value: "Personal",
    },
    {
      key: "Praise",
      value: "Praise",
    },
    {
      key: "Other",
      value: "Other",
    },
  ];

  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <BusyIndicator />;
  }

  return (
    <Container
      onLayout={onLayoutRootView}
      style={
        theme == "dark"
          ? {
              display: "flex",
              justifyContent: "center",
              position: "relative",
              alignItems: "center",
              backgroundColor: "#121212",
            }
          : theme == "BlackWhite"
          ? {
              display: "flex",
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }
          : {
              display: "flex",
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#F2F7FF",
            }
      }
    >
      <View
        style={{
          alignItems: "center",
          marginBottom: 10,
          // borderRadius: 10,
          // paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Animated.View
          entering={FadeIn.duration(2000)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Animated.Text
            style={
              theme == "dark"
                ? styles.greetingDark
                : theme == "BlackWhite"
                ? styles.greetingBlack
                : styles.greeting
            }
          >
            {greeting}
          </Animated.Text>
          {icon}
        </Animated.View>
        <View style={{ position: "relative", padding: 10 }}>
          <TouchableOpacity
            onPress={() => setNotiVisible((prev) => !prev)}
            style={
              theme == "dark"
                ? {
                    backgroundColor: "#A5C9FF",
                    borderRadius: 50,
                    padding: 10,
                  }
                : {
                    backgroundColor: "#2f2d51",
                    borderRadius: 50,
                    padding: 10,
                  }
            }
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme == "dark" ? "#121212" : "white"}
            />
          </TouchableOpacity>
          <Badge
            size={18}
            style={{
              position: "absolute",
              fontFamily: "Inter-Medium",
              fontSize: 12,
              top: 8,
              right: 4,
            }}
          >
            {notis.length}
          </Badge>
        </View>
      </View>
      <View style={{ width: "100%" }}>
        <Text
          style={
            theme == "dark"
              ? styles.welcomeDark
              : theme == "BlackWhite"
              ? styles.welcomeBlack
              : styles.welcome
          }
        >
          Welcome to Prayse
        </Text>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={prayer} />
        </View>
        {notiVisible && (
          <View
            style={
              theme == "dark"
                ? {
                    backgroundColor: "#212121",
                    position: "absolute",
                    borderRadius: 10,
                    overflow: "hidden",
                    top: 0,
                    right: 0,
                  }
                : {
                    backgroundColor: "#93d8f8",
                    position: "absolute",
                    borderRadius: 10,
                    overflow: "hidden",
                    top: 0,
                    right: 0,
                  }
            }
          >
            {notis.length == 0 ? (
              <View style={{ padding: 12 }}>
                <Text
                  style={
                    theme == "dark"
                      ? { color: "white", fontFamily: "Inter-Medium" }
                      : { color: "#2f2d51", fontFamily: "Inter-Medium" }
                  }
                >
                  No new notifications yet!
                </Text>
              </View>
            ) : (
              <FlatList
                data={notis}
                keyExtractor={(item) => item.noti_id}
                onEndReachedThreshold={0}
                initialNumToRender={4}
                windowSize={8}
                // ListHeaderComponent={()=>}
                ListFooterComponent={() => (
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(deleteAll());
                      setNotiVisible(false);
                    }}
                    style={{ padding: 10, alignSelf: "flex-end" }}
                  >
                    <Text
                      style={
                        theme == "dark"
                          ? { fontFamily: "Inter-Bold", color: "#e24774" }
                          : { fontFamily: "Inter-Bold", color: "#ff6262" }
                      }
                    >
                      Clear all
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <Divider
                    style={
                      theme == "dark"
                        ? { backgroundColor: "#525252" }
                        : { backgroundColor: "#2f2d51" }
                    }
                  />
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <NotiItem
                    theme={theme}
                    navigation={navigation}
                    setNotiVisible={setNotiVisible}
                    item={item}
                  />
                )}
              />
            )}
          </View>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={toolVisible}
        onRequestClose={handleCloseTooltip}
        statusBarTranslucent={true}
      >
        <ModalContainer
          style={
            theme == "dark"
              ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
              : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
          }
        >
          <TouchableOpacity
            onPress={handleCloseTooltip}
            style={
              theme == "dark"
                ? {
                    borderRadius: 5,
                    position: "relative",
                    padding: 15,
                    width: "100%",
                    backgroundColor: "#212121",
                  }
                : {
                    borderRadius: 5,
                    position: "relative",
                    padding: 15,
                    width: "100%",
                    backgroundColor: "#93D8F8",
                  }
            }
          >
            <TouchableOpacity
              style={{ position: "absolute", top: 5, right: 5, padding: 10 }}
              onPress={handleCloseTooltip}
            >
              <AntDesign
                name="close"
                size={22}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
            </TouchableOpacity>

            <Text
              style={
                theme == "dark"
                  ? {
                      color: "white",
                      marginBottom: 10,
                      fontFamily: "Inter-Bold",
                      fontSize: 16,
                    }
                  : {
                      color: "#2f2d51",
                      fontFamily: "Inter-Bold",
                      marginBottom: 10,
                      fontSize: 16,
                    }
              }
            >
              What's New in v7.3.1 :
            </Text>
            <Unorderedlist
              color={theme == "dark" ? "white" : "black"}
              bulletUnicode={0x2713}
            >
              <Text
                style={theme == "dark" ? styles.listTextDark : styles.listText}
              >
                Quick prayer functionality!
              </Text>
            </Unorderedlist>
            <Unorderedlist
              color={theme == "dark" ? "white" : "black"}
              bulletUnicode={0x2713}
            >
              <Text
                style={theme == "dark" ? styles.listTextDark : styles.listText}
              >
                Prayer input box size changes based on text.
              </Text>
            </Unorderedlist>
            <Unorderedlist
              color={theme == "dark" ? "white" : "black"}
              bulletUnicode={0x2713}
            >
              <Text
                style={theme == "dark" ? styles.listTextDark : styles.listText}
              >
                Voting on the next update on the more page.
              </Text>
            </Unorderedlist>
            {/* <Text style={theme == 'dark' ? { color: 'white', marginBottom: 10, fontFamily: 'Inter-Bold', fontSize: 16 } : { color: '#2f2d51', marginBottom: 10, fontFamily: 'Inter-Bold', fontSize: 16 }}>Bug fixes :</Text>
                        <Unorderedlist
                            color={theme == 'dark' ? 'white' : 'black'}
                            bulletUnicode={0x2713}
                        >
                            <Text style={theme == 'dark' ? styles.listTextDark : styles.listText}>Fixed community notification spam</Text>
                        </Unorderedlist> */}
          </TouchableOpacity>
        </ModalContainer>
      </Modal>
      <View style={{ width: "100%" }}>
        <Text
          style={
            theme == "dark"
              ? { color: "white", fontFamily: "Inter-Medium", fontSize: 15 }
              : theme == "BlackWhite"
              ? { color: "black", fontFamily: "Inter-Medium", fontSize: 15 }
              : { color: "#2f2d51", fontFamily: "Inter-Medium", fontSize: 15 }
          }
        >
          Quick links
        </Text>
        <Divider
          style={
            theme == "BlackWhite"
              ? { backgroundColor: "black", marginBottom: 10, marginTop: 5 }
              : { marginBottom: 10, marginTop: 5 }
          }
        />
        <TouchableOpacity
          onPress={() => setToolVisible(true)}
          style={
            theme == "dark"
              ? styles.refreshDark
              : theme == "BlackWhite"
              ? styles.refreshBlack
              : styles.refresh
          }
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather
              name="info"
              size={24}
              color={
                theme == "dark"
                  ? "#f1d592"
                  : theme == "BlackWhite"
                  ? "black"
                  : "#bb8b18"
              }
            />
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "#f1d592",
                      marginLeft: 5,
                      fontFamily: "Inter-Regular",
                    }
                  : theme == "BlackWhite"
                  ? {
                      color: "black",
                      marginLeft: 5,
                      fontFamily: "Inter-Regular",
                    }
                  : {
                      color: "#bb8b18",
                      marginLeft: 5,
                      fontFamily: "Inter-Regular",
                    }
              }
            >
              Check What's New!
            </Text>
          </View>
          <AntDesign
            name="right"
            size={18}
            color={
              theme == "dark"
                ? "#f1d592"
                : theme == "BlackWhite"
                ? "black"
                : "#bb8b18"
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Gospel")}
          style={
            theme == "dark"
              ? styles.refreshDark
              : theme == "BlackWhite"
              ? styles.refreshBlack
              : styles.refresh
          }
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="cross"
              size={24}
              color={theme == "BlackWhite" ? "black" : "#8cbaff"}
            />
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "#A5C9FF",
                      marginLeft: 5,
                      fontFamily: "Inter-Regular",
                    }
                  : theme == "BlackWhite"
                  ? {
                      color: "black",
                      marginLeft: 5,
                      fontFamily: "Inter-Regular",
                    }
                  : {
                      color: "#738cb2",
                      marginLeft: 5,
                      fontFamily: "Inter-Regular",
                    }
              }
            >
              The Gospel of Jesus
            </Text>
          </View>
          <AntDesign
            name="right"
            size={18}
            color={
              theme == "dark"
                ? "#8cbaff"
                : theme == "BlackWhite"
                ? "black"
                : "#738cb2"
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://www.buymeacoffee.com/arzsahag")
          }
          style={
            theme == "dark"
              ? styles.refreshDark
              : theme == "BlackWhite"
              ? styles.refreshBlack
              : styles.refresh
          }
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="hearto"
              size={24}
              color={theme == "BlackWhite" ? "black" : "#DE3163"}
            />
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "#e24774",
                      marginLeft: 5,
                      fontFamily: "Inter-Regular",
                    }
                  : theme == "BlackWhite"
                  ? {
                      color: "black",
                      marginLeft: 5,
                      fontFamily: "Inter-Regular",
                    }
                  : {
                      color: "#cb3f68",
                      marginLeft: 5,
                      fontFamily: "Inter-Regular",
                    }
              }
            >
              Donate to support future updates!
            </Text>
          </View>
          <AntDesign
            name="right"
            size={18}
            color={
              theme == "dark"
                ? "#e24774"
                : theme == "BlackWhite"
                ? "black"
                : "#cb3f68"
            }
          />
        </TouchableOpacity>
        {Platform.OS === "android" && (
          <TouchableOpacity
            style={
              theme == "dark"
                ? styles.refreshDark
                : theme == "BlackWhite"
                ? styles.refreshBlack
                : styles.refresh
            }
            onPress={() =>
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp"
              )
            }
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="logo-google-playstore"
                size={24}
                color={
                  theme == "dark"
                    ? "#d6d6d6"
                    : theme == "BlackWhite"
                    ? "black"
                    : "#606060"
                }
              />
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#f0f0f0",
                        fontFamily: "Inter-Regular",
                        marginLeft: 5,
                      }
                    : theme == "BlackWhite"
                    ? {
                        color: "black",
                        fontFamily: "Inter-Regular",
                        marginLeft: 5,
                      }
                    : {
                        color: "#606060",
                        fontFamily: "Inter-Regular",
                        marginLeft: 5,
                      }
                }
              >
                Check for Updates
              </Text>
            </View>
            <AntDesign
              name="right"
              size={18}
              color={
                theme == "dark"
                  ? "#d6d6d6"
                  : theme == "BlackWhite"
                  ? "black"
                  : "#606060"
              }
            />
          </TouchableOpacity>
        )}
        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={theme == "dark" ? styles.refreshDark : styles.refresh}
            onPress={() =>
              Linking.openURL(
                "https://apps.apple.com/us/app/prayerlist-app/id6443480347"
              )
            }
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="apple1"
                size={24}
                color={theme == "dark" ? "#d6d6d6" : "#606060"}
              />
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#f0f0f0",
                        fontFamily: "Inter-Regular",
                        marginLeft: 5,
                      }
                    : {
                        color: "#606060",
                        fontFamily: "Inter-Regular",
                        marginLeft: 5,
                      }
                }
              >
                Check for Updates
              </Text>
            </View>
            <AntDesign
              name="right"
              size={18}
              color={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Folders")}
          style={
            theme == "dark"
              ? styles.buttonDark
              : theme == "BlackWhite"
              ? styles.buttonBlack
              : styles.button
          }
        >
          <Text
            style={
              theme == "dark"
                ? { color: "#212121", fontFamily: "Inter-Bold" }
                : theme == "BlackWhite"
                ? { color: "white", fontFamily: "Inter-Bold" }
                : { color: "white", fontFamily: "Inter-Bold" }
            }
          >
            Create Folder
          </Text>
          <AntDesign
            style={{ marginLeft: 10 }}
            name="right"
            size={20}
            color={theme == "dark" ? "#212121" : "white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setQuickModal(true)}
          style={
            theme == "dark"
              ? [styles.buttonDark, { backgroundColor: "#212121" }]
              : theme == "BlackWhite"
              ? [
                  styles.buttonDark,
                  {
                    backgroundColor: "white",
                    borderColor: "black",
                    borderWidth: 1,
                  },
                ]
              : [styles.button, { backgroundColor: "#93D8F8" }]
          }
        >
          <Text
            style={
              theme == "dark"
                ? { color: "white", fontFamily: "Inter-Bold" }
                : theme == "BlackWhite"
                ? { color: "black", fontFamily: "Inter-Bold" }
                : { color: "#2f2d51", fontFamily: "Inter-Bold" }
            }
          >
            Quick Prayer
          </Text>
          <AntDesign
            style={{ marginLeft: 10 }}
            name="pluscircleo"
            size={24}
            color={
              theme == "dark"
                ? "white"
                : theme == "BlackWhite"
                ? "black"
                : "#2f2d51"
            }
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={quickModal}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ModalContainer
            style={
              theme == "dark"
                ? { backgroundColor: "#121212" }
                : { backgroundColor: "#F2F7FF" }
            }
          >
            <ModalView
              style={
                theme == "dark"
                  ? { backgroundColor: "#212121" }
                  : { backgroundColor: "#93D8F8" }
              }
            >
              <ModalIcon>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 5,
                  }}
                >
                  <HeaderTitle
                    style={
                      theme == "dark"
                        ? { fontFamily: "Inter-Bold", color: "white" }
                        : { fontFamily: "Inter-Bold" }
                    }
                  >
                    Quick Prayer
                  </HeaderTitle>
                  <AntDesign
                    name="edit"
                    size={24}
                    color={theme == "dark" ? "white" : "#2F2D51"}
                  />
                </View>
              </ModalIcon>
              <StyledInput
                style={
                  theme == "dark"
                    ? {
                        height: inputHeight < 60 ? 60 : inputHeight,
                        marginTop: 10,
                        alignItems: "center",
                        alignSelf: "center",
                        textAlignVertical: "center",
                        fontFamily: "Inter-Regular",
                        backgroundColor: "#121212",
                      }
                    : {
                        height: inputHeight < 60 ? 60 : inputHeight,
                        marginTop: 10,
                        textAlignVertical: "center",
                        fontFamily: "Inter-Regular",
                        backgroundColor: "#2F2D51",
                      }
                }
                placeholder="Add a prayer"
                placeholderTextColor={"#e0e0e0"}
                selectionColor={"white"}
                autoFocus={true}
                onChangeText={(text) => setQuickprayervalue(text)}
                value={quickprayervalue}
                onContentSizeChange={handleContentSizeChange}
                onSubmitEditing={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                multiline={true}
              />
              <TouchableOpacity
                style={styles.dismiss}
                onPress={dismissKeyboard}
              >
                <Text
                  style={{
                    color: "#ff4e4e",
                    fontFamily: "Inter-Regular",
                    fontSize: 13,
                  }}
                >
                  Dismiss Keyboard
                </Text>
              </TouchableOpacity>
              <Text style={theme == "dark" ? styles.selectDark : styles.select}>
                Select a Category (optional):
              </Text>
              <SelectList
                placeholder="selectcategory"
                setSelected={setQuickcategoryvalue}
                data={data}
                search={false}
                defaultOption={{ key: "None", value: "None" }}
                boxStyles={
                  theme == "dark" ? styles.categoryDark : styles.category
                }
                dropdownStyles={
                  theme == "dark" ? styles.dropdownDark : styles.dropdown
                }
                dropdownTextStyles={styles.dropdownTextDark}
                inputStyles={styles.inputText}
                arrowicon={<AntDesign name="down" size={15} color="white" />}
                maxHeight="250"
              />
              <ModalActionGroup>
                <ModalAction color={"white"} onPress={handleCloseModal}>
                  <AntDesign
                    name="close"
                    size={28}
                    color={theme == "dark" ? "#121212" : "#2F2D51"}
                  />
                </ModalAction>
                <ModalAction
                  color={theme == "dark" ? "#121212" : "#2F2D51"}
                  onPress={handleQuickPrayer}
                >
                  <AntDesign name="check" size={28} color={"white"} />
                </ModalAction>
              </ModalActionGroup>
            </ModalView>
          </ModalContainer>
        </KeyboardAvoidingView>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  containerDark: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  dismiss: {
    alignSelf: "flex-start",
    // alignSelf:'left',
    marginVertical: 5,
    padding: 2,
    // borderBottomColor: '#ff4e4e',
    // borderBottomWidth: 0.2
  },
  refreshDark: {
    width: "100%",
    backgroundColor: "#212121",
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 15,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  refresh: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 15,
    borderColor: "#dddddd",
    borderWidth: 0.4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refreshBlack: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 0.4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  section: {
    backgroundColor: "#a6c8ff",
  },
  sectionDark: {
    backgroundColor: "#212121",
  },
  wrapper: {
    width: "80%",
  },
  select: {
    fontSize: 13,
    paddingVertical: 5,
    color: "black",
    fontFamily: "Inter-Regular",
  },
  selectDark: {
    fontSize: 13,
    paddingVertical: 5,
    color: "white",
    fontFamily: "Inter-Regular",
  },

  category: {
    backgroundColor: "#2F2D51",
    color: "black",
    marginTop: 10,
    height: 50,
    alignItems: "center",
  },
  categoryDark: {
    backgroundColor: "#121212",
    color: "white",
    marginTop: 10,
    height: 50,
    alignItems: "center",
  },

  dropdown: {
    backgroundColor: "#2F2D51",
    height: 800,
  },
  dropdownDark: {
    backgroundColor: "#121212",
    height: 800,
  },
  dropdownText: {
    color: "black",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  inputText: {
    color: "white",
  },
  dropdownTextDark: {
    color: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  listText: {
    fontFamily: "Inter-Regular",
    color: "#2f2d51",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 10,
  },
  listTextDark: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    lineHeight: 20,
    color: "white",
    marginBottom: 10,
  },
  instructions: {
    marginBottom: 5,
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  instructionsDark: {
    marginBottom: 5,
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "white",
  },
  welcome: {
    fontSize: 20,
    marginVertical: 15,
    fontFamily: "Inter-Bold",
    letterSpacing: 2,
    alignSelf: "center",
    color: "#2F2D51",
  },
  welcomeDark: {
    marginVertical: 15,
    fontSize: 20,
    fontFamily: "Inter-Bold",
    alignSelf: "center",
    letterSpacing: 2,
    color: "white",
  },
  welcomeBlack: {
    marginVertical: 15,
    fontSize: 20,
    fontFamily: "Inter-Bold",
    alignSelf: "center",
    letterSpacing: 2,
    color: "black",
  },
  greeting: {
    fontSize: 19,
    // marginVertical: 5,
    fontFamily: "Inter-Medium",
    letterSpacing: 2,
    alignSelf: "center",
    color: "#2F2D51",
  },
  greetingDark: {
    // marginVertical: 5,
    fontSize: 19,
    fontFamily: "Inter-Medium",
    alignSelf: "flex-start",
    letterSpacing: 2,
    color: "white",
  },
  greetingBlack: {
    marginVertical: 5,
    fontSize: 19,
    fontFamily: "Inter-Medium",
    alignSelf: "flex-start",
    letterSpacing: 2,
    color: "black",
  },
  imgContainer: {
    backgroundColor: "white",
    position: "relative",
    height: 180,
    width: 180,
    borderRadius: 100,
    marginVertical: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 250,
    height: 250,
  },
  button: {
    marginTop: 25,
    width: 160,
    backgroundColor: "#2f2d51",
    padding: 14,
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDark: {
    marginTop: 25,
    width: 160,
    backgroundColor: "#A5C9FF",
    padding: 14,
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBlack: {
    marginTop: 25,
    width: 160,
    backgroundColor: "black",
    padding: 14,
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
