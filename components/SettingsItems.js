import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";

const SettingsItems = ({ options, theme, navigation }) => {
  return (
    <>
      {options.map((option) =>
        option.link ? (
          <TouchableOpacity
            key={option.id}
            onPress={() => Linking.openURL(option.link)}
            style={theme === "dark" ? styles.verseDark : styles.verse}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {option.icon}

              <Text
                style={
                  theme === "dark"
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
                {option.title}
              </Text>
            </View>
            <AntDesign
              style={{ marginLeft: 10 }}
              name="right"
              size={14}
              color={theme === "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            key={option.id}
            onPress={() => navigation.navigate(option.screen)}
            style={theme === "dark" ? styles.verseDark : styles.verse}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {option.icon}
              <Text
                style={
                  theme === "dark"
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
                {option.title}
              </Text>
            </View>
            <AntDesign
              style={{ marginLeft: 10 }}
              name="right"
              size={14}
              color={theme === "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
        ),
      )}
    </>
  );
};

export default SettingsItems;

const styles = StyleSheet.create({
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
    shadowColor: "#bdbdbd",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 3,
    padding: 20,
    borderRadius: 20,
    justifyContent: "space-between",
    marginBottom: 15,
  },
});
