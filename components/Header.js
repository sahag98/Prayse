import React, { useState } from "react";
import { useFonts } from "expo-font";
import {
  ActivityIndicator,
  Modal,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

import { PRAYER_SCREEN } from "../routes";
import { HeaderTitle, HeaderView } from "../styles/appStyles";

import DeleteFolder from "./DeleteFolder";
import EditFolder from "./EditFolder";

const Header = ({ navigation, folderName, folderId, theme }) => {
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const prayerList = useSelector((state) => state.prayer.prayer);
  const folderPrayers = prayerList.filter((item) => item.folderId === folderId);

  const onShare = async () => {
    const prayers = [];

    if (folderPrayers.length === 0) {
      alert("No prayers to share.");
      return;
    }

    folderPrayers.map((p) => {
      prayers.push(p.prayer);
    });

    try {
      await Share.share({
        message: "Pray for these prayers: " + "\n" + prayers.toLocaleString(),
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const [fontsLoaded] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  const slideUpValue = useSharedValue(300);

  function doSlideUpAnimation() {
    slideUpValue.value = withTiming(-10, {
      duration: 300,
      easing: Easing.ease,
    });
  }

  function doSlideDownAnimation() {
    slideUpValue.value = withTiming(300, {
      duration: 300,
      easing: Easing.ease,
    });
  }

  const animatedSlideUpStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideUpValue.value }],
  }));

  if (!fontsLoaded) {
    return <BusyIndicator />;
  }

  return (
    <>
      <HeaderView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => {
                navigation.navigate(PRAYER_SCREEN);
              }}
            >
              <Ionicons
                name="chevron-back"
                size={30}
                color={theme === "light" ? "#2f2d51" : "white"}
              />
            </TouchableOpacity>
            <HeaderTitle
              style={
                theme === "dark"
                  ? { fontFamily: "Inter-Bold", color: "white" }
                  : { fontFamily: "Inter-Bold", color: "#2F2D51" }
              }
            >
              {folderName}
            </HeaderTitle>
            <AntDesign
              name="folderopen"
              size={28}
              style={{ marginLeft: 10 }}
              color={theme === "dark" ? "#e8bb4e" : "#f1d592"}
            />
          </View>
          <Entypo
            name="dots-three-vertical"
            onPress={() => {
              setIsShowingModal(true);
              doSlideUpAnimation();
            }}
            size={20}
            color={theme === "dark" ? "white" : "#2F2D51"}
          />
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={isShowingModal}
          onRequestClose={() => setIsShowingModal(false)}
          statusBarTranslucent
        >
          <View
            style={
              theme === "dark"
                ? {
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                  }
                : {
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                  }
            }
          >
            <Animated.View
              style={
                theme === "dark"
                  ? [
                      animatedSlideUpStyle,
                      {
                        backgroundColor: "rgba(33, 33, 33, 0.7)",
                        width: "95%",
                        borderRadius: 10,
                        padding: 10,
                        gap: 10,
                      },
                    ]
                  : [
                      {
                        backgroundColor: "rgba(183, 211, 255,0.5)",
                        width: "95%",
                        borderRadius: 10,
                        padding: 10,
                        gap: 10,
                      },
                    ]
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Bold",
                    fontSize: 16,
                    color: theme === "dark" ? "white" : "#2f2d51",
                  }}
                >
                  Folder Settings
                </Text>
                <AntDesign
                  onPress={() => {
                    setIsShowingModal(false);
                    doSlideDownAnimation();
                  }}
                  style={{ alignSelf: "flex-end" }}
                  name="closecircleo"
                  size={24}
                  color={theme === "dark" ? "white" : "#2f2d51"}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  setIsShowingModal(false);
                  setOpenEdit(true);
                  console.log("opening edit");
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme === "dark" ? "#2e2e2e" : "#b7d3ff",
                  borderRadius: 10,
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Inter-Medium",

                    color: theme === "dark" ? "white" : "#2f2d51",
                  }}
                >
                  Rename Folder
                </Text>
                <Feather
                  name="edit"
                  size={22}
                  color={theme === "dark" ? "white" : "#2f2d51"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShare}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme === "dark" ? "#2e2e2e" : "#b7d3ff",
                  borderRadius: 10,
                  justifyContent: "space-between",
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Inter-Medium",

                    color: theme === "dark" ? "white" : "#2f2d51",
                  }}
                >
                  Share
                </Text>

                <Feather
                  name="share"
                  size={21}
                  color={theme === "dark" ? "white" : "#2f2d51"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setOpenDelete(true);
                  setIsShowingModal(false);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme === "dark" ? "#270000" : "#ffd8d8",
                  borderRadius: 10,
                  justifyContent: "space-between",
                  padding: 14,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Inter-Bold",

                    color: theme === "dark" ? "#ff3b3b" : "#ff3b3b",
                  }}
                >
                  Delete
                </Text>
                <EvilIcons name="trash" size={24} color="#ff3b3b" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
        <EditFolder
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          folderName={folderName}
          theme={theme}
          folderId={folderId}
        />
        <DeleteFolder
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          theme={theme}
          folderId={folderId}
        />
      </HeaderView>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  userbutton: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginHorizontal: 5,
    backgroundColor: "#2F2D51",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownText: {
    color: "black",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  dropdownTextDark: {
    color: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  inputText: {
    color: "white",
  },
  userbuttonDark: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginHorizontal: 5,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  corner: {},
  cornerDark: {},

  tooltipLight: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 6,
    backgroundColor: "#FFBF65",
  },
  tooltipDark: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 6,
    backgroundColor: "#FFDAA5",
  },

  input: {
    height: 45,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#2F2D51",
    fontSize: 13,
    alignItems: "center",
  },
  inputDark: {
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#212121",
    fontSize: 13,
    alignItems: "center",
  },
});
