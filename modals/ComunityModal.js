import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Switch } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

import { AntDesign } from "@expo/vector-icons";

import config from "../config";
import { HeaderTitle, ModalContainer } from "../styles/appStyles";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
} from "@lib/customStyles";

const CommunityModal = ({
  actualTheme,
  colorScheme,
  modalVisible,
  getPrayers,
  getUserPrayers,
  supabase,
  setModalVisible,
  user,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const [prayer, setPrayer] = useState("");
  const [inputHeight, setInputHeight] = useState(60);
  const insets = useSafeAreaInsets();

  const handleCloseModal = () => {
    setModalVisible(false);
    setPrayer("");
  };
  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const addPrayer = async () => {
    function truncateWords(str, numWords) {
      const words = str.split(" ");
      if (words.length > numWords) {
        return words.slice(0, numWords).join(" ") + " ...";
      } else {
        return str;
      }
    }

    const truncatedString = truncateWords(prayer, 5);

    if (prayer.length <= 0) {
      showToast("error", "The prayer field can't be left empty.");
      setModalVisible(false);
    } else {
      //prayers for production
      //prayers_test for testing
      const { error } = await supabase.from("prayers").insert({
        prayer,
        user_id: user?.id,
      });

      if (error) {
        showToast("error", "Something went wrong");
        return;
      }
      showToast("success", "Prayer posted successfully.🙏🏼");
      const message = {
        title: "Community 🌐",
        message: `${user?.full_name} has posted a prayer: ${truncatedString} .Click here to pray for their request.`,
        data: { screen: "PublicCommunity", public: true, verseTitle: "" },
      };

      fetch(config.publicMessage, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      if (error) {
        showToast("error", "Something went wrong. Try again.");
      }
      getPrayers();
      getUserPrayers();
      setModalVisible(false);
      setPrayer("");
    }
  };

  return (
    // <SafeAreaProvider>
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <ModalContainer
        className="bg-light-background dark:bg-dark-background"
        style={[
          getMainBackgroundColorStyle(actualTheme),
          colorScheme === "dark"
            ? {
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingTop: Platform.OS === "ios" ? insets.top : 0,
                paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
              }
            : {
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingTop: Platform.OS === "ios" ? insets.top : 0,
                paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
              },
        ]}
      >
        <View className="flex-row justify-between w-full">
          <TouchableOpacity
            className="flex-row gap-3 items-center"
            onPress={handleCloseModal}
          >
            <AntDesign
              name="left"
              size={30}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
            <HeaderTitle
              style={getMainTextColorStyle(actualTheme)}
              className="text-light-primary dark:text-dark-primary font-inter font-bold"
            >
              Add Prayer
            </HeaderTitle>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-3 justify-center items-center rounded-lg"
            disabled={prayer.length == 0}
            onPress={addPrayer}
            style={
              colorScheme === "dark"
                ? {
                    backgroundColor:
                      prayer.length === 0
                        ? "#212121"
                        : actualTheme && actualTheme.Primary
                          ? actualTheme.Primary
                          : "#A5C9FF",
                  }
                : {
                    backgroundColor:
                      prayer.length === 0
                        ? "lightgrey"
                        : actualTheme && actualTheme.Primary
                          ? actualTheme.Primary
                          : "#2f2d51",
                  }
            }
          >
            <Text
              className="font-inter font-bold"
              style={
                theme === "dark"
                  ? {
                      color:
                        prayer.length === 0
                          ? "grey"
                          : actualTheme && actualTheme.PrimaryTxt
                            ? actualTheme.PrimaryTxt
                            : "#121212",
                    }
                  : {
                      color:
                        prayer.length === 0
                          ? "white"
                          : actualTheme && actualTheme.PrimaryTxt
                            ? actualTheme.PrimaryTxt
                            : "white",
                    }
              }
            >
              Post Prayer
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full gap-2 mt-3">
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-semibold text-xl text-light-primary dark:text-dark-primary"
          >
            Prayer
          </Text>
          <TextInput
            style={[
              getMainTextColorStyle(actualTheme),
              actualTheme &&
                actualTheme.MainTxt && { borderColor: actualTheme.MainTxt },
            ]}
            className="border p-4 border-light-primary dark:border-dark-secondary rounded-md"
            autoFocus={modalVisible}
            placeholder="How can we pray for you?"
            placeholderTextColor={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "#d6d6d6"
                  : "#2f2d51"
            }
            selectionColor={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
            value={prayer}
            onChangeText={(text) => setPrayer(text)}
            onContentSizeChange={handleContentSizeChange}
            onSubmitEditing={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            multiline
          />
          <TouchableOpacity
            className="self-end mb-3"
            onPress={() => Keyboard.dismiss()}
          >
            <Text className="font-inter text-sm text-red-500">
              Dismiss Keyboard
            </Text>
          </TouchableOpacity>
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default CommunityModal;
