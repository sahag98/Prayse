import React, { useState } from "react";
import { useFonts } from "expo-font";
import LottieView from "lottie-react-native";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { TEST_SCREEN } from "../routes";
import {
  ListView,
  TodoCategory,
  TodoDate,
  TodoText,
} from "../styles/appStyles";

import CategoryTabs from "./CategoryTabs";
import SearchBar from "./SearchBar";
import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const ListItems = ({
  actualTheme,
  colorScheme,
  pickedPrayer,
  prayerList,
  onScroll,
  loading,
  folderId,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
  });

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  const prayers = prayerList.filter((item) => item.folderId === folderId);
  const [search, setSearch] = useState("");
  const size = useSelector((state) => state.user.fontSize);

  const All = "All";
  const General = "General";
  const People = "People";
  const Personal = "Personal";
  const Praise = "Praise";
  const Other = "Other";

  const selected = [All, General, People, Personal, Praise, Other];

  const [status, setStatus] = useState(selected[0]);

  const filteredList = prayers
    .filter((item) => item.category === status)
    .filter((item) => (search !== "" ? item.prayer.includes(search) : true));

  const list = prayers.filter((item) =>
    search !== "" ? item.prayer.includes(search) : true
  );

  const renderItem = ({ item }) => {
    const RowText = TodoText;
    const categoryItem = item.category;

    const addReminder = (item) => {
      navigation.navigate(TEST_SCREEN, {
        reminder: item,
        type: "Add",
      });
    };
    return (
      <>
        <ListView
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="bg-light-secondary dark:bg-dark-secondary  relative"
        >
          <>
            <View className="flex-row items-center justify-between">
              <RowText
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter font-medium text-light-primary dark:text-dark-primary"
              >
                {item.prayer}
              </RowText>
            </View>
            {search.length === 0 && (
              <TouchableOpacity
                onPress={() => pickedPrayer(item)}
                className="absolute top-2 right-1 p-2"
              >
                <Entypo
                  name="dots-three-vertical"
                  size={18}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme == "dark"
                        ? "white"
                        : "#2F2D51"
                  }
                />
              </TouchableOpacity>
            )}
            <View className="flex-row justify-between mt-8 items-center">
              <TouchableOpacity
                onPress={() => addReminder(item.prayer)}
                style={
                  actualTheme &&
                  actualTheme.SecondaryTxt && {
                    borderColor: actualTheme.SecondaryTxt,
                  }
                }
                className="flex-row items-center border dark:border-dark-primary border-light-primary p-2 rounded-md gap-2"
              >
                <AntDesign
                  name="pluscircleo"
                  size={15}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                        ? "#A5C9FF"
                        : "#2f2d51"
                  }
                />
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter font-medium text-light-primary dark:text-dark-accent"
                >
                  Reminder
                </Text>
              </TouchableOpacity>
              <View className="flex-row items-center gap-4">
                {categoryItem === "General" && (
                  <TodoCategory className="py-2 px-3 justify-center items-center rounded-md bg-[#ffdaa5]">
                    <Text
                      style={getSecondaryTextColorStyle(actualTheme)}
                      className="font-inter font-medium text-sm text-light-primary dark:text-dark-background"
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                {categoryItem === "People" && (
                  <TodoCategory
                    style={
                      actualTheme &&
                      actualTheme.SecondaryTxt && {
                        backgroundColor: actualTheme.SecondaryTxt,
                      }
                    }
                    className="py-2 px-3 justify-center items-center rounded-md bg-light-primary dark:bg-dark-accent"
                  >
                    <Text
                      style={
                        actualTheme &&
                        actualTheme.Secondary && {
                          color: actualTheme.Secondary,
                        }
                      }
                      className="font-inter font-medium text-sm text-light-primary dark:text-dark-background"
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                {categoryItem === "Praise" && (
                  <TodoCategory className="py-2 px-3 justify-center items-center rounded-md bg-[#65FFA2]">
                    <Text
                      style={getSecondaryTextColorStyle(actualTheme)}
                      className="font-inter font-medium text-sm text-light-primary dark:text-dark-background"
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                {categoryItem === "Personal" && (
                  <TodoCategory className="py-2 px-3 justify-center items-center rounded-md bg-[#FF5858]">
                    <Text
                      style={getSecondaryTextColorStyle(actualTheme)}
                      className="font-inter font-medium text-sm text-light-primary dark:text-dark-background"
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                {categoryItem === "Other" && (
                  <TodoCategory className="py-2 px-3 justify-center items-center rounded-md bg-white">
                    <Text
                      style={getSecondaryTextColorStyle(actualTheme)}
                      className="font-inter font-medium text-sm text-light-primary dark:text-dark-background"
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                {categoryItem === "None" && (
                  <TodoCategory className="py-2 px-3 justify-center items-center rounded-md bg-[#8C8C8C]">
                    <Text
                      style={getSecondaryTextColorStyle(actualTheme)}
                      className="font-inter font-medium text-sm text-light-primary dark:text-dark-background"
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                <View className="flex-row items-center">
                  <TodoDate
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="text-light-primary font-inter dark:text-dark-primary"
                  >
                    {item.date.split(",")[0]}
                  </TodoDate>
                </View>
              </View>
            </View>
          </>
        </ListView>
      </>
    );
  };

  if (!fontsLoaded) {
    return <BusyIndicator />;
  }

  return (
    <>
      {prayers.length === 0 && (
        <View className="flex-1 items-center justify-center mt-20 gap-2">
          <FontAwesome
            name="list-alt"
            size={50}
            color={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
          <TodoText
            style={getMainTextColorStyle(actualTheme)}
            className="text-center font-inter font-medium text-light-primary dark:text-dark-primary"
          >
            No prayers added yet!
          </TodoText>
        </View>
      )}
      <CategoryTabs
        actualTheme={actualTheme}
        theme={colorScheme}
        prayerList={prayers}
        selected={selected}
        status={status}
        setStatus={setStatus}
      />
      {prayers.length !== 0 && (
        <>
          <SearchBar
            actualTheme={actualTheme}
            theme={colorScheme}
            search={search}
            setSearch={setSearch}
          />
          {loading == true && (
            <View className="flex-1 justify-center items-center self-center z-50">
              <LottieView
                source={require("../assets/4964-check-mark-success-animation.json")}
                style={styles.animation}
                autoPlay
                resizeMode="none"
              />
            </View>
          )}
          {loading === false && (
            <FlatList
              data={status === "All" ? list : filteredList}
              keyExtractor={(e, i) => i.toString()}
              onEndReachedThreshold={0}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              onScroll={onScroll}
              renderItem={renderItem}
              ListFooterComponent={() => <View className="h-20" />}
            />
          )}
        </>
      )}
    </>
  );
};

export default ListItems;

const styles = StyleSheet.create({
  editContainerDark: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#3b3b3b",
    zIndex: 99,
    width: "60%",
    height: 110,
    borderRadius: 5,
  },
  editContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#2f2d51",
    zIndex: 99,
    width: "60%",
    height: 110,
    borderRadius: 5,
  },
  animation: {
    width: 100,
    height: 100,
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  TodoCategory: {
    backgroundColor: "#121212",
    marginTop: 10,
    borderRadius: 50,
    padding: 5,
    fontSize: 9,
    color: "white",
    textAlign: "left",
  },
  elevationDark: {
    shadowColor: "#040404",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  elevation: {
    shadowColor: "#13588c",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  press: {
    fontFamily: "Inter-Medium",
    textAlign: "center",
    color: "#2F2D51",
  },
  pressDark: {
    fontFamily: "Inter-Medium",
    textAlign: "center",
    color: "white",
  },
});
