import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Switch,
  Modal,
} from "react-native";
import {
  Container,
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Divider, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  darkMode,
  large,
  regular,
  small,
  systemTheme,
} from "../redux/userReducer";
import { deleteAllFolders } from "../redux/folderReducer";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { PROJECT_ID, NOTIFICATION_API } from "@env";
import { clearPrayerData } from "../redux/prayerReducer";
import { useEffect } from "react";
import { deleteAnsweredPrayers } from "../redux/answeredReducer";
import * as Application from "expo-application";

const Settings = ({ navigation }) => {
  const [active, setActive] = useState(false);
  const theme = useSelector((state) => state.user.theme);
  const [isEnabled, setIsEnabled] = useState(false);
  const [updatedTime, setUpdatedTime] = useState("");
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const size = useSelector((state) => state.user.fontSize);
  const dispatch = useDispatch();
  // console.log(Application.applicationName);
  useEffect(() => {
    getlastUpdate();
    getPermission();
  }, []);
  async function sendToken(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { someData: "goes here" },
    };
    console.log("about to fetch");
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

  async function getPermission() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        setIsEnabled(false);
        const { status } = await Notifications.requestPermissionsAsync();
        console.log(status);
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("not granted");
        return;
      }
      console.log("permission granted");
      token = (
        await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })
      ).data;
      setIsEnabled(true);
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }
    sendToken(token);
  }

  let [fontsLoaded] = useFonts({
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
  });

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    if (isEnabled == false) {
      getPermission();
      return;
    }
  };

  const SwitchTheme = (theme) => {
    dispatch(darkMode(theme));
    if (theme == "light") {
      setActive(!active);
    }
    if (theme == "dark") {
      setActive(!active);
    }
  };

  const SystemTheme = () => {
    dispatch(systemTheme());
  };

  function clearAll() {
    dispatch(clearPrayerData());
    dispatch(deleteAllFolders());
    dispatch(deleteAnsweredPrayers());
  }

  const handleCloseModal = () => {
    setOpenClearModal(false);
  };

  const changeFont = (font) => {
    if (font == "large") {
      dispatch(large());
    }
    if (font == "regular") {
      dispatch(regular());
    }
    if (font == "small") {
      dispatch(small());
    }
  };
  const getlastUpdate = async () => {
    const dateObject = new Date(await Application.getLastUpdateTimeAsync());
    setUpdatedTime(dateObject?.toDateString());
  };

  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212", justifyContent: "space-between" }
          : { backgroundColor: "#F2F7FF", justifyContent: "space-between" }
      }
    >
      <View style={{ gap: 10 }}>
        <View>
          <View
            style={{
              marginVertical: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 5 }}
              onPress={() => navigation.navigate("More")}
            >
              <Ionicons
                name="chevron-back"
                size={30}
                color={theme == "light" ? "#2f2d51" : "white"}
              />
            </TouchableOpacity>
            <HeaderTitle
              style={
                theme == "dark"
                  ? { fontFamily: "Inter-Bold", color: "white" }
                  : { fontFamily: "Inter-Bold", color: "#2F2D51" }
              }
            >
              Settings
            </HeaderTitle>
          </View>
        </View>
        <View>
          <Text
            style={theme == "light" ? styles.appearance : styles.appearanceDark}
          >
            APPEARANCE
          </Text>
          <Divider />
          <View
            style={
              Platform.isPad
                ? {
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }
                : {
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }
            }
          >
            <View>
              <TouchableOpacity
                onPress={() => SwitchTheme("light")}
                style={
                  theme == "light" ? styles.activeLight : styles.inactiveLight
                }
              >
                <View style={styles.lightButton}>
                  <Text style={{ color: "black", paddingLeft: 5 }}>Aa</Text>
                </View>
              </TouchableOpacity>
              <Text
                style={
                  theme == "dark"
                    ? { color: "white", marginTop: 5 }
                    : { color: "#2f2d51", marginTop: 5 }
                }
              >
                Light
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => SwitchTheme("dark")}
                style={
                  theme == "dark" ? styles.activeDark : styles.inactiveDark
                }
              >
                <View style={styles.darkButton}>
                  <Text
                    style={{ color: "black", paddingLeft: 5, color: "white" }}
                  >
                    Aa
                  </Text>
                </View>
              </TouchableOpacity>
              <Text
                style={
                  theme == "dark"
                    ? { color: "white", marginTop: 5 }
                    : { color: "#2f2d51", marginTop: 5 }
                }
              >
                Dark
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={systemTheme} style={styles.system}>
                <View style={styles.systemDark}>
                  <Text
                    style={{ color: "black", paddingLeft: 5, color: "white" }}
                  >
                    Aa
                  </Text>
                </View>
                <View style={styles.systemLight}>
                  <Text style={{ color: "black", paddingLeft: 5 }}>Aa</Text>
                </View>
              </TouchableOpacity>
              <Text
                style={
                  theme == "dark"
                    ? { color: "white", marginTop: 5 }
                    : { color: "#2f2d51", marginTop: 5 }
                }
              >
                System
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text
            style={theme == "light" ? styles.appearance : styles.appearanceDark}
          >
            PRAYER FONT SIZE
          </Text>
          <Divider style={{ marginBottom: 10 }} />
          <View style={styles.fontSizeWrapper}>
            <View
              style={{
                display: "flex",
                marginBottom: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => changeFont("large")}
                style={size == 20 ? styles.FontActive : styles.FontInActive}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    color: "black",
                    paddingLeft: 5,
                  }}
                >
                  Large Font
                </Text>
              </TouchableOpacity>
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Regular",
                        color: "white",
                        paddingLeft: 10,
                        fontSize: 20,
                      }
                    : {
                        fontFamily: "Inter-Regular",
                        color: "#2f2d51",
                        paddingLeft: 10,
                        fontSize: 20,
                      }
                }
              >
                Text example
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                marginBottom: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => changeFont("regular")}
                style={size == 16 ? styles.FontActive : styles.FontInActive}
              >
                <Text style={{ color: "black", paddingLeft: 5 }}>
                  Regular Font
                </Text>
              </TouchableOpacity>
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Regular",
                        color: "white",
                        paddingLeft: 10,
                        fontSize: 16,
                      }
                    : {
                        fontFamily: "Inter-Regular",
                        paddingLeft: 10,
                        fontSize: 15,
                        color: "#2f2d51",
                      }
                }
              >
                Text example
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                marginBottom: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => changeFont("small")}
                style={size == 12 ? styles.FontActive : styles.FontInActive}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    color: "black",
                    paddingLeft: 5,
                  }}
                >
                  Small Font
                </Text>
              </TouchableOpacity>
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Regular",
                        color: "white",
                        paddingLeft: 10,
                        fontSize: 12,
                      }
                    : {
                        fontFamily: "Inter-Regular",
                        color: "#2f2d51",
                        paddingLeft: 10,
                        fontSize: 12,
                      }
                }
              >
                Text example
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text
              style={
                theme == "dark"
                  ? { color: "white", fontFamily: "Inter-Medium", fontSize: 16 }
                  : {
                      color: "#2f2d51",
                      fontFamily: "Inter-Medium",
                      fontSize: 16,
                    }
              }
            >
              Get Notifications
            </Text>
            <Switch
              trackColor={{ false: "grey", true: "grey" }}
              thumbColor={isEnabled ? "green" : "white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <TouchableOpacity
            onPress={() => setDeleteAllModal(true)}
            style={theme == "dark" ? styles.clearAllDark : styles.clearAll}
          >
            <Text
              style={{
                color: "#ff6666",
                fontFamily: "Inter-Bold",
                fontSize: 16,
              }}
            >
              Clear All Data
            </Text>
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={deleteAllModal}
            onRequestClose={handleCloseModal}
            statusBarTranslucent={true}
            // onShow={() => inputRef.current?.focus()}
          >
            <ModalContainer
              style={
                theme == "dark"
                  ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                  : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
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
                  <HeaderTitle
                    style={
                      theme == "dark"
                        ? {
                            fontFamily: "Inter-Bold",
                            fontSize: 18,
                            color: "white",
                          }
                        : { fontSize: 18, fontFamily: "Inter-Bold" }
                    }
                  >
                    Are you sure you want delete everything?
                  </HeaderTitle>
                </ModalIcon>
                <ModalActionGroup>
                  <ModalAction
                    color={"white"}
                    onPress={() => setDeleteAllModal(false)}
                  >
                    <AntDesign
                      name="close"
                      size={28}
                      color={theme == "dark" ? "black" : "#2F2D51"}
                    />
                  </ModalAction>
                  <ModalAction
                    color={theme == "dark" ? "#121212" : "#2F2D51"}
                    onPress={() => {
                      clearAll();
                      setDeleteAllModal(false);
                    }}
                  >
                    <AntDesign name="check" size={28} color={"white"} />
                  </ModalAction>
                </ModalActionGroup>
              </ModalView>
            </ModalContainer>
          </Modal>
        </View>
      </View>
      <View
        style={{
          marginBottom: 10,
          gap: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={
            theme == "dark"
              ? { fontFamily: "Inter-Medium", color: "white" }
              : { color: "#2f2d51", fontFamily: "Inter-Medium" }
          }
        >
          {Application.applicationName} v {Application.nativeApplicationVersion}
        </Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  reviewButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 15,
    backgroundColor: "white",
  },
  clearAllDark: {
    width: "100%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212121",
    borderRadius: 5,
  },
  clearAll: {
    width: "100%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#93d8f8",
    borderRadius: 5,
  },
  reviewButtonDark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 15,
    backgroundColor: "#212121",
  },
  donateButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    width: "45%",
    backgroundColor: "white",
  },
  donateButtonDark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    width: "45%",
    backgroundColor: "white",
  },
  wrapper: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  feedback: {
    backgroundColor: "#2f2d51",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    padding: 15,
    width: "100%",
  },
  feedbackDark: {
    backgroundColor: "#2e2e2e",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    padding: 15,
    width: "100%",
  },
  settingsTitleDark: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontFamily: "Inter-Medium",
  },
  activeLight: {
    borderWidth: 2,
    borderColor: "#A5C9FF",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#d3d3d3",
    height: 80,
    width: 100,
    borderRadius: 5,
    padding: 35,
  },
  inactiveLight: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#d3d3d3",
    height: 80,
    width: 100,
    borderRadius: 5,
    padding: 35,
  },
  lightButton: {
    position: "absolute",
    bottom: 0,
    right: -1,
    borderTopLeftRadius: 5,
    backgroundColor: "white",
    height: 60,
    width: 75,
  },
  darkButton: {
    position: "absolute",
    bottom: 0,
    right: -1,
    borderTopLeftRadius: 5,
    backgroundColor: "#212121",
    height: 60,
    width: 75,
  },
  system: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "black",
    width: 100,
    height: 80,
    borderRadius: 5,
    padding: 35,
  },
  systemDark: {
    position: "absolute",
    right: -1,
    backgroundColor: "#212121",
    height: 100,
    width: 50,
  },
  systemLight: {
    position: "absolute",
    left: -1,
    backgroundColor: "white",
    height: 100,
    width: 50,
  },
  activeDark: {
    borderWidth: 2,
    borderColor: "#A5C9FF",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#373737",
    height: 80,
    width: 100,
    borderRadius: 5,
    padding: 35,
  },
  inactiveDark: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#373737",
    height: 80,
    width: 100,
    borderRadius: 5,
    padding: 35,
  },
  FontActive: {
    borderWidth: 3,
    borderColor: "#A5C9FF",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d3d3d3",
    height: 80,
    width: 100,
    borderRadius: 5,
  },
  FontInActive: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d3d3d3",
    height: 80,
    width: 100,
    borderRadius: 5,
  },
  settingsTitle: {
    color: "#2f2d51",
    textAlign: "center",
    fontSize: 17,
    fontFamily: "Inter-Medium",
  },
  appearance: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    paddingBottom: 5,
    color: "#2f2d51",
  },
  appearanceDark: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    paddingBottom: 5,
    color: "white",
  },
  fontSizeWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
});

export default Settings;
