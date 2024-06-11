import React from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, EvilIcons } from "@expo/vector-icons";

const SearchBar = ({ theme, search, setSearch }) => {
  const closeSearch = () => {
    setSearch("");
    Keyboard.dismiss();
  };
  return (
    <View
      style={{
        backgroundColor: theme === "dark" ? "#212121" : "white",
        borderRadius: 10,
        padding: 10,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 15,
      }}
    >
      <View
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <EvilIcons
          name="search"
          size={24}
          color={theme === "dark" ? "#d2d2d2" : "#2f2d51"}
        />
        <TextInput
          style={styles.textInputStyle}
          value={search}
          placeholder="Search prayers..."
          placeholderTextColor="#d2d2d2"
          selectionColor={theme === "dark" ? "white" : "#2f2d51"}
          onChangeText={(text) => setSearch(text)}
          autoFocus={false}
        />
      </View>
      <TouchableOpacity onPress={closeSearch}>
        <AntDesign
          name="close"
          size={22}
          color={theme === "dark" ? "#d2d2d2" : "#2f2d51"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textInputStyle: {
    width: "100%",
    fontSize: 13,
    marginLeft: 10,
  },
});

export default SearchBar;
