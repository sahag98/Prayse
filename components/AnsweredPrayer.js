import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

import { AntDesign, Feather } from "@expo/vector-icons";

import {
  addNoteToPrayer,
  removeAnsweredPrayer,
} from "../redux/answeredReducer";
import { AnswerInput } from "../styles/appStyles";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const AnsweredPrayer = ({ actualTheme, item, index, theme }) => {
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
      })
    );
    setOpenOptions(false);
    setAnswer("");
  }

  return (
    <View key={index}>
      <View className="w-full mb-5 flex-1 gap-3 flex-row items-center justify-between">
        <Feather name="check-circle" size={25} color="#66b266" />

        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="rounded-md items-center flex-1 justify-between bg-light-secondary dark:bg-dark-secondary  min-h-14 p-3"
        >
          <View className="flex-row w-full justify-between">
            <Text
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="font-inter font-semibold text-lg flex-1 text-light-primary dark:text-dark-primary"
            >
              {item.prayer.prayer}
            </Text>
            <TouchableOpacity
              onPress={() => dispatch(removeAnsweredPrayer(item.prayer.id))}
            >
              <AntDesign
                name="close"
                size={24}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : theme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </TouchableOpacity>
          </View>
          <View className="w-full justify-between items-center mt-8">
            <TouchableOpacity className="w-full">
              {item.answerNoted && (
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter flex-1 text-light-primary dark:text-dark-primary"
                >
                  {item.answerNoted}
                </Text>
              )}
            </TouchableOpacity>
            {!item.answerNoted && (
              <AnswerInput
                onPressIn={() => InputPress(item.prayer.id)}
                style={
                  actualTheme &&
                  actualTheme.SecondaryTxt && {
                    borderColor: actualTheme.SecondaryTxt,
                  }
                }
                className="items-center self-center font-inter border border-light-primary dark:border-dark-primary"
                placeholder="How did God answer this prayer?"
                placeholderTextColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : theme === "dark"
                      ? "#c2c2c2"
                      : "grey"
                }
                selectionColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : theme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
                onChangeText={(text) => setAnswer(text)}
                value={answer}
                multiline
              />
            )}
            {openOptions && (
              <View className="flex-row items-center self-end mt-4">
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
                  style={
                    actualTheme && actualTheme.Primary
                      ? [
                          styles.actionButton,
                          {
                            backgroundColor: actualTheme.Primary,
                          },
                        ]
                      : [
                          styles.actionButton,
                          {
                            backgroundColor:
                              theme === "dark" ? "#121212" : "#2f2d51",
                          },
                        ]
                  }
                >
                  <AntDesign
                    name="check"
                    size={28}
                    color={
                      actualTheme && actualTheme.PrimaryTxt
                        ? actualTheme.PrimaryTxt
                        : "white"
                    }
                  />
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
