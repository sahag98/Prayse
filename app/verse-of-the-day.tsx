// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { client } from "../lib/client";
import { addToFavorites } from "../redux/favoritesReducer";
import { FAVORITES_SCREEN, MORE_SCREEN } from "../routes";
import { Container, HeaderTitle } from "../styles/appStyles";

const VerseOfTheDayScreen = () => {
  const theme = useSelector((state) => state.user.theme);
  const favorites = useSelector((state) => state.favorites.favoriteVerses);
  const dispatch = useDispatch();
  const [verse, setVerse] = useState([]);
  const [verseTitle, setVerseTitle] = useState("");
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const routeParams = useLocalSearchParams();

  const router = useRouter();

  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const speak = async (verse, chapter) => {
    if (verse && chapter) {
      const speakVerse = verse + " - " + chapter;

      Speech.speak(speakVerse);
    }
  };
  useEffect(() => {
    loadDailyVerse();
  }, [isFocused]);

  const loadDailyVerse = () => {
    const query = '*[_type=="verse"]';
    client
      .fetch(query)
      .then((data) => {
        setVerse(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onShare = async (verse, chapter) => {
    if (verse && chapter) {
      const shareVerse = verse + " - " + chapter;

      try {
        await Share.share({
          message: shareVerse,
        });
      } catch (error) {
        Alert.alert(error.message);
      }
    }
  };

  const HandleFavorites = (verse) => {
    dispatch(
      addToFavorites({
        verse,
      }),
    );
  };

  const BusyIndicator = () => {
    return (
      <View
        style={
          theme == "dark"
            ? { backgroundColor: "#121212", flex: 1, justifyContent: "center" }
            : { backgroundColor: "#F2F7FF", flex: 1, justifyContent: "center" }
        }
      >
        <ActivityIndicator
          size="large"
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </View>
    );
  };

  if (verse.length == 0) {
    return <BusyIndicator />;
  }

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <View className="my-3 flex-row items-center">
        <TouchableOpacity
          className="mr-2"
          onPress={() => {
            if (routeParams?.previousScreen) {
              router.back();
              navigation.goBack();
            } else {
              router.push(MORE_SCREEN);
            }
          }}
        >
          <Ionicons
            name="chevron-back"
            size={30}
            color={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "light"
                  ? "#2f2d51"
                  : "white"
            }
          />
        </TouchableOpacity>
        <HeaderTitle
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter font-bold text-light-primary dark:text-dark-primary"
        >
          Verse of the Day
        </HeaderTitle>
      </View>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="font-inter mb-3 leading-6 text-light-primary dark:text-dark-primary"
      >
        Welcome to the Verse of the Day page! We hope to provide you with a
        daily reminder of God's love, grace, and wisdom.
      </Text>
      <Link href={`/${FAVORITES_SCREEN}`}>
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="w-full rounded-lg bg-light-secondary dark:bg-dark-secondary flex-row items-center justify-between p-4"
        >
          <View className="flex-row items-center gap-2">
            <AntDesign
              name="staro"
              size={26}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter font-medium text-lg text-light-primary dark:text-dark-primary"
            >
              Favorites
            </Text>
          </View>
          <AntDesign
            name="right"
            size={20}
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

      <View
        style={[
          getMainBackgroundColorStyle(actualTheme),
          actualTheme &&
            actualTheme.MainTxt && { borderColor: actualTheme.MainTxt },
        ]}
        className="justify-center mt-3 bg-light-background border border-light-primary dark:border-dark-primary dark:bg-dark-background self-center rounded-lg p-3"
      >
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter leading-7 text-light-primary dark:text-dark-primary"
        >
          {verse[0].verse}
        </Text>
        <View>
          {verse[0] !=
            "No daily verse just yet. (Make sure to enable notifications to recieve the daily verse)" && (
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="self-end font-inter text-lg font-medium text-light-primary dark:text-dark-primary"
            >
              - {verse[0].chapter}
            </Text>
          )}
          <View className="items-center flex-row justify-evenly mt-5">
            <TouchableOpacity
              onPress={() => onShare(verse[0].verse, verse[0].chapter)}
              className="flex-row w-[33.33%] h-full border-r border-r-gray-500 items-center justify-center"
            >
              <AntDesign
                name="sharealt"
                size={26}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                      ? "#ebebeb"
                      : "#2f2d51"
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => speak(verse[0].verse, verse[0].chapter)}
              className="flex-row w-[33.33%] h-full border-r border-r-gray-500 items-center justify-center"
            >
              <AntDesign
                name="sound"
                size={26}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                      ? "#ebebeb"
                      : "#2f2d51"
                }
              />
            </TouchableOpacity>
            {favorites?.some((item) => item.verse.verse == verse[0].verse) ? (
              <TouchableOpacity
                disabled
                className="flex-row w-[33.33%] h-full items-center justify-center"
              >
                <AntDesign name="staro" size={26} color="#bebe07" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => HandleFavorites(verse[0])}
                className="flex-row w-[33.33%] h-full  items-center justify-center"
              >
                <AntDesign
                  name="staro"
                  size={26}
                  color={
                    actualTheme && actualTheme.MainTxt
                      ? actualTheme.MainTxt
                      : colorScheme === "dark"
                        ? "#aaaaaa"
                        : "#2f2d51"
                  }
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Container>
  );
};

export default VerseOfTheDayScreen;
