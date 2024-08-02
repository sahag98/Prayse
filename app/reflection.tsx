// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
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
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
} from "@lib/customStyles";
import { useIsFocused } from "@react-navigation/native";
import { ActualTheme } from "@types/reduxTypes";

import ReflectionItem from "../components/ReflectionItem";
import config from "../config";
import { useSupabase } from "../context/useSupabase";
import { COMMUNITY_SCREEN, DEVO_LIST_SCREEN } from "../routes";
import { Container, HeaderView } from "../styles/appStyles";

const ReflectionScreen = ({ route }) => {
  const params = useLocalSearchParams();

  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const { colorScheme } = useColorScheme();
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
      .eq("devo_title", params?.devoTitle);
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
        devo_title: params?.devoTitle,
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
        devoTitle: params?.devoTitle,
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
        style={getMainBackgroundColorStyle(actualTheme)}
        className="bg-light-background dark:bg-dark-background"
      >
        <HeaderView className="flex-row self-start">
          <Link href={`/${DEVO_LIST_SCREEN}`}>
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="flex-row items-center justify-center rounded-full bg-[#d2d2d2] dark:bg-dark-secondary p-2"
            >
              <AntDesign
                name="left"
                size={28}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </View>
          </Link>
        </HeaderView>
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="uppercase font-inter font-semibold text-light-primary dark:text-[#d2d2d2]"
        >
          {params?.devoTitle}
        </Text>
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter font-bold text-3xl my-3 text-light-primary dark:text-dark-primary"
        >
          Reflections
        </Text>
        <View className="flex-1 w-full">
          {reflectionsArray.length == 0 ? (
            <View className="flex-1 items-center justify-center">
              <FontAwesome5
                name="comments"
                size={80}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                      ? "#a5c9ff"
                      : "#2f2d51"
                }
              />

              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter font-semibold text-2xl mt-3 text-light-primary dark:text-dark-primary"
              >
                No Reflections yet.
              </Text>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="mt-3 font-inter  text-light-primary dark:text-[#d2d2d2]"
              >
                Be the first to write a reflection.
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
                  style={getSecondaryBackgroundColorStyle(actualTheme)}
                  className="bg-light-primary dark:bg-[#525252] mb-3"
                />
              )}
              renderItem={({ item }) => (
                <ReflectionItem
                  actualTheme={actualTheme}
                  item={item}
                  theme={colorScheme}
                />
              )}
            />
          )}
        </View>
      </Container>
      {isLoggedIn ? (
        <View
          style={getMainBackgroundColorStyle(actualTheme)}
          className="border-t border-t-light-primary dark:border-t-dark-accent p-3 bg-light-background dark:bg-dark-background flex-row justify-between items-center w-full"
        >
          <TextInput
            style={getMainTextColorStyle(actualTheme)}
            className="w-4/5 font-inter text-light-primary dark:text-dark-primary"
            placeholder="Add your reflection..."
            onPressIn={checkSignIn}
            autoFocus={false}
            placeholderTextColor={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "#b8b8b8"
                  : "#2f2d51"
            }
            selectionColor={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
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
                colorScheme === "dark"
                  ? reflection.length === 0
                    ? "grey"
                    : actualTheme && actualTheme.Primary
                      ? actualTheme.Primary
                      : "#a5c9ff"
                  : reflection.length === 0
                    ? "grey"
                    : actualTheme && actualTheme.Primary
                      ? actualTheme.Primary
                      : "#2f2d51",
              borderRadius: 100,
              padding: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="arrowup"
              size={35}
              color={
                actualTheme && actualTheme.PrimaryTxt
                  ? actualTheme.PrimaryTxt
                  : colorScheme === "dark"
                    ? "#121212"
                    : "white"
              }
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={
            actualTheme &&
            actualTheme.Secondary && { borderTopColor: actualTheme.Secondary }
          }
          className="py-2 px-3 flex-row justify-center items-center border-t-2 border-t-light-secondary w-full self-center dark:bg-dark-background bg-light-background"
        >
          <Text
            onPress={() => navigation.navigate(COMMUNITY_SCREEN)}
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter text-lg font-medium text-light-primary dark:text-dark-accent"
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
