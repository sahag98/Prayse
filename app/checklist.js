import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Ionicons,
} from "@expo/vector-icons";
import { Link } from "@react-navigation/native";

import { addToAnsweredPrayer } from "../redux/answeredReducer";
import { deletePrayer } from "../redux/prayerReducer";
import { PRAYER_SCREEN } from "../routes";
import { Container } from "../styles/appStyles";

const ChecklistScreen = () => {
  const theme = useSelector((state) => state.user.theme);
  const prayers = useSelector((state) => state.prayer.prayer);
  const [selectKeepAction, setSelectKeepAction] = useState("");
  const [selectAnswerAction, setSelectAnswerAction] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [answeredAlready, setAnsweredAlready] = useState("");
  const dispatch = useDispatch();
  const answeredPrayers = useSelector(
    (state) => state.answered.answeredPrayers,
  );

  const handleAddToAnsweredPrayer = (prayer) => {
    if (
      answeredPrayers?.some(
        (item) =>
          item.prayer.id === prayer.id && item.prayer.prayer === prayer.prayer,
      )
    ) {
      console.log("exists");
      setAnsweredAlready(prayer.id);
    } else {
      dispatch(
        addToAnsweredPrayer({
          answeredDate: new Date().toDateString(),
          prayer,
          id: uuid.v4(),
        }),
      );
      setAnsweredAlready("");
    }
  };

  const handleKeepPrayer = (prayer) => {
    setSelectKeepAction("keep");
  };

  const handleDelete = (prayer) => {
    dispatch(deletePrayer(prayer));
  };

  if (prayers.length == 0) {
    return (
      <Container
        style={
          theme == "dark"
            ? {
                backgroundColor: "#121212",

                // justifyContent: "center",
                // alignItems: "center",
              }
            : {
                backgroundColor: "#F2F7FF",

                // justifyContent: "center",
                // alignItems: "center",
              }
        }
      >
        <View
          style={{
            flexDirection: "row",

            width: "100%",
            alignItems: "center",
          }}
        >
          <Link to={`/${PRAYER_SCREEN}`}>
            <View style={{ marginRight: 10 }}>
              <Ionicons
                name="chevron-back"
                size={35}
                color={theme == "light" ? "#2f2d51" : "white"}
              />
            </View>
          </Link>
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 20,
              color: theme == "dark" ? "white" : "#2f2d51",
            }}
          >
            Prayer Checklist
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
          }}
        >
          <FontAwesome5
            name="list-alt"
            size={50}
            color={theme == "dark" ? "white" : "#2f2d51"}
          />
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Medium",
            }}
          >
            No prayers added yet!
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container
      style={
        theme == "dark"
          ? {
              backgroundColor: "#121212",

              // justifyContent: "center",
              // alignItems: "center",
            }
          : {
              backgroundColor: "#F2F7FF",

              // justifyContent: "center",
              // alignItems: "center",
            }
      }
    >
      <View
        style={{
          flexDirection: "row",

          width: "100%",
          alignItems: "center",
        }}
      >
        <Link to={`/${PRAYER_SCREEN}`}>
          <View style={{ marginRight: 10 }}>
            <Ionicons
              name="chevron-back"
              size={35}
              color={theme == "light" ? "#2f2d51" : "white"}
            />
          </View>
        </Link>
        <Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: 20,
            color: theme == "dark" ? "white" : "#2f2d51",
          }}
        >
          Prayer Checklist
        </Text>
      </View>

      <FlatList
        data={prayers}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0}
        initialNumToRender={8}
        windowSize={8}
        contentContainerStyle={{ paddingTop: 10 }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
              padding: 10,
              borderRadius: 10,
              gap: 10,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                marginBottom: 10,
                color: theme == "dark" ? "white" : "#2f2d51",
                fontSize: 15,
                fontFamily: "Inter-Medium",
              }}
            >
              {item.prayer}
            </Text>
            {selectedItems.includes(item.id) ||
            (selectAnswerAction == item.id &&
              selectedItems.includes(item.id)) ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text
                  style={{
                    color: theme == "dark" ? "grey" : "#2f2d51",
                    alignSelf: "center",
                    paddingVertical: 5,
                    fontFamily: "Inter-Medium",
                  }}
                >
                  {selectKeepAction == item.id && "Will Keep"}
                  {selectAnswerAction == item.id && "Marked as answered"}
                </Text>
                <FontAwesome5
                  name="check"
                  size={20}
                  color={theme == "dark" ? "grey" : "#2f2d51"}
                />
              </View>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flex: 1,
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItems((prev) => [...prev, item.id]);
                      setSelectKeepAction(item.id);
                    }}
                    style={{
                      backgroundColor: theme == "dark" ? "#121212" : "#2f2d51",
                      padding: 10,
                      flex: 1,
                      borderRadius: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter-Bold",
                        color: theme == "dark" ? "white" : "white",
                      }}
                    >
                      Keep
                    </Text>
                    <AntDesign name="back" size={24} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={{
                      backgroundColor: theme == "dark" ? "#121212" : "#2f2d51",
                      padding: 10,
                      flex: 1,
                      borderRadius: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter-Bold",
                        color: theme == "dark" ? "#ff3333" : "#ff3333",
                      }}
                    >
                      Delete
                    </Text>
                    <Fontisto name="close" size={24} color="#ff3333" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItems((prev) => [...prev, item.id]);
                    setSelectAnswerAction(item.id);
                    handleAddToAnsweredPrayer(item);
                  }}
                  style={{
                    backgroundColor: theme == "dark" ? "#121212" : "#2f2d51",
                    padding: 10,
                    flex: 1,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      color: theme == "dark" ? "#00cd00" : "#00cd00",
                    }}
                  >
                    Answered
                  </Text>
                  <FontAwesome
                    name="check-circle-o"
                    size={24}
                    color="#00cd00"
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </Container>
  );
};

export default ChecklistScreen;

const styles = StyleSheet.create({});
