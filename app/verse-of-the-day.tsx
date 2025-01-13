// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import * as Speech from "expo-speech";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

import { client } from "../lib/client";
import { addToFavorites } from "../redux/favoritesReducer";
import { FAVORITES_SCREEN, MORE_SCREEN } from "../routes";
import { Container, HeaderTitle } from "../styles/appStyles";

const VerseOfTheDayScreen = () => {
  const favorites = useSelector((state) => state.favorites.favoriteVerses);
  const dispatch = useDispatch();
  const [verse, setVerse] = useState([]);

  const routeParams = useLocalSearchParams();

  const router = useRouter();
  const navigation = useNavigation();

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

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      loadDailyVerse();

      // Return function is invoked whenever the route gets out of focus.
    }, []),
  );

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
          colorScheme === "dark"
            ? { backgroundColor: "#121212", flex: 1, justifyContent: "center" }
            : { backgroundColor: "#F2F7FF", flex: 1, justifyContent: "center" }
        }
      >
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "white" : "#2f2d51"}
        />
      </View>
    );
  };

  if (verse.length === 0) {
    return <BusyIndicator />;
  }

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <View className="mb-10 pt-4 flex-row items-center">
        <TouchableOpacity
          className="mr-2"
          onPress={() => {
            if (routeParams?.previousScreen) {
              // router.back();
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
          className="font-inter-bold text-light-primary dark:text-dark-primary"
        >
          Verse of the Day
        </HeaderTitle>
      </View>
      <Link asChild href={`/${FAVORITES_SCREEN}`}>
        <TouchableOpacity
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="w-full rounded-lg bg-light-secondary dark:bg-dark-secondary flex-row items-center justify-between p-3"
        >
          <View className="flex-row items-center gap-2">
            <Feather
              name="bookmark"
              size={40}
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
              className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
            >
              Saved verses
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
        </TouchableOpacity>
      </Link>
      <ScrollView
        contentContainerClassName="justify-center gap-3 flex-1 items-center"
        // contentContainerStyle={{ gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter font-bold text-2xl text-light-primary dark:text-dark-primary"
        >
          {new Date(verse[0]?._updatedAt).toDateString()}
        </Text>
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="justify-center w-11/12 bg-light-secondary dark:bg-dark-secondary self-center rounded-lg p-3"
        >
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-regular leading-7 text-lg mb-2 text-light-primary dark:text-dark-primary"
          >
            {verse[0].verse}
          </Text>
          <View>
            {verse[0] !==
              "No daily verse just yet. (Make sure to enable notifications to recieve the daily verse)" && (
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="self-end font-inter-medium text-lg text-light-primary dark:text-dark-primary"
              >
                - {verse[0].chapter}
              </Text>
            )}
            <View className="items-center flex-row justify-evenly mt-5">
              <TouchableOpacity
                onPress={() => onShare(verse[0].verse, verse[0].chapter)}
                className="flex-row w-[33.33%] h-full border-r border-r-gray-500 items-center justify-center"
              >
                <Feather
                  name="share"
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
              {favorites?.some(
                (item) => item.verse.verse === verse[0].verse,
              ) ? (
                <TouchableOpacity
                  disabled
                  className="flex-row w-[33.33%] h-full items-center justify-center"
                >
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-semibold text-light-primary dark:text-dark-primary  text-lg"
                  >
                    Saved
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => HandleFavorites(verse[0])}
                  className="flex-row w-[33.33%] h-full  items-center justify-center"
                >
                  <Feather
                    name="bookmark"
                    size={30}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "white"
                          : "#2f2d51"
                    }
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default VerseOfTheDayScreen;
