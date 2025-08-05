import React, { useCallback, useState } from "react";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useSharedValue,
} from "react-native-reanimated";

import {
  AntDesign,
  MaterialIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { client } from "../lib/client";
import { addToFavorites } from "../redux/favoritesReducer";
import { MORE_SCREEN } from "../routes";

import { ActualTheme } from "../types/reduxTypes";
import { Container } from "@components/Container";
import HeaderText from "@components/HeaderText";

const VerseOfTheDayScreen = () => {
  const favorites = useSelector((state: any) => state.favorites.favoriteVerses);
  const dispatch = useDispatch();
  const [verse, setVerse] = useState<any>([]);

  const routeParams = useLocalSearchParams();

  const router = useRouter();
  const navigation = useNavigation();

  const scaleValue = useSharedValue(1);

  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      loadDailyVerse();

      scaleValue.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 30000, easing: Easing.linear }),
          withTiming(1, { duration: 30000, easing: Easing.linear }),
        ),
        -1,
        true,
      );
      // Return function is invoked whenever the route gets out of focus.
    }, []),
  );

  const loadDailyVerse = () => {
    const query = `*[_type=="verse"]{
      _id,
      _updatedAt,
      _createdAt,
     "image": image.asset->url,
     chapter,
     verse
    }`;
    client
      .fetch(query)
      .then((data) => {
        setVerse(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onShare = async (verse: string, chapter: string) => {
    if (verse && chapter) {
      const shareVerse = verse + " - " + chapter;

      try {
        await Share.share({
          message: shareVerse,
        });
      } catch (error: any) {
        Alert.alert(error.message);
      }
    }
  };

  const HandleFavorites = (verse: any) => {
    dispatch(
      addToFavorites({
        verse,
      }),
    );
  };

  if (verse.length === 0) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            color={colorScheme === "dark" ? "white" : "#2f2d51"}
          />
        </View>
      </Container>
    );
  }

  return (
    <View className="flex-1 px-4 bg-light-background dark:bg-dark-background">
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View className="mb-10 pt-4 flex-row items-center">
          <TouchableOpacity
            className="mr-2"
            onPress={() => {
              if (routeParams?.previousScreen) {
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
          <HeaderText text=" Verse of the Day" />
        </View>
        <Link
          href="/favorites"
          asChild
          className="bg-light-secondary justify-between flex-row items-center p-5 rounded-lg"
        >
          <Pressable>
            <View className="flex-row items-center gap-2">
              <Feather name="bookmark" size={28} color="black" />
              <Text className="font-inter-medium text-lg">Saved Verses</Text>
            </View>
            <AntDesign
              name="right"
              size={24}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
          </Pressable>
        </Link>
        <View className="flex-col flex-1 h-full justify-center gap-5">
          <Text className="font-inter-bold text-xl text-light-primary dark:text-dark-primary">
            {new Date(verse[0]?._updatedAt).toDateString()}
          </Text>
          <View className="gap-2">
            <Text className="font-inter-medium text-2xl text-light-primary dark:text-dark-primary">
              {verse[0].verse}
            </Text>
            <Text className="font-inter-medium text-2xl text-light-primary dark:text-dark-primary">
              - {verse[0].chapter}
            </Text>
          </View>

          <View className="flex-row  w-full justify-evenly mt-5 items-center">
            {favorites.some(
              (favorite: any) => favorite.verse.verse === verse[0].verse,
            ) ? (
              <Text className="font-inter-semibold text-xl dark:text-white text-light-primary ">
                Saved
              </Text>
            ) : (
              <Pressable onPress={() => HandleFavorites(verse[0])}>
                <MaterialIcons
                  name="bookmark-border"
                  size={30}
                  color={colorScheme === "dark" ? "white" : "#2f2d51"}
                />
              </Pressable>
            )}

            <Pressable
              onPress={() => onShare(verse[0].verse, verse[0].chapter)}
            >
              <Feather
                name="share"
                size={30}
                color={colorScheme === "dark" ? "white" : "#2f2d51"}
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default VerseOfTheDayScreen;
