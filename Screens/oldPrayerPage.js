import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Container,
  HeaderTitle,
  HeaderView,
  ListView1,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";
import AppLoading from "expo-app-loading";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";
import { useEffect } from "react";

const OldPrayerPage = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const [todos, setTodos] = useState([]);
  const [ready, setReady] = useState(false);
  const [openClearModal, setOpenClearModal] = useState(false);
  const [isCopied, setisCopied] = useState("");
  const [selectedEdit, setSelectedEdit] = useState("");
  useEffect(() => {
    setisCopied("");
  }, []);
  const loadTodos = () => {
    AsyncStorage.getItem("storedTodos")
      .then((data) => {
        if (data !== null) {
          setTodos(JSON.parse(data));
        }
      })
      .catch((error) => console.log(error));
  };

  async function clearTodos() {
    await AsyncStorage.removeItem("storedTodos");
    setTodos(null);
    console.log("Successfully removed storedTodos");
  }

  const copyToClipboard = async (title, id) => {
    await Clipboard.setStringAsync(title);
    setisCopied(id);
  };

  function handleClearAll() {
    setOpenClearModal(true);
  }

  const handleCloseModal = () => {
    setOpenClearModal(false);
  };

  if (!ready) {
    return (
      <AppLoading
        startAsync={loadTodos}
        onFinish={() => setReady(true)}
        onError={console.warn}
      />
    );
  }

  const renderItem = ({ item }) => {
    return (
      <View>
        <ListView1
          style={
            theme == "dark"
              ? { backgroundColor: "#212121" }
              : { backgroundColor: "#93D8F8" }
          }
        >
          <View
            style={{
              flexDirection: "row",
              position: "relative",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={
                theme == "dark" ? { color: "white" } : { color: "#2f2d51" }
              }
            >
              {item.title}
            </Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(item.title, item.id)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text
                style={
                  theme == "dark"
                    ? { marginRight: 10, color: "#aaaaaa" }
                    : { marginRight: 10, color: "#454277" }
                }
              >
                {isCopied === item.id ? "Copied" : "Copy"}
              </Text>
              <Ionicons
                name="ios-copy-outline"
                size={24}
                color={theme == "dark" ? "#aaaaaa" : "#454277"}
              />
            </TouchableOpacity>
          </View>
        </ListView1>
      </View>
    );
  };
  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <HeaderView style={{ display: "flex", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Folders")}>
            <Ionicons
              name="chevron-back"
              size={30}
              color={theme == "light" ? "#2f2d51" : "grey"}
            />
          </TouchableOpacity>
          <HeaderTitle
            style={
              theme == "dark"
                ? { fontFamily: "Inter-Bold", color: "white" }
                : { fontFamily: "Inter-Bold", color: "#2f2d51" }
            }
          >
            Original Prayers
          </HeaderTitle>
        </View>
        <TouchableOpacity onPress={handleClearAll}>
          <Text
            style={
              theme == "dark"
                ? { color: "white", fontFamily: "Inter-Medium", fontSize: 15 }
                : { color: "#2f2d51", fontFamily: "Inter-Medium", fontSize: 15 }
            }
          >
            Clear original prayers
          </Text>
        </TouchableOpacity>
      </HeaderView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={openClearModal}
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
                    ? { fontFamily: "Inter-Bold", fontSize: 18, color: "white" }
                    : { fontSize: 18, fontFamily: "Inter-Bold" }
                }
              >
                Are you sure you want to delete all original prayers?
              </HeaderTitle>
            </ModalIcon>
            <ModalActionGroup>
              <ModalAction
                color={"white"}
                onPress={() => setOpenClearModal(false)}
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
                  clearTodos();
                  setOpenClearModal(false);
                }}
              >
                <AntDesign name="check" size={28} color={"white"} />
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </ModalContainer>
      </Modal>
      <SwipeListView
        data={todos}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e, i) => i.toString()}
        renderItem={renderItem}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  editContainerDark: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#3b3b3b",
    zIndex: 99,
    width: "60%",
    height: "150%",
    borderRadius: 5,
  },
  editContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#63c7f5",
    zIndex: 99,
    width: "60%",
    height: "150%",
    borderRadius: 5,
  },
});

export default OldPrayerPage;
