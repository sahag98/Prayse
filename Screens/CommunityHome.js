import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSupabase } from "../context/useSupabase";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { Image } from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const CommunityHome = () => {
  const { currentUser, logout } = useSupabase();
  const theme = useSelector((state) => state.user.theme);

  console.log("in Home :", currentUser);

  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <HeaderView style={{ marginTop: 0 }}>
        <HeaderTitle
          style={
            theme == "dark"
              ? { fontFamily: "Inter-Bold", color: "white" }
              : { fontFamily: "Inter-Bold", color: "#2F2D51" }
          }
        >
          Community
        </HeaderTitle>
        <View style={styles.iconContainer}>
          <Image
            style={styles.profileImg}
            source={{ uri: currentUser?.avatar_url }}
          />
          <View style={styles.featherIcon}>
            <MaterialIcons name="edit" size={20} color="black" />
          </View>
        </View>
      </HeaderView>
      <TouchableOpacity onPress={logout}>
        <Text>{currentUser?.full_name}</Text>
        <Text>Log out</Text>
      </TouchableOpacity>
    </Container>
  );
};

export default CommunityHome;

const styles = StyleSheet.create({
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  iconContainer: {
    position: "relative",
    padding: 8,
  },
  featherIcon: {
    position: "absolute",
    backgroundColor: "#93d8f8",
    borderRadius: 50,
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    bottom: 0,
    right: 2,
  },
});
