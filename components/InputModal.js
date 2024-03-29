import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Keyboard,
  View,
  Text,
  Modal,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  ModalContainer,
  ModalView,
  StyledInput,
  ModalAction,
  ModalActionGroup,
  ModalIcon,
  HeaderTitle,
} from "../styles/appStyles";
import { SelectList } from "react-native-dropdown-select-list";
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import uuid from "react-native-uuid";
import { AnimatedFAB } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { addPrayer, editPrayer } from "../redux/prayerReducer";
import { useEffect } from "react";

const InputModal = ({
  categoryValue,
  setTaskName,
  categorytoBeEdited,
  isEditing,
  setIsEditing,
  setCategorytoBeEdited,
  taskName,
  isIOS,
  visible,
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
  let [fontsLoaded] = useFonts({
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

  const [selected, setSelected] = useState("");

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
    if (prayerValue.length == 0) {
      alert("Type in a prayer and try again.");
      return;
    }
    if (!prayertoBeEdited && !categorytoBeEdited) {
      dispatch(
        addPrayer({
          prayer: prayerValue,
          folder: folderName,
          folderId: folderId,
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
          folderId: folderId,
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
        <AnimatedFAB
          icon={"plus"}
          label={"Add prayer"}
          extended={isExtended}
          onPress={() => {
            setModalVisible(true);
            setTaskName("Add");
          }}
          visible={visible}
          animateFrom={"left"}
          iconMode={"dynamic"}
          color={theme == "dark" ? "#121212" : "white"}
          style={theme == "dark" ? styles.fabStyleDark : styles.fabStyle}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
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
                  : { backgroundColor: "#b7d3ff" }
              }
            >
              <ModalIcon>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <HeaderTitle
                    style={
                      theme == "dark"
                        ? { fontFamily: "Inter-Bold", color: "white" }
                        : { fontFamily: "Inter-Bold" }
                    }
                  >
                    {taskName} Prayer
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
                onChangeText={(text) => setPrayerValue(text)}
                value={prayerValue}
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
                setSelected={setCategoryValue}
                data={data}
                search={false}
                defaultOption={
                  isEditing
                    ? { key: "None", value: categoryValue }
                    : { key: "None", value: "None" }
                }
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
                  onPress={handleSubmit}
                >
                  <AntDesign name="check" size={28} color={"white"} />
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
  dropdownTextDark: {
    color: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },

  elevation: {
    elevation: 6,
    shadowColor: "#13588c",
  },
});
