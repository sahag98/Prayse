import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { HeaderView, HeaderTitle } from "../styles/appStyles";
import { useFonts } from "expo-font";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const Header = ({ navigation, folderName, theme }) => {
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

  return (
    <>
      <HeaderView>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate("Folders")}
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
        </View>
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
