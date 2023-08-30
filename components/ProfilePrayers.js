import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const ProfilePrayers = ({
  item,
  theme,
  user,
  getPrayers,
  getUserPrayers,
  supabase,
}) => {
  async function handleDelete(id) {
    const { error } = await supabase.from("prayers").delete().eq("id", id);
    getUserPrayers();
    getPrayers();
  }
  return (
    <View
      style={
        theme == "dark" ? styles.prayerContainerDark : styles.prayerContainer
      }
    >
      <Text
        style={
          theme == "dark"
            ? {
                fontFamily: "Inter-Regular",
                color: "white",
                width: "80%",
                lineHeight: 20,
              }
            : {
                fontFamily: "Inter-Regular",
                color: "#2f2d51",
                width: "80%",
                lineHeight: 20,
              }
        }
      >
        {item.prayer}
      </Text>
      <TouchableOpacity
        // style={{ backgroundColor: "red", height: "100%", width: "20%" }}
        onPress={() => handleDelete(item.id)}
      >
        <AntDesign
          style={{ alignSelf: "center", verticalAlign: "middle" }}
          name="close"
          size={25}
          color={theme == "dark" ? "#ff4e4e" : "#cb3f68"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePrayers;

const styles = StyleSheet.create({
  prayerContainer: {
    width: "100%",
    borderBottomWidth: 0.8,
    padding: 10,
    borderBottomColor: "#2f2d51",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  prayerContainerDark: {
    width: "100%",
    borderBottomWidth: 0.8,
    padding: 10,
    borderBottomColor: "#797979",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
