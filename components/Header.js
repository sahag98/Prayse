import React, { useState } from "react";
import { useFonts } from "expo-font";
import {
  ActivityIndicator,
  Alert,
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

import { FOLDER_SCREEN } from "../routes";
import { HeaderTitle, HeaderView } from "../styles/appStyles";

import DeleteFolder from "./DeleteFolder";
import EditFolder from "./EditFolder";
import { Link } from "expo-router";

const Header = ({ colorScheme, folderName, folderId, theme }) => {
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

  return (
    <>
      <HeaderView>
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center gap-2">
            <Link asChild href={`/${FOLDER_SCREEN}`}>
              <View className="mr-1">
                <Ionicons
                  name="chevron-back"
                  size={30}
                  color={colorScheme === "light" ? "#2f2d51" : "white"}
                />
              </View>
            </Link>
            <HeaderTitle
              style={
                colorScheme === "dark"
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
              color={colorScheme === "dark" ? "#e8bb4e" : "#f1d592"}
            />
          </View>
          <Entypo
            name="dots-three-vertical"
            onPress={() => {
              setIsShowingModal(true);
              doSlideUpAnimation();
            }}
            size={20}
            color={colorScheme === "dark" ? "white" : "#2F2D51"}
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
            className="flex-1 justify-end items-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          >
            <Animated.View
              className="p-2 w-[95%] gap-4 rounded-lg"
              style={
                colorScheme === "dark"
                  ? [
                      animatedSlideUpStyle,
                      {
                        backgroundColor: "rgba(33, 33, 33, 0.7)",
                      },
                    ]
                  : [
                      {
                        backgroundColor: "rgba(183, 211, 255,0.5)",
                      },
                    ]
              }
            >
              <View className="flex-row items-center justify-between mb-1">
                <Text className="font-inter font-bold text-xl dark:text-white text-[#2f2d51]">
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
                  color={colorScheme === "dark" ? "white" : "#2f2d51"}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  setIsShowingModal(false);
                  setOpenEdit(true);
                }}
                className="flex-row items-center rounded-lg justify-between p-3 dark:bg-[#2e2e2e] bg-[#b7d3ff]"
              >
                <Text className="dark:text-white text-[#2f2d51] text-center font-inter font-medium">
                  Rename Folder
                </Text>
                <Feather
                  name="edit"
                  size={22}
                  color={colorScheme === "dark" ? "white" : "#2f2d51"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShare}
                className="flex-row mb-3 items-center rounded-lg justify-between p-3 dark:bg-[#2e2e2e] bg-[#b7d3ff]"
              >
                <Text className="dark:text-white text-[#2f2d51] text-center font-inter font-medium">
                  Share
                </Text>

                <Feather
                  name="share"
                  size={21}
                  color={colorScheme === "dark" ? "white" : "#2f2d51"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setOpenDelete(true);
                  setIsShowingModal(false);
                }}
                className="flex-row items-center justify-between p-4 rounded-lg dark:bg-[#270000] bg-[#ffd8d8] "
              >
                <Text className="text-center font-inter font-bold text-[#ff3b3b]">
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
          colorScheme={colorScheme}
          theme={theme}
          folderId={folderId}
        />
        <DeleteFolder
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          theme={theme}
          colorScheme={colorScheme}
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
