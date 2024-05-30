import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Modal,
} from "react-native";
import {
  HeaderView,
  HeaderTitle,
  ModalContainer,
  ModalView2,
} from "../styles/appStyles";
import { useFonts } from "expo-font";
import {
  Ionicons,
  Feather,
  EvilIcons,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";
import { deleteFolder, deleteQuickFolder } from "../redux/folderReducer";
import { deletePrayerByFolderId } from "../redux/prayerReducer";
import { useState } from "react";
import EditFolder from "./EditFolder";
const Header = ({ navigation, folderName, folderId, theme }) => {
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  let [fontsLoaded] = useFonts({
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

  if (!fontsLoaded) {
    return <BusyIndicator />;
  }

  function deleteFolderById(id) {
    if (id == 4044) {
      dispatch(deleteQuickFolder(id));
      setOpen(false);
    } else {
      dispatch(deleteFolder(id));
      dispatch(deletePrayerByFolderId(id));
      setOpen(false);
    }
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
              onPress={() => navigation.navigate("Prayer")}
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
              {folderName}
            </HeaderTitle>
            <AntDesign
              name="folderopen"
              size={28}
              style={{ marginLeft: 10 }}
              color={theme == "dark" ? "#e8bb4e" : "#f1d592"}
            />
          </View>
          <Entypo
            name="dots-three-vertical"
            onPress={() => setIsShowingModal(true)}
            size={20}
            color={theme == "dark" ? "white" : "#2F2D51"}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isShowingModal}
          onRequestClose={() => setIsShowingModal(false)}
          statusBarTranslucent={true}
        >
          <View
            style={
              theme == "dark"
                ? {
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    // paddingBottom: 40,
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
            <View
              style={
                theme == "dark"
                  ? {
                      backgroundColor: "rgba(33, 33, 33, 0.7)",
                      width: "90%",
                      borderRadius: 10,
                      padding: 10,
                      gap: 10,
                    }
                  : {
                      backgroundColor: "#b7d3ff",
                      width: "90%",
                      borderRadius: 10,
                      padding: 10,
                      gap: 10,
                    }
              }
            >
              <TouchableOpacity
                onPress={() => {
                  setIsShowingModal(false);
                  setOpenEdit(true);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#212121",
                  borderRadius: 10,
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Inter-Medium",
                    fontSize: 15,
                    color: theme == "dark" ? "white" : "white",
                  }}
                >
                  Rename Folder
                </Text>
                <Feather name="edit" size={22} color="white" />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#212121",
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
                    fontSize: 15,
                    color: theme == "dark" ? "white" : "red",
                  }}
                >
                  Share
                </Text>

                <Feather name="share" size={21} color="white" />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#270000",
                  borderRadius: 10,
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Inter-Bold",
                    fontSize: 15,
                    color: theme == "dark" ? "#ff3b3b" : "#ff3b3b",
                  }}
                >
                  Delete
                </Text>
                <EvilIcons name="trash" size={24} color="#ff3b3b" />
              </View>
            </View>
          </View>
        </Modal>
        <EditFolder
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          folderName={folderName}
          theme={theme}
          folderId={folderId}
        />
        {/* <View style={{ position: "absolute", bottom: 0 }}>
          <Text style={{ color: "red" }}> Delete</Text>
        </View> */}
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
