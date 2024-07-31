import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { AnimatedFAB } from "react-native-paper";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign } from "@expo/vector-icons";

import { addPrayer, editPrayer } from "../redux/prayerReducer";
import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import {
  getMainBackgroundColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const InputModal = ({
  actualTheme,
  colorScheme,
  categoryValue,
  setTaskName,
  categorytoBeEdited,
  isEditing,
  setIsEditing,
  setCategorytoBeEdited,
  taskName,
  isIOS,
  animatedValue,
  extended,
  setCategoryValue,
  modalVisible,
  folderName,
  folderId,
  setModalVisible,
  prayerValue,
  setPrayerValue,
  prayertoBeEdited,
  setPrayertoBeEdited,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const [inputHeight, setInputHeight] = useState(60);
  const [isExtended, setIsExtended] = useState(true);

  useEffect(() => {
    if (!isIOS) {
      animatedValue.addListener(({ value }) => {
        setIsExtended(value <= 0);
      });
    } else setIsExtended(extended);
  }, [animatedValue, extended, isIOS]);

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setPrayerValue("");
    setCategoryValue("");
  };
  const dispatch = useDispatch();
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

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

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  const handleSubmit = () => {
    if (prayerValue.length === 0) {
      alert("Type in a prayer and try again.");
      return;
    }
    if (!prayertoBeEdited && !categorytoBeEdited) {
      dispatch(
        addPrayer({
          prayer: prayerValue,
          folder: folderName,
          folderId,
          category: categoryValue,
          date: new Date().toLocaleString(),
          id: uuid.v4(),
        })
      );
    } else {
      dispatch(
        editPrayer({
          prayer: prayerValue,
          folder: folderName,
          folderId,
          category: categoryValue,
          date: prayertoBeEdited.date,
          id: prayertoBeEdited.id,
        })
      );
      setIsEditing(false);
      setCategorytoBeEdited(null);
      setPrayertoBeEdited(null);
    }
    setModalVisible(false);
    setPrayerValue("");
    setIsEditing(false);
    setCategoryValue("");
  };

  if (!fontsLoaded) {
    return <BusyIndicator />;
  }

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={getPrimaryBackgroundColorStyle(actualTheme)}
          onPress={() => {
            setModalVisible(true);
            setTaskName("Add");
          }}
          className="dark:bg-dark-accent flex-row items-center justify-center gap-2 bg-light-primary p-5 rounded-xl shadow-md shadow-gray-300 dark:shadow-none"
        >
          <AntDesign
            name="plus"
            size={24}
            color={
              actualTheme && actualTheme.PrimaryTxt
                ? actualTheme.PrimaryTxt
                : colorScheme === "dark"
                  ? "#121212"
                  : "white"
            }
          />
          <Text
            style={getPrimaryTextColorStyle(actualTheme)}
            className="font-inter font-bold text-lg text-light-background dark:text-dark-background"
          >
            Add Prayer
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ModalContainer
            style={getMainBackgroundColorStyle(actualTheme)}
            className="bg-light-background dark:bg-dark-background"
          >
            <ModalView
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-light-secondary dark:bg-dark-secondary"
            >
              <ModalIcon>
                <View className="flex-row items-center gap-2">
                  <HeaderTitle
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter font-bold text-light-primary dark:text-dark-primary"
                  >
                    {taskName} Prayer
                  </HeaderTitle>
                  <AntDesign
                    name="edit"
                    size={24}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "white"
                          : "#2F2D51"
                    }
                  />
                </View>
              </ModalIcon>
              <StyledInput
                className="mt-3 items-center border border-light-secondary dark:border-[#d2d2d2] self-center font-inter"
                style={
                  actualTheme && actualTheme.SecondaryTxt
                    ? {
                        height: inputHeight < 60 ? 60 : inputHeight,
                        borderWidth: 1,
                        color: actualTheme.SecondaryTxt,
                        borderColor: actualTheme.SecondaryTxt,
                      }
                    : colorScheme === "dark"
                      ? {
                          height: inputHeight < 60 ? 60 : inputHeight,
                        }
                      : {
                          height: inputHeight < 60 ? 60 : inputHeight,
                        }
                }
                placeholder="Add a prayer"
                placeholderTextColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "#e0e0e0"
                }
                selectionColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "white"
                }
                autoFocus
                onChangeText={(text) => setPrayerValue(text)}
                value={prayerValue}
                onContentSizeChange={handleContentSizeChange}
                onSubmitEditing={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                multiline
              />
              <TouchableOpacity
                className="my-2 self-end"
                onPress={dismissKeyboard}
              >
                <Text className="font-inter text-red-500 font-semibold">
                  Dismiss Keyboard
                </Text>
              </TouchableOpacity>
              {/* fontSize: 13, paddingVertical: 5, color: "black", fontFamily:
              "Inter-Regular", */}
              <Text className="mt-2 font-inter font-semibold">
                Select a category (optional):
              </Text>
              <SelectList
                placeholder="selectcategory"
                setSelected={setCategoryValue}
                data={data}
                search={false}
                defaultOption={
                  isEditing
                    ? { key: "None", value: categoryValue }
                    : { key: "None", value: "None" }
                }
                fontFamily="Inter"
                boxStyles={
                  colorScheme === "dark"
                    ? [
                        actualTheme && actualTheme.SecondaryTxt
                          ? {
                              marginTop: 10,
                              height: 50,
                              alignItems: "center",
                              borderColor: actualTheme.SecondaryTxt,
                            }
                          : styles.categoryDark,
                      ]
                    : [
                        actualTheme && actualTheme.SecondaryTxt
                          ? {
                              marginTop: 10,
                              height: 50,
                              alignItems: "center",
                              borderColor: actualTheme.SecondaryTxt,
                            }
                          : styles.category,
                      ]
                }
                dropdownStyles={
                  colorScheme === "dark"
                    ? [
                        actualTheme && actualTheme.SecondaryTxt
                          ? {
                              marginTop: 10,
                              height: 50,
                              borderColor: actualTheme.SecondaryTxt,
                              height: 800,
                            }
                          : styles.dropdownDark,
                      ]
                    : [
                        actualTheme && actualTheme.SecondaryTxt
                          ? {
                              marginTop: 10,
                              height: 50,
                              borderColor: actualTheme.SecondaryTxt,
                              height: 800,
                            }
                          : styles.dropdown,
                      ]
                }
                dropdownTextStyles={
                  colorScheme === "dark"
                    ? [
                        actualTheme && actualTheme.SecondaryTxt
                          ? { color: actualTheme.SecondaryTxt, padding: 10 }
                          : styles.dropdownTextDark,
                      ]
                    : [
                        actualTheme && actualTheme.SecondaryTxt
                          ? { color: actualTheme.SecondaryTxt, padding: 10 }
                          : styles.dropdownText,
                      ]
                }
                inputStyles={
                  colorScheme === "dark"
                    ? [
                        actualTheme && actualTheme.SecondaryTxt
                          ? { color: actualTheme.SecondaryTxt }
                          : styles.inputTextDark,
                      ]
                    : [
                        actualTheme && actualTheme.SecondaryTxt
                          ? { color: actualTheme.SecondaryTxt }
                          : styles.inputText,
                      ]
                }
                arrowicon={
                  <AntDesign
                    name="down"
                    size={15}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "white"
                          : "#2f2d51"
                    }
                  />
                }
                maxHeight="250"
              />
              <ModalActionGroup>
                <ModalAction color="white" onPress={handleCloseModal}>
                  <AntDesign
                    name="close"
                    size={28}
                    color={colorScheme === "dark" ? "#121212" : "#2F2D51"}
                  />
                </ModalAction>
                <ModalAction
                  color={
                    actualTheme && actualTheme.Primary
                      ? actualTheme.Primary
                      : colorScheme === "dark"
                        ? "#121212"
                        : "#2F2D51"
                  }
                  onPress={handleSubmit}
                >
                  <AntDesign
                    name="check"
                    size={28}
                    color={
                      actualTheme && actualTheme.PrimaryTxt
                        ? actualTheme.PrimaryTxt
                        : "white"
                    }
                  />
                </ModalAction>
              </ModalActionGroup>
            </ModalView>
          </ModalContainer>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default InputModal;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  inputText: {
    color: "#2f2d51",
  },
  inputTextDark: {
    color: "white",
  },
  fabStyleDark: {
    position: "relative",
    alignSelf: "center",
    borderRadius: 20,
    fontFamily: "Inter-Medium",
    justifyContent: "center",
    backgroundColor: "#A5C9FF",
  },
  fabStyle: {
    position: "relative",
    alignSelf: "center",
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#2f2d51",
  },
  actionButtons: {
    position: "absolute",
    bottom: 10,
    height: 70,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  fabStyle2: {
    bottom: 10,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#2F2D51",
  },
  fabStyle3: {
    bottom: 10,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#2F2D51",
  },
  dismiss: {
    alignSelf: "flex-start",
    marginVertical: 5,
    padding: 2,
  },
  fabStyle3Dark: {
    bottom: 10,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#A5C9FF",
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
    // backgroundColor: "#2F2D51",
    borderWidth: 1,
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
    color: "#2f2d51",
    padding: 10,
  },
  dropdownTextDark: {
    color: "white",
    padding: 10,
  },

  elevation: {
    elevation: 6,
    shadowColor: "#13588c",
  },
});
