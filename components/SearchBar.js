import React from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Keyboard,
} from "react-native";
import { EvilIcons, AntDesign } from "@expo/vector-icons";

const SearchBar = ({ theme, search, setSearch }) => {
  const closeSearch = () => {
    setSearch("");
    Keyboard.dismiss();
  };
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#bdbdbd",

        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5.62,
        elevation: 7,
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
        <EvilIcons name="search" size={24} color="black" />
        <TextInput
          style={styles.textInputStyle}
          value={search}
          placeholder="Search prayers..."
          placeholderTextColor={"#212121"}
          selectionColor={theme == "dark" ? "white" : "#2f2d51"}
          onChangeText={(text) => setSearch(text)}
          autoFocus={false}
        />
      </View>
      <TouchableOpacity onPress={closeSearch}>
        <AntDesign name="close" size={22} color="black" />
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
