// @ts-nocheck
import React from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
} from "@lib/customStyles";

import FavoriteVerses from "../components/FavoriteVerses";
import { VERSE_OF_THE_DAY_SCREEN } from "../routes";
import { Container, HeaderTitle } from "../styles/appStyles";

const FavoritesScreen = () => {
  const favorites = useSelector((state) => state.favorites.favoriteVerses);

  const { colorScheme } = useColorScheme();

  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );

  const renderFavoriteVerses = ({ item }) => {
    return (
      <FavoriteVerses
        item={item.verse}
        actualTheme={actualTheme}
        theme={colorScheme}
      />
    );
  };

  return (
    <Container
      className="bg-light-background dark:bg-dark-background"
      style={getMainBackgroundColorStyle(actualTheme)}
    >
      <View className="flex-row items-center mt-3 mb-5">
        <Link asChild href={`/${VERSE_OF_THE_DAY_SCREEN}`}>
          <TouchableOpacity
            href={`/${VERSE_OF_THE_DAY_SCREEN}`}
            className="mr-2"
          >
            <Ionicons
              name="chevron-back"
              href={`/${VERSE_OF_THE_DAY_SCREEN}`}
              size={30}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
        </Link>
        <HeaderTitle
          className="font-inter-bold text-light-primary dark:text-dark-primary"
          style={getMainTextColorStyle(actualTheme)}
        >
          Saved Verses
        </HeaderTitle>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.verse._id.toString()}
        contentContainerStyle={{ gap: 5, flex: 1 }}
        scrollEventThrottle={16}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center">
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-medium text-center w-11/12 text-lg text-light-primary dark:text-dark-primary"
            >
              Your saved list is empty. Add a verse to this list by clicking the
              bookmark on the verse.
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        renderItem={renderFavoriteVerses}
      />
    </Container>
  );
};

export default FavoritesScreen;
