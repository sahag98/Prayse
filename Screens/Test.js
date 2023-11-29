import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import { Container } from "../styles/appStyles";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { addNewReminder } from "../redux/remindersReducer";
// import * as Permissions from "expo-permissions";

export default function Reminder({ navigation }) {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const remindersRedux = useSelector((state) => state.reminder.reminders);
  const dispatch = useDispatch();
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
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: reminder.message,
      },
      trigger: {
        date: reminder.time,
        repeats: true,
      },
    });
  };

  const addReminder = () => {
    const newReminderObj = {
      id: uuid.v4(),
      message: newReminder,
      time: reminderTime,
    };

    dispatch(addNewReminder(newReminderObj));

    setReminders([...reminders, newReminderObj]);
    scheduleNotification(newReminderObj);

    setNewReminder("");
    setReminderTime(new Date());
    Keyboard.dismiss();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    hideDatePicker();
    setReminderTime(date);
  };

  return (
    <Container
      style={{
        flex: 1,

        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text>Back</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Create a Reminder:</Text>
        <TextInput
          placeholderTextColor={"blue"}
          placeholder="Enter your reminder"
          value={newReminder}
          onChangeText={(text) => setNewReminder(text)}
        />
        <Button title="Pick a time" onPress={showDatePicker} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
        <Button title="Add Reminder" onPress={addReminder} />
      </View>
      <Text>Reminders:</Text>
      <View style={{ flex: 1 }}>
        <FlatList
          data={remindersRedux}
          style={{ height: 100 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.message}</Text>
              <Text>{item.time.toString()}</Text>
            </View>
          )}
        />
      </View>
    </Container>
  );
}
