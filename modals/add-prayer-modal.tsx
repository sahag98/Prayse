import React, { useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { cn } from "@lib/utils";
import uuid from "react-native-uuid";
import { useDispatch } from "react-redux";
import { addPrayer, editPrayer } from "@redux/prayerReducer";

const AddPrayerModal = ({
  actualTheme,
  colorScheme,
  prayertoBeEdited,
  setPrayertoBeEdited,

  setIsEditing,
  folderName,
  folderId,
  prayerTitle,
  setPrayerTitle,
  prayerNote,
  setPrayerNote,
  addPrayerBottomSheetModalRef,
}: any) => {
  const dispatch = useDispatch();

  // ref
  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["50%", "75%", "90%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);

    // if (index === -1) {
    //   setIsAddingQuestion(false);
    //   setSuccess(false);
    //   setError(null);
    // }
  }, []);

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
          notes: prayerNote,
          prayer: prayerTitle,
          folder: folderName,
          status: "Active",
          folderId,
          date: new Date().toLocaleString(),
          id: newId,
        }),
      );
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
      dispatch(
        editPrayer({
          prayer: prayerTitle,
          notes: prayerNote,
          folder: folderName,
          folderId,
          date: prayertoBeEdited.date,
          id: prayertoBeEdited.id,
        }),
      );
      setIsEditing(false);

      setPrayertoBeEdited(null);
    }

    setPrayerTitle("");
    setPrayerNote("");

    setIsEditing(false);
    addPrayerBottomSheetModalRef.current.close();
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={addPrayerBottomSheetModalRef}
        index={1}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#212121" : "#f2f7ff",
        }}
        containerStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 99,
        }}
        keyboardBehavior="extend"
        handleIndicatorStyle={{
          backgroundColor:
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51",
        }}
        handleStyle={{
          backgroundColor:
            actualTheme && actualTheme.Bg
              ? actualTheme.Bg
              : colorScheme === "dark"
                ? "#212121"
                : "#f2f7ff",
        }}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView
          style={[getMainBackgroundColorStyle(actualTheme)]}
          className="flex-1 gap-3 items-center bg-light-background dark:bg-dark-secondary p-4 "
        >
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="text-2xl text-light-primary dark:text-dark-primary font-inter-bold"
          >
            {prayertoBeEdited ? "Edit" : "Add"} Prayer
          </Text>
          <View className="w-full">
            <BottomSheetTextInput
              style={[
                getSecondaryTextColorStyle(actualTheme),
                getSecondaryBackgroundColorStyle(actualTheme),
                actualTheme &&
                  actualTheme.SecondaryTxt && {
                    borderWidth: 1,
                    borderColor: actualTheme.SecondaryTxt,
                  },
              ]}
              className="w-full text-light-primary font-inter-regular dark:text-dark-primary  bg-light-secondary dark:bg-dark-background p-5 mb-3 rounded-lg"
              placeholder="Who are you praying for?"
              placeholderTextColor={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
              selectionColor={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
              // autoFocus={true}
              onChangeText={(text) => setPrayerTitle(text)}
              defaultValue={prayerTitle}
            />
            <BottomSheetTextInput
              style={[
                getSecondaryTextColorStyle(actualTheme),
                getSecondaryBackgroundColorStyle(actualTheme),
                actualTheme &&
                  actualTheme.SecondaryTxt && {
                    borderWidth: 1,
                    borderColor: actualTheme.SecondaryTxt,
                  },
              ]}
              textAlignVertical="top"
              className="w-full bg-light-secondary min-h-32 text-light-primary font-inter-regular dark:text-dark-primary  dark:bg-dark-background  p-5 mb-3 rounded-lg"
              placeholder="Write more information on the prayer (optional)"
              multiline
              placeholderTextColor={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
              selectionColor={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
              // autoFocus={true}
              onChangeText={(text) => setPrayerNote(text)}
              defaultValue={prayerNote}
            />
          </View>
          <Pressable
            disabled={!prayerTitle}
            onPress={handleSubmit}
            className={cn(
              !prayerTitle && colorScheme === "dark"
                ? "bg-[#2e2e2e]"
                : "bg-gray-400",
              prayerTitle && "bg-light-primary dark:bg-dark-accent",
              " p-4 items-center justify-center rounded-lg w-full",
            )}
          >
            <Text className="font-inter-semibold text-lg text-light-background dark:text-dark-background">
              {prayertoBeEdited ? "Edit" : "Add"}
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default AddPrayerModal;
