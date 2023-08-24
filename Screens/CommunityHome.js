import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useSupabase } from "../context/useSupabase";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { Image } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import ProfileModal from "../components/ProfileModal";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedFAB } from "react-native-paper";
import CommunityPrayers from "../components/CommunityPrayers";
import CommunityModal from "../components/ComunityModal";
import { useIsFocused } from "@react-navigation/native";
import { Animated } from "react-native";
import { useRef } from "react";

const CommunityHome = () => {
  const { currentUser, setCurrentUser, logout, supabase } = useSupabase();
  const theme = useSelector((state) => state.user.theme);
  const [modalVisible, setModalVisible] = useState(false);
  const [extended, setExtended] = useState(true);
  const [prayerModal, setPrayerModal] = useState(false);
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(true);
  const [prayers, setPrayers] = useState([]);
  const isIOS = Platform.OS === "ios";
  const { current: velocity } = useRef(new Animated.Value(0));
  const scrollTimeoutRef = useRef(null);
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    if (!isIOS) {
      return velocity.setValue(currentScrollPosition);
    }

    if (scrollTimeoutRef.current) {
      console.log("hey");
    }

    setExtended(currentScrollPosition <= 0);
  };

  useEffect(() => {
    if (!isIOS) {
      velocity.addListener(({ value }) => {
        setExtended(value <= 0);
      });
    } else setExtended(extended);
  }, [velocity, extended, isIOS]);

  async function getPrayers() {
    let { data: prayers, error } = await supabase
      .from("prayers")
      .select("*, profiles(*)")
      .order("id", { ascending: false });
    setPrayers(prayers);
  }

  useEffect(() => {
    getPrayers();
  }, []);

  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212", position: "relative" }
          : { backgroundColor: "#F2F7FF", position: "relative" }
      }
    >
      <HeaderView style={{ marginTop: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <HeaderTitle
            style={
              theme == "dark"
                ? { fontFamily: "Inter-Bold", color: "white" }
                : {
                    fontFamily: "Inter-Bold",
                    color: "#2F2D51",
                  }
            }
          >
            <Text>Welcome</Text>
          </HeaderTitle>
          <MaterialCommunityIcons name="hand-wave" size={30} color="#ffe03b" />
        </View>
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
        getPrayers={getPrayers}
        logout={logout}
        setCurrentUser={setCurrentUser}
        supabase={supabase}
        modalVisible={modalVisible}
        user={currentUser}
        setModalVisible={setModalVisible}
      />
      <CommunityModal
        getPrayers={getPrayers}
        logout={logout}
        supabase={supabase}
        modalVisible={prayerModal}
        user={currentUser}
        setModalVisible={setPrayerModal}
      />

      <CommunityPrayers
        visible={visible}
        setVisible={setVisible}
        prayers={prayers}
        setPrayers={setPrayers}
        onScroll={onScroll}
        supabase={supabase}
        currentUser={currentUser}
      />
      <View style={styles.actionButtons}>
        <AnimatedFAB
          icon={"plus"}
          label={"Add prayer"}
          extended={extended}
          onPress={() => setPrayerModal(true)}
          visible={true}
          animateFrom={"left"}
          iconMode={"dynamic"}
          color={theme == "dark" ? "#212121" : "white"}
          style={theme == "dark" ? styles.fabStyleDark : styles.fabStyle}
        />
      </View>
    </Container>
  );
};

export default CommunityHome;

const styles = StyleSheet.create({
  actionButtons: {
    position: "absolute",
    right: 15,
    bottom: 15,
    display: "flex",
  },
  fabStyleDark: {
    position: "relative",
    alignSelf: "flex-end",
    justifyContent: "center",
    backgroundColor: "#A5C9FF",
  },
  fabStyle: {
    position: "relative",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: "#2f2d51",
  },
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
