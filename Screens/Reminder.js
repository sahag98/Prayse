import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";
import { useDispatch, useSelector } from "react-redux";
import * as Notifications from "expo-notifications";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { deleteReminder } from "../redux/remindersReducer";

const Reminder = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const reminders = useSelector((state) => state.reminder.reminders);
  const dispatch = useDispatch();

  const dismissNotification = async (item) => {
    dispatch(deleteReminder(item.reminder.id));
    await Notifications.cancelScheduledNotificationAsync(item.identifier);
  };

  return (
    <Container
      style={
        theme == "dark"
          ? {
              flex: 1,
              backgroundColor: "#121212",
            }
          : {
              flex: 1,
              backgroundColor: "#f2f7ff",
            }
      }
    >
      <HeaderView
        style={{
          justifyContent: "space-between",
          marginBottom: 20,
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", gap: 5 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign
              name="left"
              size={24}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
          <HeaderTitle
            style={
              theme == "dark"
                ? { color: "white", fontFamily: "Inter-Bold" }
                : { color: "#2f2d51", fontFamily: "Inter-Bold" }
            }
          >
            Reminders
          </HeaderTitle>
        </View>
      </HeaderView>
      {reminders.length == 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={
              theme == "dark"
                ? {
                    color: "#d2d2d2",
                    alignSelf: "center",
                    fontSize: 15,
                    fontFamily: "Inter-Medium",
                  }
                : {
                    color: "#2f2d51",
                    alignSelf: "center",
                    fontSize: 15,
                    fontFamily: "Inter-Medium",
                  }
            }
          >
            No reminders yet!
          </Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(e, i) => i.toString()}
          renderItem={({ item }) => {
            const daysOfWeek = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];

            const timestamp = new Date(item.reminder.time);
            let timeOptions;

            let dayOfWeekName;

            if (item.ocurrence === "Daily") {
              const options = {
                hour: "numeric",
                minute: "numeric",
              };
              timeOptions = options;
            } else if (item.ocurrence === "Weekly") {
              const dayOfWeekNumber = timestamp.getDay();
              dayOfWeekName = daysOfWeek[dayOfWeekNumber];

              const options = {
                hour: "numeric",
                minute: "numeric",
              };
              timeOptions = options;
            } else if (item.ocurrence === "None") {
              let options = {
                month: "numeric",
                day: "numeric",
                year: "2-digit",
                hour: "numeric",
                minute: "numeric",
              };
              timeOptions = options;
            }
            const formattedDate = timestamp.toLocaleString(
              "en-US",
              timeOptions
            );

            return (
              <View
                style={
                  theme == "dark"
                    ? {
                        padding: 10,
                        marginRight: 15,
                        gap: 5,
                        borderRadius: 10,
                        marginBottom: 15,
                        width: "100%",
                        // justifyContent: "space-between",
                        borderColor: "#525252",
                        borderWidth: 1,
                      }
                    : {
                        marginRight: 15,
                        gap: 5,
                        justifyContent: "space-between",
                        padding: 10,
                        borderRadius: 10,
                        marginBottom: 15,
                        borderWidth: 1,
                        borderColor: "#ffcd8b",
                        backgroundColor: "white",
                        width: "100%",
                      }
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={24}
                    color={theme == "dark" ? "#f1d592" : "#dda41c"}
                  />
                  {item.ocurrence === "Daily" && (
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              fontSize: 14,
                              fontFamily: "Inter-Medium",
                              color: "#f1d592",
                            }
                          : {
                              fontSize: 14,
                              fontFamily: "Inter-Medium",
                              color: "#dda41c",
                            }
                      }
                    >
                      {item.ocurrence} at {formattedDate}
                    </Text>
                  )}
                  {item.ocurrence === "Weekly" && (
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              fontSize: 13,
                              fontFamily: "Inter-Medium",
                              color: "#f1d592",
                            }
                          : {
                              fontSize: 13,
                              fontFamily: "Inter-Medium",
                              color: "#dda41c",
                            }
                      }
                    >
                      {item.ocurrence} on {dayOfWeekName}s at {formattedDate}
                    </Text>
                  )}
                  {item.ocurrence === "None" && (
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              fontSize: 13,
                              fontFamily: "Inter-Regular",
                              color: "#f1d592",
                            }
                          : {
                              fontSize: 13,
                              fontFamily: "Inter-Regular",
                              color: "grey",
                            }
                      }
                    >
                      {formattedDate}
                    </Text>
                  )}

                  {/* <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Inter-Regular",
                          color: "grey",
                        }}
                      >
                       
                      </Text> */}
                </View>
                <View style={{ gap: 3 }}>
                  <Text
                    style={
                      theme == "dark"
                        ? {
                            fontFamily: "Inter-Regular",
                            fontSize: 16,
                            color: "white",
                            marginBottom: item.reminder.note ? 0 : 5,
                          }
                        : {
                            fontFamily: "Inter-Regular",
                            fontSize: 16,
                            color: "#2f2d51",
                            marginBottom: item.reminder.note ? 0 : 5,
                          }
                    }
                  >
                    {item.reminder.message}
                  </Text>
                  {item.reminder.note && (
                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        fontSize: 13,
                        color: "grey",
                        marginBottom: 5,
                      }}
                    >
                      {item.reminder.note}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignSelf: "flex-end",
                    alignItems: "center",
                    marginTop: "auto",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Test", {
                        type: "Edit",
                        reminderEditId: item.reminder.id,
                        reminderIdentifier: item.identifier,
                        ocurrence: item.ocurrence,
                        reminderToEditTitle: item.reminder.message,
                        reminderToEditNote: item.reminder.note,
                        reminderToEditTime: item.reminder.time.toString(),
                      })
                    }
                  >
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              fontFamily: "Inter-Medium",
                              fontSize: 15,
                              color: "white",
                            }
                          : {
                              fontFamily: "Inter-Medium",
                              fontSize: 15,
                              color: "#2f2d51",
                            }
                      }
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={
                      theme == "dark"
                        ? {
                            width: 1.2,
                            height: "100%",
                            backgroundColor: "white",
                          }
                        : {
                            width: 1.2,
                            height: "100%",
                            backgroundColor: "#2f2d51",
                          }
                    }
                  />
                  <TouchableOpacity onPress={() => dismissNotification(item)}>
                    <Text
                      style={{
                        fontFamily: "Inter-Medium",
                        fontSize: 15,
                        color: "#ff3b3b",
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <ReminderModal
                reminderVisible={reminderVisible}
                setReminderVisible={setReminderVisible}
                theme={theme}
                reminder={item.reminder}
              /> */}
              </View>
            );
          }}
        />
      )}
    </Container>
  );
};

export default Reminder;

const styles = StyleSheet.create({});
