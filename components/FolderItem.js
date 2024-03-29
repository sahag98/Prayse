import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { editFolderName } from "../redux/folderReducer";
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
import { useState } from "react";

const FolderItem = ({
  item,
  theme,
  navigation,
  open,
  setOpen,
  setIdToDelete,
  idToDelete,
}) => {
  const dispatch = useDispatch();
  const [openEdit, setOpenEdit] = useState(false);
  const [newFolderName, setNewFolderName] = useState(item.name);

  const handleOpen = (item) => {
    navigation.navigate("PrayerPage", {
      title: item.name,
      prayers: item.prayers,
      id: item.id,
    });
  };

  function handleCloseEdit() {
    setOpenEdit(false);
  }

  function editFolder(id) {
    dispatch(
      editFolderName({
        name: newFolderName,
        id: id,
      })
    );
    setOpenEdit(false);
  }

  function handleDeleteFolder(id) {
    setIdToDelete(id);
  }

  return (
    <View key={item.id}>
      <View
        style={
          theme == "dark"
            ? [styles.containerDark, styles.elevationDark]
            : theme == "BlackWhite"
            ? [styles.containerBlack, styles.elevationBlack]
            : styles.container
        }
      >
        <View
          style={{
            display: "flex",
            position: "relative",
            height: "100%",

            justifyContent: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",

              justifyContent: "space-between",
              alignItems: "center",
              position: "absolute",
              top: 0,
            }}
          >
            <AntDesign
              name="folder1"
              size={28}
              color={theme == "BlackWhite" ? "white" : "#e8bb4e"}
            />

            <Feather
              style={{ marginLeft: 5 }}
              onPress={() => {
                handleDeleteFolder(item.id);
                setOpen(true);
              }}
              name="x"
              size={26}
              color={theme == "BlackWhite" ? "white" : "#e8bb4e"}
            />
          </View>
          <TouchableOpacity
            onPress={() => setOpenEdit(true)}
            style={{
              flexDirection: "row",

              alignItems: "center",
              marginBottom: 10,
              gap: 10,
            }}
          >
            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontSize: 18,
                marginVertical: 5,
                maxWidth: "90%",
                fontFamily: "Inter-Bold",
              }}
            >
              {item.name}
            </Text>
            <Feather
              name="edit-2"
              size={16}
              color={theme == "dark" ? "#b8b8b8" : "#2f2d51"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleOpen(item);
            }}
            style={theme == "dark" ? styles.viewDark : styles.view}
          >
            <Text
              style={
                theme == "BlackWhite"
                  ? {
                      color: "black",
                      fontFamily: "Inter-Medium",
                      fontSize: 14,
                    }
                  : {
                      color: "white",
                      fontFamily: "Inter-Medium",
                      fontSize: 14,
                    }
              }
            >
              View prayers
            </Text>
            <AntDesign
              style={{ marginLeft: 10 }}
              name="right"
              size={15}
              color={
                theme == "dark"
                  ? "white"
                  : theme == "BlackWhite"
                  ? "black"
                  : "white"
              }
            />
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={openEdit}
            onRequestClose={handleCloseEdit}
            statusBarTranslucent={true}
            // onShow={() => inputRef.current?.focus()}
          >
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "padding"}
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
                      Change folder name
                    </HeaderTitle>
                  </ModalIcon>
                  <StyledInput
                    style={theme == "dark" ? styles.inputDark : styles.input}
                    placeholder="Enter new folder name"
                    placeholderTextColor={"white"}
                    selectionColor={"white"}
                    autoFocus={true}
                    onChangeText={(text) => setNewFolderName(text)}
                    value={newFolderName}
                    onSubmitEditing={(e) => {
                      e.key === "Enter" && e.preventDefault();
                    }}
                  />
                  <ModalActionGroup>
                    <ModalAction
                      color={"white"}
                      onPress={() => setOpenEdit(false)}
                    >
                      <AntDesign
                        name="close"
                        size={28}
                        color={theme == "dark" ? "black" : "#2F2D51"}
                      />
                    </ModalAction>
                    <ModalAction
                      color={theme == "dark" ? "#121212" : "#2F2D51"}
                      onPress={() => editFolder(item.id)}
                    >
                      <AntDesign name="check" size={28} color={"white"} />
                    </ModalAction>
                  </ModalActionGroup>
                </ModalView>
              </ModalContainer>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default FolderItem;

const width = Dimensions.get("window").width - 30;

const styles = StyleSheet.create({
  elevation: {
    shadowColor: "#12111f",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  inputDark: {
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    backgroundColor: "#121212",
  },
  input: {
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontFamily: "Inter-Regular",
    backgroundColor: "#2F2D51",
  },
  elevationDark: {
    shadowColor: "#040404",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  elevationBlack: {
    shadowColor: "#040404",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  container: {
    backgroundColor: "#b7d3ff",
    padding: 8,
    width: width / 2 - 8,
    height: 135,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#bdbdbd",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 3,
  },

  containerDark: {
    backgroundColor: "#212121",
    padding: 8,
    width: width / 2 - 8,
    height: 135,
    marginBottom: 15,
    borderRadius: 10,
  },
  containerBlack: {
    backgroundColor: "black",
    padding: 8,
    width: width / 2 - 8,
    height: 135,
    marginBottom: 15,
    borderRadius: 10,
  },
  viewDark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    padding: 10,
    width: "100%",
    backgroundColor: "#2e2e2e",
    borderRadius: 5,
  },
  viewBlack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    padding: 9,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    padding: 10,
    width: "100%",
    backgroundColor: "#423f72",
    borderRadius: 10,
  },
});
