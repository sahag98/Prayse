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
import ProfileModal from "../components/ProfileModal";
import { Ionicons } from "@expo/vector-icons";

const CommunityHome = () => {
  const { currentUser, logout, supabase } = useSupabase();
  const theme = useSelector((state) => state.user.theme);
  const [modalVisible, setModalVisible] = useState(false);

  console.log("in home :", currentUser);

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
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={
              theme == "dark" ? styles.featherIconDark : styles.featherIcon
            }
          >
            <Ionicons name="settings" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </HeaderView>
      <ProfileModal
        logout={logout}
        supabase={supabase}
        modalVisible={modalVisible}
        user={currentUser}
        setModalVisible={setModalVisible}
      />
    </Container>
  );
};

export default CommunityHome;

const styles = StyleSheet.create({
  profileImg: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  iconContainer: {
    position: "relative",
    padding: 8,
  },
  featherIconDark: {
    position: "absolute",
    backgroundColor: "#A5C9FF",
    borderRadius: 50,
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    bottom: 4,
    right: 2,
  },
  featherIcon: {
    position: "absolute",
    backgroundColor: "#93d8f8",
    borderRadius: 50,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    bottom: 4,
    right: 2,
  },
});
