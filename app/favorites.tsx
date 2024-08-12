// @ts-nocheck
import React from "react";
import { Link } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";

import FavoriteVerses from "../components/FavoriteVerses";
import { VERSE_OF_THE_DAY_SCREEN } from "../routes";
import { Container, HeaderTitle } from "../styles/appStyles";

const FavoritesScreen = () => {
  const theme = useSelector((state) => state.user.theme);
  const favorites = useSelector((state) => state.favorites.favoriteVerses);

  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );

  const renderFavoriteVerses = ({ item }) => {
    return <FavoriteVerses item={item.verse} theme={theme} />;
  };
  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <View
        style={{
          marginVertical: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Link to={`/${VERSE_OF_THE_DAY_SCREEN}`}>
          <View style={{ marginRight: 5 }}>
            <Ionicons
              name="chevron-back"
              size={30}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </View>
        </Link>
        <HeaderTitle
          style={
            theme == "dark"
              ? { fontFamily: "Inter-Bold", color: "white" }
              : { fontFamily: "Inter-Bold", color: "#2F2D51" }
          }
        >
          Favorite Verses
        </HeaderTitle>
      </View>
      {favorites.length == 0 && (
        <View
          style={{
            justifyContent: "center",

            alignItems: "center",
            flex: 1,
          }}
        >
          <Text
            style={
              theme == "dark"
                ? { color: "#A5C9FF", fontSize: 16, fontFamily: "Inter-Medium" }
                : { color: "#2f2d51", fontSize: 16, fontFamily: "Inter-Medium" }
            }
          >
            Nothing on the list just yet!
          </Text>
        </View>
      )}
      <FlatList
        data={favorites}
        keyExtractor={(e, i) => i.toString()}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        renderItem={renderFavoriteVerses}
      />
    </Container>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({});
