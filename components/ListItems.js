import React, { useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  ListView,
  TodoText,
  TodoDate,
  TodoCategory,
} from "../styles/appStyles";
import { useFonts } from "expo-font";
import { Entypo } from "@expo/vector-icons";
import { Motion } from "@legendapp/motion";
import CategoryTabs from "./CategoryTabs";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";

const ListItems = ({
  pickedPrayer,
  prayerList,
  onScroll,
  loading,
  folderId,
}) => {
  const theme = useSelector((state) => state.user.theme);

  let [fontsLoaded] = useFonts({
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

  let value = 0;

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

  const renderItem = ({ item, index }) => {
    const RowText = TodoText;
    const categoryItem = item.category;
    return (
      <>
        <Motion.View
          onPointerEnter={() => console.log("pointer")}
          initial={{ y: -50 }}
          animate={{ x: value * 100, y: 0 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ y: 20 }}
          transition={{ type: "spring" }}
        >
          <ListView
            style={
              theme == "dark"
                ? [{ backgroundColor: "#212121", position: "relative" }]
                : [{ backgroundColor: "#93D8F8" }]
            }
          >
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <RowText
                  style={
                    theme == "dark"
                      ? {
                          paddingRight: 5,
                          fontFamily: "Inter-Regular",
                          color: "white",
                          fontSize: size,
                        }
                      : {
                          fontFamily: "Inter-Regular",
                          color: "#2F2D51",
                          fontSize: size,
                        }
                  }
                >
                  {item.prayer}
                </RowText>
              </View>
              {search.length == 0 && (
                <TouchableOpacity
                  onPress={() => pickedPrayer(item)}
                  style={{ position: "absolute", top: 9, right: 3, padding: 5 }}
                >
                  <Entypo
                    name="dots-three-vertical"
                    size={20}
                    color={theme == "dark" ? "white" : "#2F2D51"}
                  />
                </TouchableOpacity>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {categoryItem == "General" && (
                  <TodoCategory
                    style={
                      theme == "dark"
                        ? { borderRadius: 20, backgroundColor: "#FFDAA5" }
                        : { borderRadius: 20, backgroundColor: "#FFBF65" }
                    }
                  >
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "black",
                            }
                          : {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "black",
                            }
                      }
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                {categoryItem == "People" && (
                  <TodoCategory
                    style={
                      theme == "dark"
                        ? {
                            backgroundColor: "#A5C9FF",
                            fontFamily: "Inter-SemiBold",
                            color: "black",
                          }
                        : {
                            backgroundColor: "#6B7EFF",
                            fontFamily: "Inter-Regular",
                            color: "white",
                          }
                    }
                  >
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "black",
                            }
                          : {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "white",
                            }
                      }
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                {categoryItem == "Praise" && (
                  <TodoCategory
                    style={
                      theme == "dark"
                        ? {
                            backgroundColor: "#A5FFC9",
                            fontFamily: "Inter-SemiBold",
                            color: "black",
                          }
                        : {
                            backgroundColor: "#65FFA2",
                            fontFamily: "Inter-Regular",
                            color: "white",
                          }
                    }
                  >
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "black",
                            }
                          : {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "#2F2D51",
                            }
                      }
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                {categoryItem == "Personal" && (
                  <TodoCategory
                    style={
                      theme == "dark"
                        ? {
                            backgroundColor: "#FFB2B2",
                            fontFamily: "Inter-SemiBold",
                            color: "black",
                          }
                        : {
                            backgroundColor: "#FF5858",
                            fontFamily: "Inter-Regular",
                            color: "white",
                          }
                    }
                  >
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "black",
                            }
                          : {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "white",
                            }
                      }
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                {categoryItem == "Other" && (
                  <TodoCategory
                    style={
                      theme == "dark"
                        ? {
                            backgroundColor: "white",
                            fontFamily: "Inter-SemiBold",
                            color: "black",
                          }
                        : {
                            backgroundColor: "white",
                            fontFamily: "Inter-Regular",
                            color: "white",
                          }
                    }
                  >
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "black",
                            }
                          : {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "black",
                            }
                      }
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                {categoryItem == "None" && (
                  <TodoCategory
                    style={
                      theme == "dark"
                        ? {
                            borderRadius: 20,
                            backgroundColor: "#8C8C8C",
                            fontFamily: "Inter-SemiBold",
                            color: "black",
                          }
                        : {
                            backgroundColor: "#2F2D51",
                            fontFamily: "Inter-Regular",
                            color: "white",
                          }
                    }
                  >
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "black",
                            }
                          : {
                              fontSize: 11,
                              fontFamily: "Inter-SemiBold",
                              color: "white",
                            }
                      }
                    >
                      {item.category}
                    </Text>
                  </TodoCategory>
                )}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TodoDate
                    style={
                      theme == "dark"
                        ? { color: "#8C8C8C", fontFamily: "Inter-Regular" }
                        : { color: "#4e4a8a", fontFamily: "Inter-Regular" }
                    }
                  >
                    {item.date}
                  </TodoDate>
                </View>
              </View>
            </>
          </ListView>
        </Motion.View>
      </>
    );
  };

  if (!fontsLoaded) {
    return <BusyIndicator />;
  }

  return (
    <>
      {prayers.length == 0 && (
        <TodoText style={theme == "dark" ? styles.pressDark : styles.press}>
          Add a prayer to start off your prayer list!
        </TodoText>
      )}
      <CategoryTabs
        theme={theme}
        prayerList={prayers}
        selected={selected}
        status={status}
        setStatus={setStatus}
      />
      {prayers.length != 0 && (
        <>
          <SearchBar theme={theme} search={search} setSearch={setSearch} />
          {loading == true && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                zIndex: 99,
                alignSelf: "center",
                alignItems: "center",
              }}
            >
              <LottieView
                source={require("../assets/4964-check-mark-success-animation.json")}
                style={styles.animation}
                autoPlay
                resizeMode="none"
              />
            </View>
          )}
          {loading == false && (
            <FlatList
              data={status == "All" ? list : filteredList}
              keyExtractor={(e, i) => i.toString()}
              onEndReachedThreshold={0}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              onScroll={onScroll}
              renderItem={renderItem}
              ListFooterComponent={() => (
                <View
                  style={
                    theme == "dark"
                      ? {
                          height: 80,
                        }
                      : {
                          height: 80,
                        }
                  }
                />
              )}
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
    fontFamily: "Inter-Regular",
    color: "#2F2D51",
  },
  pressDark: {
    fontFamily: "Inter-Regular",
    color: "white",
  },
});
