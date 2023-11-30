import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  Keyboard,
  Animated,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { addNewReminder, deleteReminder } from "../redux/remindersReducer";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import { Easing } from "react-native";
// import * as Permissions from "expo-permissions";

export default function Reminder({ navigation }) {
  const theme = useSelector((state) => state.user.theme);
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const remindersRedux = useSelector((state) => state.reminder.reminders);
  const dispatch = useDispatch();
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const togglePickerVisibility = () => {
    const toValue = slideAnimation._value === 0 ? 1 : 0;

    Animated.timing(slideAnimation, {
      toValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (toValue === 0) {
        // Add a delay before resetting opacity to 0 when closing
        setTimeout(() => {
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }).start();
        }, 300);
      }
    });
  };

  // useEffect(() => {
  //   registerForPushNotifications();
  // }, []);

  // const registerForPushNotifications = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //   if (status !== "granted") {
  //     console.error("Permission to receive notifications denied");
  //     return;
  //   }

  //   const pushToken = await Notifications.getExpoPushTokenAsync();
  //   console.log("Expo Push Token:", pushToken);
  // };

  const scheduleNotification = async (reminder) => {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: reminder.message,
      },
      trigger: {
        date: reminder.time,
      },
    });
    dispatch(
      addNewReminder({
        reminder: reminder,
        identifier: identifier,
      })
    );
  };

  console.log("reminders :", remindersRedux);
  const dismissNotification = async (item) => {
    console.log("dismiss :", item.identifier);
    dispatch(deleteReminder(item.id));
    await Notifications.cancelScheduledNotificationAsync(item.identifier);
  };

  const addReminder = () => {
    const combinedDate = new Date(
      reminderDate.getFullYear(),
      reminderDate.getMonth(),
      reminderDate.getDate(),
      reminderTime.getHours(),
      reminderTime.getMinutes()
    );

    console.log("combined date :", combinedDate);

    if (newReminder.length == 0) {
      return;
    }

    const newReminderObj = {
      id: uuid.v4(),
      message: newReminder,
      note: newNote,
      time: combinedDate,
    };

    scheduleNotification(newReminderObj);

    setReminders([...reminders, newReminderObj]);

    setNewReminder("");
    setNewNote("");
    setReminderDate("");
    setReminderTime("");
    Keyboard.dismiss();
  };

  const clearAll = () => {
    setNewReminder("");
    setDatePickerVisibility(false);
    setTimePickerVisibility(false);
    setReminderDate("");
    setReminderTime("");
    navigation.navigate("Home");
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
    togglePickerVisibility();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    togglePickerVisibility();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
    togglePickerVisibility();
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
    togglePickerVisibility();
  };

  const handleDateConfirm = (date) => {
    hideDatePicker();
    setReminderDate(date);
  };

  const handleTimeConfirm = (time) => {
    hideTimePicker();
    setReminderTime(time);
  };

  return (
    <Container
      style={
        theme == "dark"
          ? {
              flex: 1,
              backgroundColor: "#121212",
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
            }
          : {
              flex: 1,
              backgroundColor: "#f2f7ff",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              padding: 16,
            }
      }
    >
      <HeaderView style={{ justifyContent: "space-between", width: "100%" }}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <TouchableOpacity onPress={clearAll}>
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
            Create Reminder
          </HeaderTitle>
        </View>
        <TouchableOpacity
          onPress={addReminder}
          disabled={newReminder.length == 0 ? true : false}
          style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
        >
          <Text
            style={
              newReminder.length == 0
                ? { fontSize: 18, fontFamily: "Inter-Bold", color: "grey" }
                : { fontSize: 18, fontFamily: "Inter-Bold", color: "#2f2d51" }
            }
          >
            Add
          </Text>
          <Entypo
            name="plus"
            size={30}
            color={newReminder.length == 0 ? "grey" : "#2f2d51"}
          />
        </TouchableOpacity>
      </HeaderView>
      <View
        style={{
          flex: 1,
          marginTop: 10,
          width: "100%",
          position: "relative",
          gap: 10,
        }}
      >
        <View
          style={
            theme == "dark"
              ? {
                  backgroundColor: "#212121",
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  gap: 10,
                }
              : {
                  backgroundColor: "#93d8f8",
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  gap: 10,
                }
          }
        >
          <TextInput
            style={
              theme == "dark"
                ? { minHeight: 30, color: "white" }
                : { minHeight: 30, color: "#2f2d51" }
            }
            placeholderTextColor={theme == "dark" ? "white" : "#2f2d51"}
            placeholder="Title"
            textAlignVertical="top"
            value={newReminder}
            onChangeText={(text) => setNewReminder(text)}
          />
          <View
            style={
              theme == "dark"
                ? { width: "100%", backgroundColor: "grey", height: 0.5 }
                : { width: "100%", backgroundColor: "#2f2d51", height: 0.5 }
            }
          />
          <TextInput
            placeholderTextColor={theme == "dark" ? "white" : "#2f2d51"}
            style={
              theme == "dark"
                ? { minHeight: 50, color: "white" }
                : { minHeight: 50, color: "#2f2d51" }
            }
            placeholder="Notes"
            multiline={true}
            textAlignVertical="top"
            numberOfLines={3}
            value={newNote}
            onChangeText={(text) => setNewNote(text)}
          />
        </View>

        <View
          style={
            theme == "dark"
              ? {
                  backgroundColor: "#212121",
                  padding: 10,
                  gap: 5,
                  borderRadius: 8,
                }
              : {
                  backgroundColor: "#93d8f8",
                  padding: 10,
                  gap: 5,
                  borderRadius: 8,
                }
          }
        >
          <TouchableOpacity
            onPress={showDatePicker}
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 5,
            }}
          >
            <View style={{ gap: 5 }}>
              <Text
                style={
                  theme == "dark"
                    ? { fontFamily: "Inter-Medium", color: "white" }
                    : { fontFamily: "Inter-Medium", color: "#2f2d51" }
                }
              >
                Date
              </Text>
              {reminderDate.toString().length > 0 && (
                <Text
                  style={
                    theme == "dark"
                      ? { fontFamily: "Inter-Regular", color: "grey" }
                      : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                  }
                >
                  {reminderDate.toDateString()}
                </Text>
              )}
            </View>
            <AntDesign
              name="right"
              size={24}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
          <View
            style={
              theme == "dark"
                ? { width: "100%", backgroundColor: "grey", height: 0.5 }
                : { width: "100%", backgroundColor: "#2f2d51", height: 0.5 }
            }
          />
          <TouchableOpacity
            onPress={showTimePicker}
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 5,
            }}
          >
            <View style={{ gap: 5 }}>
              <Text
                style={
                  theme == "dark"
                    ? { fontFamily: "Inter-Medium", color: "white" }
                    : { fontFamily: "Inter-Medium", color: "#2f2d51" }
                }
              >
                Time
              </Text>
              {reminderTime.toString().length > 0 && (
                <Text
                  style={
                    theme == "dark"
                      ? { fontFamily: "Inter-Regular", color: "grey" }
                      : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                  }
                >
                  {new Date(reminderTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              )}
            </View>
            <AntDesign
              name="right"
              size={24}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
      </View>
      <Text>Reminders:</Text>
      <View style={{ flex: 1 }}>
        <FlatList
          data={remindersRedux}
          style={{ height: 100 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.reminder.message}</Text>
              {/* <Text>{item.time.toString()}</Text> */}
              <TouchableOpacity onPress={() => dismissNotification(item)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {},
});
