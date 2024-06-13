import React from "react";
import { useFonts } from "expo-font";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import SettingsItems from "../components/SettingsItems";
import config from "../config";
import { Container, HeaderTitle } from "../styles/appStyles";

const More = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);

  function giveFeedback(market) {
    if (market == "android") {
      Linking.openURL(
        `market://details?id=${config.androidPackageName}&showAllReviews=true`,
      );
    }
    if (market == "ios") {
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${config.iosItemId}?action=write-review`,
      );
    }
  }

  const options = [
    {
      id: 1,
      icon: (
        <Ionicons
          name="book-outline"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "Verse of the Day",
      screen: "VerseOfTheDay",
    },
    {
      id: 2,
      icon: (
        <AntDesign
          name="setting"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "Settings",
      screen: "Settings",
    },
    {
      id: 3,
      icon: (
        <AntDesign
          name="infocirlceo"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "About",
      link: "https://www.prayse.app/",
    },
    {
      id: 4,
      icon: (
        <Feather
          name="map"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "Roadmap",
      screen: "Roadmap",
    },
    {
      id: 5,
      icon: (
        <Feather
          name="shield"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "Privacy Policy",
      link: "https://www.prayse.app/privacy",
    },
    {
      id: 6,
      icon: (
        <MaterialCommunityIcons
          name="email-edit-outline"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "Contact Developer",
      link: "mailto:arzsahag@gmail.com",
    },
    {
      id: 7,
      icon: (
        <AntDesign
          name="instagram"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "Follow us on Instagram",
      link: "https://instagram.com/prayse.app",
    },
  ];

  const [fontsLoaded] = useFonts({
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
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
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <HeaderTitle
          style={
            theme == "dark"
              ? {
                  fontFamily: "Inter-Bold",
                  fontSize: 22,
                  color: "white",
                  marginVertical: 10,
                }
              : {
                  fontFamily: "Inter-Bold",
                  fontSize: 22,
                  color: "#2F2D51",
                  marginVertical: 10,
                }
          }
        >
          More
        </HeaderTitle>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.buymeacoffee.com/prayse")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            // width: "35%",
            gap: 10,
            padding: 8,
            // paddingHorizontal: 15,
            // paddingVertical: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme == "dark" ? "#a5c9ff" : "#2f2d51",
          }}
        >
          <AntDesign
            name="hearto"
            size={24}
            color={theme == "BlackWhite" ? "black" : "#DE3163"}
          />
          <Text
            style={{
              fontFamily: "Inter-Bold",
              color: theme == "dark" ? "white" : "#2f2d51",
            }}
          >
            Give to Prayse
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingsItems
          options={options}
          theme={theme}
          navigation={navigation}
        />
        {Platform.OS === "ios" ? (
          <TouchableOpacity
            onPress={() => giveFeedback("ios")}
            style={theme == "dark" ? styles.verseDark : styles.verse}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="feedback"
                size={24}
                style={{ marginRight: 10 }}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Medium",
                        color: "white",
                        fontSize: 16,
                      }
                    : {
                        fontFamily: "Inter-Medium",
                        color: "#2f2d51",
                        fontSize: 16,
                      }
                }
              >
                Feedback
              </Text>
            </View>
            <AntDesign
              style={{ marginLeft: 10 }}
              name="right"
              size={14}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => giveFeedback("android")}
            style={theme == "dark" ? styles.verseDark : styles.verse}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="feedback"
                size={24}
                style={{ marginRight: 10 }}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Medium",
                        color: "#dbdbdb",
                        fontSize: 16,
                      }
                    : {
                        fontFamily: "Inter-Medium",
                        color: "#2f2d51",
                        fontSize: 16,
                      }
                }
              >
                Feedback
              </Text>
            </View>
            <AntDesign
              style={{ marginLeft: 10 }}
              name="right"
              size={14}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    </Container>
  );
};

export default More;

const styles = StyleSheet.create({
  inputDark: {
    borderRadius: 10,
    padding: 8,
    color: "white",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    backgroundColor: "#353535",
    marginBottom: 12,
  },
  input: {
    borderRadius: 10,
    padding: 8,
    color: "#2f2d51",
    borderColor: "black",
    fontFamily: "Inter-Regular",
    marginBottom: 12,
    backgroundColor: "#4bbef3",
  },
  verseDark: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#212121",
    padding: 20,
    borderRadius: 20,
    justifyContent: "space-between",
    marginBottom: 15,
  },
  verse: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b7d3ff",
    padding: 20,
    borderRadius: 20,
    justifyContent: "space-between",
    marginBottom: 15,
  },
});
