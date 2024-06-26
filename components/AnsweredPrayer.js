import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

import { AntDesign, Feather } from "@expo/vector-icons";

import {
  addNoteToPrayer,
  removeAnsweredPrayer,
} from "../redux/answeredReducer";
import { AnswerInput } from "../styles/appStyles";

const AnsweredPrayer = ({ item, index, theme }) => {
  const dispatch = useDispatch();
  const [answer, setAnswer] = useState("");
  const [openOptions, setOpenOptions] = useState(false);
  const [selected, setSelected] = useState(null);
  function InputPress(id) {
    setSelected(id);
    setOpenOptions(true);
  }

  function HandleAddAnswer(prayerId) {
    dispatch(
      addNoteToPrayer({
        id: prayerId,
        answerNote: answer,
      }),
    );
    setOpenOptions(false);
    setAnswer("");
  }

  return (
    <View key={index}>
      <View style={styles.answeredPrayerWrapper}>
        <Feather name="check-circle" size={22} color="#66b266" />
        <View
          style={
            theme === "dark" ? styles.answeredPrayerDark : styles.answeredPrayer
          }
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: theme === "dark" ? "white" : "#2f2d51",
                fontSize: 16,
                fontFamily: "Inter-Bold",
                width: "90%",
              }}
            >
              {item.prayer.prayer}
            </Text>
            <TouchableOpacity
              onPress={() => dispatch(removeAnsweredPrayer(item.prayer.id))}
            >
              <AntDesign
                name="close"
                size={22}
                color={theme === "dark" ? "white" : "#2f2d51"}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <TouchableOpacity style={{ width: "100%" }}>
              {item.answerNoted && (
                <Text
                  style={{
                    color: theme === "dark" ? "#66b266" : "#00ab00",
                    fontSize: 15,
                    fontFamily: "Inter-Regular",
                    width: "90%",
                  }}
                >
                  {item.answerNoted}
                </Text>
              )}
            </TouchableOpacity>
            {!item.answerNoted && (
              <AnswerInput
                onPressIn={() => InputPress(item.prayer.id)}
                style={theme === "dark" ? styles.inputDark : styles.input}
                placeholder="How did God answer this prayer?"
                placeholderTextColor={theme === "dark" ? "#c2c2c2" : "grey"}
                selectionColor={theme === "dark" ? "white" : "#2f2d51"}
                onChangeText={(text) => setAnswer(text)}
                value={answer}
                multiline
              />
            )}
            {openOptions && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "flex-end",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setOpenOptions(false), setSelected("");
                  }}
                  style={[styles.actionButton, { backgroundColor: "white" }]}
                >
                  <AntDesign
                    name="close"
                    size={28}
                    color={theme === "dark" ? "#121212" : "#2f2d51"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => HandleAddAnswer(item.id)}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: theme === "dark" ? "#121212" : "#2f2d51",
                    },
                  ]}
                >
                  <AntDesign name="check" size={28} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View />
      </View>
    </View>
  );
};

export default AnsweredPrayer;

const styles = StyleSheet.create({
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  answeredPrayerWrapper: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  answeredPrayerDark: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#212121",
    width: "90%",
    minHeight: 50,
    padding: 10,
  },
  answeredPrayer: {
    borderRadius: 5,
    backgroundColor: "#b7d3ff",
    width: "90%",
    minHeight: 50,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  inputDark: {
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    backgroundColor: "#171717",
  },
  input: {
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontSize: 14,
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    backgroundColor: "white",
  },
});
