import React, { useCallback, useMemo } from "react";
import { Alert, Share, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Feather } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  getMainBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import {
  archivePrayer,
  deletePrayer,
  switchPrayerStatus,
} from "@redux/prayerReducer";
import { cancelScheduledNotificationAsync } from "expo-notifications";
import { deleteReminder } from "@redux/remindersReducer";
const PrayerBottomModal = ({
  handleCloseBottomModal,
  colorScheme,
  prayerBottomSheetModalRef,
  setPrayer,
  prayer,
  handleTriggerEdit,
  actualTheme,
}: any) => {
  const reminders = useSelector(
    (state: { reminder: { reminders: [] } }) => state.reminder.reminders,
  );

  const reminderPrayer = reminders.find(
    (reminder: any) => reminder.reminder.prayer_id === prayer?.id,
  );

  // ref
  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["50%", "75%"], []);
  const dispatch = useDispatch();
  const handleAddToAnsweredPrayer = async () => {
    console.log("marking as answered");
    dispatch(switchPrayerStatus({ prayer, newStatus: "Answered" }));
    if (reminderPrayer) {
      //@ts-expect-error
      dispatch(deleteReminder(reminderPrayer.reminder.id));
      //@ts-expect-error
      await cancelScheduledNotificationAsync(reminderPrayer.identifier);
    }
    handleCloseBottomModal();
  };

  const handleArchivePrayer = () => {
    console.log("will switch to archived");
    if (prayer.status === "Archived") {
      dispatch(switchPrayerStatus({ prayer, newStatus: "Active" }));
    } else {
      dispatch(switchPrayerStatus({ prayer, newStatus: "Archived" }));
    }

    handleCloseBottomModal();
  };

  const handleDelete = () => {
    dispatch(deletePrayer(prayer.id));
    handleCloseBottomModal();
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: prayer.prayer,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);

    if (index === -1) {
      setPrayer(null);
    }
  }, []);

  // renders
  return (
    <BottomSheetModalProvider>
      <View>
        <BottomSheetModal
          ref={prayerBottomSheetModalRef}
          index={0}
          containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          handleIndicatorStyle={{
            backgroundColor:
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51",
          }}
          handleStyle={{
            // borderTopWidth: 1,
            // borderTopColor: "gainsboro",
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
            style={getMainBackgroundColorStyle(actualTheme)}
            className="flex-1 dark:bg-dark-secondary bg-light-background gap-3 p-4"
          >
            <TouchableOpacity
              onPress={handleDelete}
              className="dark:bg-red-800 bg-red-500 flex-row justify-between items-center p-4 rounded-md"
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter-semibold text-lg text-dark-primary dark:text-dark-primary"
              >
                Delete prayer
              </Text>
              <Feather name="trash-2" size={22} color="white" />
            </TouchableOpacity>
            {prayer?.status !== "Answered" && (
              <TouchableOpacity
                onPress={handleArchivePrayer}
                style={getSecondaryBackgroundColorStyle(actualTheme)}
                className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-background p-4 rounded-md"
              >
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary"
                >
                  {prayer?.status === "Archived"
                    ? "Unarchive prayer"
                    : "Archive prayer"}
                </Text>
                <Feather
                  name="archive"
                  size={22}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                        ? "white"
                        : "#2f2d51"
                  }
                />
              </TouchableOpacity>
            )}
            {prayer?.status !== "Archived" && prayer?.status !== "Answered" && (
              <>
                <TouchableOpacity
                  onPress={() => handleTriggerEdit(prayer)}
                  style={getSecondaryBackgroundColorStyle(actualTheme)}
                  className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-background p-4 rounded-md"
                >
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary"
                  >
                    Edit prayer
                  </Text>
                  <Feather
                    name="edit"
                    size={22}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "white"
                          : "#2f2d51"
                    }
                  />
                </TouchableOpacity>

                {prayer?.status !== "Answered" && (
                  <TouchableOpacity
                    onPress={handleAddToAnsweredPrayer}
                    style={getSecondaryBackgroundColorStyle(actualTheme)}
                    className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-background p-4 rounded-md"
                  >
                    <Text
                      style={getSecondaryTextColorStyle(actualTheme)}
                      className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary"
                    >
                      Mark as answered
                    </Text>
                    <Feather
                      name="check-circle"
                      size={22}
                      color={
                        actualTheme && actualTheme.SecondaryTxt
                          ? actualTheme.SecondaryTxt
                          : colorScheme === "dark"
                            ? "white"
                            : "#2f2d51"
                      }
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
            {prayer?.status !== "Answered" && (
              <TouchableOpacity
                onPress={onShare}
                style={getSecondaryBackgroundColorStyle(actualTheme)}
                className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-background p-4 rounded-md"
              >
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary"
                >
                  Share
                </Text>
                <Feather
                  name="share"
                  size={22}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                        ? "white"
                        : "#2f2d51"
                  }
                />
              </TouchableOpacity>
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default PrayerBottomModal;
