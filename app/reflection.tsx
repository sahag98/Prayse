// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { useSelector } from "react-redux";

import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import ReflectionItem from "../components/ReflectionItem";
import config from "../config";
import { useSupabase } from "../context/useSupabase";
import { COMMUNITY_SCREEN, DEVO_LIST_SCREEN } from "../routes";
import { Container, HeaderView } from "../styles/appStyles";

const ReflectionScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.user.theme);
  const [reflectionsArray, setReflectionsArray] = useState([]);
  const [reflection, setReflection] = useState("");
  const [inputHeight, setInputHeight] = useState(60);
  const {
    isLoggedIn,
    currentUser,
    refreshReflections,
    setRefreshReflections,
    supabase,
  } = useSupabase();
  const isFocused = useIsFocused();
  const [channel, setChannel] = useState();

  useEffect(() => {
    fetchReflections();
  }, [isFocused, refreshReflections]);

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const createTwoButtonAlert = () =>
    Alert.alert("Not Signed In", "Sign in to write a reflection.", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Sign in",
        onPress: () => navigation.navigate(COMMUNITY_SCREEN),
      },
    ]);

  const checkSignIn = () => {
    if (!isLoggedIn) {
      createTwoButtonAlert();
    } else {
      console.log("signed in");
    }
  };

  const fetchReflections = async () => {
    const { data, error } = await supabase
      .from("reflections")
      .select("*, profiles(full_name,avatar_url)")
      .eq("devo_title", route?.params?.devoTitle);
    setReflectionsArray(data);
    setRefreshReflections(false);
  };

  const sendReflection = async () => {
    if (reflection.length == 0) {
      return;
    }
    try {
      const { data, error } = await supabase.from("reflections").insert({
        user_id: currentUser?.id,
        devo_title: route?.params?.devoTitle,
        reflection,
      });
      setReflection("");
      fetchReflections();
    } catch (error) {
      console.log(error);
    }
    function truncateWords(str, numWords) {
      const words = str.split(" ");
      if (words.length > numWords) {
        return words.slice(0, numWords).join(" ") + " ...";
      } else {
        return str;
      }
    }

    const truncatedString = truncateWords(reflection, 8);
    const message = {
      title: `Reflection on Devotional: ${route?.params?.devoTitle}`,
      message: `${currentUser?.full_name} has wrote a reflection: ${truncatedString}`,
      data: {
        screen: "Reflection",
        verseTitle: "",
        devoTitle: route?.params?.devoTitle,
      },
    };

    fetch(config.prayseMessage, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Container
        style={
          theme == "dark"
            ? { backgroundColor: "#121212" }
            : { backgroundColor: "#F2F7FF" }
        }
      >
        <HeaderView
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Link to={`/${DEVO_LIST_SCREEN}`}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: theme == "dark" ? "#212121" : "#d2d2d2",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 100,
                padding: 5,
                gap: 5,
              }}
            >
              <AntDesign
                name="left"
                size={28}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
            </View>
          </Link>
        </HeaderView>
        <Text
          style={
            theme == "dark"
              ? {
                  color: "#d2d2d2",

                  textTransform: "uppercase",
                  fontFamily: "Inter-Medium",
                }
              : {
                  color: "#2f2d51",

                  textTransform: "uppercase",
                  fontFamily: "Inter-Medium",
                }
          }
        >
          {route?.params?.devoTitle}
        </Text>
        <Text
          style={
            theme == "dark"
              ? {
                  color: "white",
                  fontSize: 24,
                  marginTop: 10,
                  marginBottom: 10,
                  fontFamily: "Inter-Bold",
                }
              : {
                  color: "#2f2d51",
                  fontSize: 24,
                  marginTop: 10,
                  marginBottom: 10,
                  fontFamily: "Inter-Bold",
                }
          }
        >
          Reflections
        </Text>
        <View style={{ flex: 1, width: "100%" }}>
          {reflectionsArray.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5
                name="comments"
                size={80}
                color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
              />

              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Bold",
                        marginTop: 10,
                        fontSize: 18,
                        color: "white",
                      }
                    : {
                        fontFamily: "Inter-Bold",
                        marginTop: 10,
                        fontSize: 18,
                        color: "#2f2d51",
                      }
                }
              >
                No Reflections yet.
              </Text>
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Regular",
                        marginTop: 10,
                        color: "#d2d2d2",
                      }
                    : {
                        fontFamily: "Inter-Regular",
                        marginTop: 10,
                        color: "#2f2d51",
                      }
                }
              >
                Be the first and write a reflection.
              </Text>
            </View>
          ) : (
            <FlatList
              data={reflectionsArray}
              keyExtractor={(e, i) => i.toString()}
              onEndReachedThreshold={0}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <Divider
                  style={
                    theme == "dark"
                      ? { backgroundColor: "#525252", marginBottom: 10 }
                      : { backgroundColor: "#2f2d51", marginBottom: 10 }
                  }
                />
              )}
              renderItem={({ item }) => (
                <ReflectionItem item={item} theme={theme} />
              )}
            />
          )}
        </View>
      </Container>
      {isLoggedIn ? (
        <View
          style={theme == "dark" ? styles.inputFieldDark : styles.inputField}
        >
          <TextInput
            style={theme == "dark" ? styles.inputDark : styles.input}
            placeholder="Add your reflection..."
            onPressIn={checkSignIn}
            autoFocus={false}
            placeholderTextColor={theme == "dark" ? "#b8b8b8" : "#2f2d51"}
            selectionColor={theme == "dark" ? "white" : "#2f2d51"}
            value={reflection}
            onChangeText={(text) => setReflection(text)}
            onContentSizeChange={handleContentSizeChange}
            onSubmitEditing={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            multiline
            // // ios fix for centering it at the top-left corner
            // numberOfLines={5}
          />
          <TouchableOpacity
            disabled={reflection.length == 0}
            onPress={sendReflection}
            style={{
              backgroundColor:
                theme == "dark"
                  ? reflection.length == 0
                    ? "#212121"
                    : "#a5c9ff"
                  : reflection.length == 0
                    ? "grey"
                    : "#2f2d51",
              borderRadius: 100,
              padding: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="arrowup"
              size={38}
              color={theme == "dark" ? "#121212" : "white"}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={
            theme == "dark" ? styles.signInButtonDark : styles.signInButton
          }
        >
          <Text
            onPress={() => navigation.navigate(COMMUNITY_SCREEN)}
            style={
              (styles.signIn,
              {
                color: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                fontFamily: "Inter-Medium",
              })
            }
          >
            Press here to sign in.
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ReflectionScreen;

const styles = StyleSheet.create({
  signInButton: {
    borderTopColor: "#d2d2d2",
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  signInButtonDark: {
    borderTopColor: "#484848",
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#121212",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  signIn: {
    fontSize: 15,
  },
  inputFieldDark: {
    borderTopColor: "#484848",
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#121212",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  inputField: {
    borderTopColor: "#d2d2d2",
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  inputDark: {
    color: "white",
    fontFamily: "Inter-Regular",
    width: "80%",

    borderRadius: 10,
    padding: 15,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "85%",

    borderRadius: 10,
    padding: 15,
  },
});
