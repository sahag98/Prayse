import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { HeaderTitle, HeaderView } from "../styles/appStyles";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useSupabase } from "../context/useSupabase";
import WelcomeModal from "../components/WelcomeModal";
import { useNavigation } from "@react-navigation/native";

const PublicCommunity = () => {
  const theme = useSelector((state) => state.user.theme);
  const navigation = useNavigation();
  const [isShowingWelcome, setIsShowingWelcome] = useState(false);
  const {
    currentUser,
    setCurrentUser,
    session,
    newPost,
    setNewPost,
    logout,
    supabase,
  } = useSupabase();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    const wavingAnimation = withSpring(15, { damping: 2, stiffness: 80 });

    rotation.value = withSequence(wavingAnimation);
  }, [isFocused]);

  if (currentUser?.full_name == null) {
    return (
      <WelcomeModal
        supabase={supabase}
        setCurrentUser={setCurrentUser}
        isShowingWelcome={true}
        setIsShowingWelcome={setIsShowingWelcome}
        user={currentUser}
      />
    );
  }

  return (
    <View>
      <HeaderView style={{ marginTop: 0 }}>
        <Animated.View
          entering={FadeIn.duration(500)}
          style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        >
          <HeaderTitle
            style={
              theme == "dark"
                ? {
                    fontFamily: "Inter-Bold",
                    fontSize: 20,
                    letterSpacing: 2,
                    color: "white",
                  }
                : {
                    fontFamily: "Inter-Bold",
                    fontSize: 20,
                    color: "#2F2D51",
                  }
            }
          >
            <Text>Welcome</Text>
          </HeaderTitle>
          <Animated.View style={animatedStyle}>
            <MaterialCommunityIcons
              name="hand-wave"
              size={30}
              color="#ffe03b"
            />
          </Animated.View>
        </Animated.View>
        <View style={styles.iconContainer}>
          <Image
            style={styles.profileImg}
            source={{
              uri: currentUser?.avatar_url
                ? currentUser?.avatar_url
                : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
            }}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={
              theme == "dark" ? styles.featherIconDark : styles.featherIcon
            }
          >
            <Ionicons name="settings" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </HeaderView>
      <TouchableOpacity
        onPress={() => navigation.navigate("Question")}
        style={theme === "dark" ? styles.questionDark : styles.question}
      >
        <Text
          style={
            theme == "dark"
              ? { color: "white", fontFamily: "Inter-Medium" }
              : { color: "#2f2d51", fontFamily: "Inter-Medium" }
          }
        >
          Question of the Week
        </Text>
        <AntDesign
          name="right"
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PublicCommunity;

const styles = StyleSheet.create({});
