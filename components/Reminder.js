import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, FlatList } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import { Container } from "../styles/appStyles";
// import * as Permissions from "expo-permissions";

export default function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());

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
      },
    });
  };

  const addReminder = () => {
    const newReminderObj = {
      id: Date.now().toString(),
      message: newReminder,
      time: reminderTime,
    };

    setReminders([...reminders, newReminderObj]);
    scheduleNotification(newReminderObj);

    setNewReminder("");
    setReminderTime(new Date());
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
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Create a Reminder:</Text>
        <TextInput
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

        <Text>Reminders:</Text>
        <FlatList
          data={reminders}
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
