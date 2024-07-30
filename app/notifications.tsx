// @ts-nocheck
import React from "react";
import { Link, useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { getMainTextColorStyle } from "@lib/customStyles";
import { ActualTheme } from "@types/reduxTypes";

import NotiItem from "../components/NotiItem";
import { deleteAll } from "../redux/notiReducer";
import { Container } from "../styles/appStyles";

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const notis = useSelector((state: any) => state.noti.notifications);

  const { colorScheme } = useColorScheme();
  const theme = useSelector((state: any) => state.user.theme);
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );

  // const notiArray = [
  //   {
  //     noti_id: 0,
  //     date: "today",
  //     notification: "testing notification layout 0",
  //     screen: "Home",
  //     prayerId: 0,
  //     identifier: 123,
  //   },
  // ];

  return (
    <Container
      style={
        actualTheme && actualTheme.Bg
          ? { backgroundColor: actualTheme.Bg }
          : colorScheme == "dark"
            ? {
                backgroundColor: "#121212",
              }
            : {
                backgroundColor: "#f2f7ff",
              }
      }
    >
      <View className="flex-row justify-between w-full items-center">
        <View className="flex-row items-center">
          <Link className="mr-1" href="/">
            <Ionicons
              name="chevron-back"
              size={35}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme == "light"
                    ? "#2f2d51"
                    : "white"
              }
            />
          </Link>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-bold text-2xl text-light-primary dark:text-dark-primary"
          >
            Notifications
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            dispatch(deleteAll());
            // navigation.navigate(HOME_SCREEN);
          }}
          className="p-3 self-end"
        >
          <Text className="font-inter font-semibold text-lg text-red-500">
            Clear All
          </Text>
        </TouchableOpacity>
      </View>
      {notis.length == 0 ? (
        <View className="flex-1 justify-center items-center gap-3">
          <AntDesign
            name="notification"
            size={50}
            color={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme == "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-medium text-light-primary dark:text-dark-primary"
          >
            No notifications at the moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notis}
          keyExtractor={(item) => item.noti_id}
          onEndReachedThreshold={0}
          initialNumToRender={8}
          windowSize={8}
          contentContainerStyle={{ paddingTop: 10 }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NotiItem
              actualTheme={actualTheme}
              theme={theme}
              navigation={navigation}
              item={item}
            />
          )}
        />
      )}
    </Container>
  );
};

export default NotificationsScreen;

// const styles = StyleSheet.create({});
