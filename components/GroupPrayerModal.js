import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import { AntDesign } from "@expo/vector-icons";
const GroupPrayerModal = ({
  theme,
  supabase,
  isShowingModal,
  currentUser,
  currGroup,
  setIsShowingModal,
}) => {
  const [prayerValue, setPrayerValue] = useState("");
  const [inputHeight, setInputHeight] = useState(60);

  const handleCloseModal = () => {
    setIsShowingModal(false);

    setPrayerValue("");
  };

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  async function handleSubmit() {
    console.log(currGroup.id, prayerValue, currentUser?.id);
    const { data, error } = await supabase.from("group_prayers").insert({
      prayer: prayerValue,
      user_id: currentUser?.id,
      group_id: currGroup.group_id,
    });
    console.log("error: ", error);
    handleCloseModal();
  }
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isShowingModal}
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
                  Add Prayer
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
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
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
  );
};

export default GroupPrayerModal;

const styles = StyleSheet.create({});
