import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, FontAwesome } from "@expo/vector-icons";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { addPrayer, editPrayer } from "../redux/prayerReducer";

import {
  getMainBackgroundColorStyle,
  getPrimaryBackgroundColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import useStore from "@hooks/store";
import EncouragementModal from "./encouragement-modal";
import { getRandomEncouragement } from "@lib/encouragement";

const InputModal = ({
  addPrayerBottomSheetModalRef,
  actualTheme,
  colorScheme,
  setTaskName,
  isEditing,
  setIsEditing,
  taskName,
  isIOS,
  animatedValue,
  extended,
  modalVisible,
  folderName,
  folderId,
  setModalVisible,
  prayerTitle,
  setPrayerTitle,
  prayertoBeEdited,
  setPrayertoBeEdited,
}) => {
  const [inputHeight, setInputHeight] = useState(60);
  const [isExtended, setIsExtended] = useState(true);

  const [isSpeechVisible, setIsSpeechVisible] = useState(false);

  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");

  const { isShowingNewBadge, handleShowNewBadge } = useStore();

  const prayerList = useSelector((state) => state.prayer.prayer);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementData, setEncouragementData] = useState(null);

  const scale = useSharedValue(1);

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
    });
  };

  useEffect(() => {
    if (!isIOS) {
      animatedValue.addListener(({ value }) => {
        setIsExtended(value <= 0);
      });
    } else setIsExtended(extended);
  }, [animatedValue, extended, isIOS]);

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setTranscript("");
  };
  const dispatch = useDispatch();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (isShowingNewBadge) {
      scale.value = withRepeat(
        withTiming(1.1, { easing: Easing.ease, duration: 2000 }),
        withTiming(1, { easing: Easing.ease, duration: 2000 }),
        -1
      );
    }
  }, []);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  function getRandomTime() {
    const randomHour = Math.floor(Math.random() * (22 - 8 + 1)) + 8; // Random hour between 8 and 22
    const randomMinute = 0; // Always 0
    return { hour: randomHour, minute: randomMinute };
  }

  const handleSubmit = async () => {
    const newId = uuid.v4();
    const reminderId = uuid.v4();
    console.log("newid: ", newId);
    console.log("reminder id: ", reminderId);
    // if (prayerValue.length === 0 || transcript.length === 0) {
    //   alert("Type in a prayer and try again.");
    //   return;
    // }
    if (!prayertoBeEdited) {
      dispatch(
        addPrayer({
          prayer: "Prayer Title",
          notes: transcript,
          folder: folderName,
          status: "Active",
          folderId,
          date: new Date().toLocaleString(),
          id: newId,
        })
      );

      // Check if this is the first prayer overall or a milestone prayer
      const totalPrayers = prayerList.length;
      const isFirstPrayer = totalPrayers === 0;
      const isMilestonePrayer =
        totalPrayers > 0 && (totalPrayers + 1) % 5 === 0;

      if (isFirstPrayer || isMilestonePrayer) {
        const encouragement = getRandomEncouragement(isFirstPrayer);
        setEncouragementData(encouragement);
        setShowEncouragement(true);
      }
      // const randomTime = getRandomTime();
      // console.log("random time: ", randomTime);
      // const identifier = await Notifications.scheduleNotificationAsync({
      //   content: {
      //     title: "Pray 🙏",
      //     body: prayerValue,
      //     data: { screen: REMINDER_SCREEN },
      //   },
      //   trigger: {
      //     hour: randomTime.hour,
      //     minute: randomTime.minute,
      //     repeats: true, // Set to false if you want it to trigger just once
      //   },
      // });
      // const combinedDate = new Date(randomTime.hour, randomTime.minute);

      // const reminder = {
      //   id: reminderId,
      //   message: prayerValue,
      //   prayer_id: newId,
      //   time: combinedDate,
      // };

      // dispatch(
      //   addNewReminder({
      //     reminder,
      //     identifier,
      //     ocurrence: "Daily",
      //   })
      // );
    } else {
      console.log("prayer to be edited: ", prayertoBeEdited);
      dispatch(
        editPrayer({
          prayer: prayerValue,
          folder: folderName,
          folderId,
          date: prayertoBeEdited.date,
          id: prayertoBeEdited.id,
        })
      );
      setIsEditing(false);

      setPrayertoBeEdited(null);
    }
    setModalVisible(false);
    setIsSpeechVisible(false);
    setTranscript("");
    setIsEditing(false);
  };

  const handleCloseEncouragement = () => {
    setShowEncouragement(false);
    setEncouragementData(null);
  };

  return (
    <View>
      <View className="flex-row items-center justify-between mb-4 absolute bottom-4 w-full">
        <TouchableOpacity
          style={getPrimaryBackgroundColorStyle(actualTheme)}
          onPress={() => {
            handleShowNewBadge();
            setIsSpeechVisible(true);
            handleStart();
          }}
          className="dark:bg-dark-secondary relative dark:shadow-purple-400 flex-row items-center shadow-lg shadow-purple-200 justify-center gap-2 bg-white size-20 rounded-full"
        >
          <FontAwesome
            name="microphone"
            size={30}
            color={
              actualTheme && actualTheme.PrimaryTxt
                ? actualTheme.PrimaryTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={getPrimaryBackgroundColorStyle(actualTheme)}
          onPress={() => {
            addPrayerBottomSheetModalRef?.current.present();
            // setModalVisible(true);
            // setTaskName("Add");
          }}
          className="dark:bg-dark-accent border border-light-primary dark:border-dark-background flex-row items-center justify-center gap-2 bg-light-primary size-20 rounded-full shadow-gray-300 dark:shadow-none"
        >
          <FontAwesome
            name="pencil-square-o"
            size={30}
            color={
              actualTheme && actualTheme.PrimaryTxt
                ? actualTheme.PrimaryTxt
                : colorScheme === "dark"
                  ? "#121212"
                  : "white"
            }
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={isSpeechVisible}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={
              colorScheme === "dark"
                ? { backgroundColor: "rgba(0, 0, 0, 0.3)" }
                : { backgroundColor: "rgba(0, 0, 0, 0.3)" }
            }
            // style={getMainBackgroundColorStyle(actualTheme)}
            className="bg-light-background flex-1 items-center justify-center dark:bg-dark-background"
          >
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-white p-5 rounded-2xl w-4/5 shadow-lg dark:shadow-purple-400 shadow-purple-300 dark:bg-dark-secondary"
            >
              <View>
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-bold text-2xl text-center text-light-primary dark:text-dark-primary"
                >
                  Say Prayer
                </Text>
              </View>

              <TextInput
                className="mt-3 w-full rounded-lg px-2 items-center font-inter-regular border text-light-primary dark:text-dark-primary border-light-primary dark:border-[#bbbbbb] self-center font-inter"
                style={
                  actualTheme && actualTheme.SecondaryTxt
                    ? {
                        borderWidth: 1,
                        color: actualTheme.SecondaryTxt,
                        borderColor: actualTheme.SecondaryTxt,
                      }
                    : colorScheme === "dark"
                      ? {
                          borderColor: recognizing ? "#0096FF" : "#bbbbbb",
                          borderWidth: recognizing ? 2 : 1,
                          height: inputHeight < 80 ? 80 : inputHeight,
                        }
                      : {
                          borderColor: recognizing ? "#0096FF" : "#2f2d51",
                          borderWidth: recognizing ? 2 : 1,
                          height: inputHeight < 80 ? 80 : inputHeight,
                        }
                }
                placeholder="What are you praying for?"
                placeholderTextColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#e0e0e0"
                      : "#2f2d51"
                }
                selectionColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#e0e0e0"
                      : "#2f2d51"
                }
                onChangeText={(text) => setTranscript(text)}
                value={transcript}
                onContentSizeChange={handleContentSizeChange}
                onSubmitEditing={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                multiline
              />
              {!recognizing ? (
                <Pressable
                  onPress={handleStart}
                  className="bg-light-primary my-3 dark:bg-dark-accent rounded-lg w-fit p-3  self-start justify-center items-center"
                >
                  <Text className="font-inter-medium text-light-background dark:text-dark-background">
                    Start
                  </Text>
                  {/* <Entypo
                    name="controller-play"
                    size={30}
                    color={
                      actualTheme && actualTheme.Primary
                        ? actualTheme.Primary
                        : colorScheme === "dark"
                          ? "#121212"
                          : "white"
                    }
                  /> */}
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => ExpoSpeechRecognitionModule.stop()}
                  className="bg-light-primary my-3 dark:bg-dark-accent rounded-lg self-start p-3 justify-center items-center"
                >
                  <Text className="font-inter-medium text-light-background dark:text-dark-background">
                    Stop
                  </Text>
                </Pressable>
              )}

              <View className=" flex-row items-center justify-evenly">
                <Pressable
                  className="bg-light-secondary dark:bg-dark-background size-16 rounded-full items-center justify-center"
                  onPress={() => {
                    setIsSpeechVisible(false);
                    setTranscript("");
                  }}
                >
                  <AntDesign
                    name="close"
                    size={28}
                    color={colorScheme === "dark" ? "white" : "#2F2D51"}
                  />
                </Pressable>
                <Pressable
                  className="bg-light-primary dark:bg-dark-accent size-16 rounded-full items-center justify-center"
                  onPress={handleSubmit}
                >
                  <AntDesign
                    name="check"
                    size={28}
                    color={
                      actualTheme && actualTheme.PrimaryTxt
                        ? actualTheme.PrimaryTxt
                        : colorScheme === "dark"
                          ? "#121212"
                          : "white"
                    }
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={getMainBackgroundColorStyle(actualTheme)}
            className="bg-light-background dark:bg-dark-background"
          >
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-light-secondary dark:bg-dark-secondary"
            >
              <View>
                <View className="flex-row items-center gap-2">
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-bold text-light-primary dark:text-dark-primary"
                  >
                    {taskName} Prayer
                  </Text>
                  <AntDesign
                    name="edit"
                    size={24}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "white"
                          : "#2F2D51"
                    }
                  />
                </View>
              </View>
              <TextInput
                className="mt-3 items-center font-inter-regular border text-light-primary dark:text-dark-primary border-light-primary dark:border-[#d2d2d2] self-center font-inter"
                style={
                  actualTheme && actualTheme.SecondaryTxt
                    ? {
                        borderWidth: 1,
                        color: actualTheme.SecondaryTxt,
                        borderColor: actualTheme.SecondaryTxt,
                      }
                    : colorScheme === "dark"
                      ? {
                          height: inputHeight < 80 ? 80 : inputHeight,
                        }
                      : {
                          height: inputHeight < 80 ? 80 : inputHeight,
                        }
                }
                placeholder="What are you praying for?"
                placeholderTextColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#e0e0e0"
                      : "#2f2d51"
                }
                selectionColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#e0e0e0"
                      : "#2f2d51"
                }
                // autoFocus
                onChangeText={(text) => setPrayerTitle(text)}
                value={prayerTitle}
                onContentSizeChange={handleContentSizeChange}
                onSubmitEditing={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                multiline
              />

              <View>
                <View color="white" onPress={handleCloseModal}>
                  <AntDesign
                    name="close"
                    size={28}
                    color={colorScheme === "dark" ? "#121212" : "#2F2D51"}
                  />
                </View>
                <View
                  color={
                    actualTheme && actualTheme.Primary
                      ? actualTheme.Primary
                      : colorScheme === "dark"
                        ? "#121212"
                        : "#2F2D51"
                  }
                  onPress={handleSubmit}
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
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Encouragement Modal */}
      <EncouragementModal
        visible={showEncouragement && encouragementData !== null}
        onClose={handleCloseEncouragement}
        actualTheme={actualTheme}
        colorScheme={colorScheme}
        message={encouragementData?.message || ""}
        verse={encouragementData?.verse || { text: "", reference: "" }}
      />
    </View>
  );
};

export default InputModal;
