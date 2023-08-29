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
      <Text>{item.prayer}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <AntDesign
          name="close"
          size={25}
          color={theme == "dark" ? "white" : "#2f2d51"}
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
    paddingHorizontal: 10,
    borderBottomColor: "#2f2d51",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
  },
  prayerContainerDark: {
    width: "100%",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50,
  },
});
