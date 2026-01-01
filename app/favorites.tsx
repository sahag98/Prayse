import React from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import { getMainTextColorStyle } from "@lib/customStyles";

import FavoriteVerses from "../components/FavoriteVerse";
import { VERSE_OF_THE_DAY_SCREEN } from "../routes";
import { Container } from "@components/Container";
import HeaderText from "@components/HeaderText";
import { ActualTheme } from "../types/reduxTypes";

interface FavoriteVerseItem {
  verse: {
    _id: string;
    verse: string;
    chapter: string;
  };
}

interface RootState {
  favorites: {
    favoriteVerses: FavoriteVerseItem[];
  };
  theme: {
    actualTheme: ActualTheme;
  };
}

const FavoritesScreen = () => {
  const favorites = useSelector(
    (state: RootState) => state.favorites.favoriteVerses
  );

  const { colorScheme } = useColorScheme();

  const actualTheme = useSelector(
    (state: RootState) => state.theme.actualTheme
  );

  const renderFavoriteVerses = ({ item }: { item: FavoriteVerseItem }) => {
    return (
      <FavoriteVerses
        item={item.verse}
        actualTheme={actualTheme}
        theme={colorScheme}
      />
    );
  };

  return (
    <Container>
      <View className="flex-row items-center mt-3 mb-5">
        <Link asChild href={`/${VERSE_OF_THE_DAY_SCREEN}`}>
          <TouchableOpacity className="mr-2">
            <Ionicons
              name="chevron-back"
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
        <HeaderText text="Saved Verses" />
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
