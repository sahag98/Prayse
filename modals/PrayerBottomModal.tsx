//@ts-nocheck

import React, { useCallback, useMemo } from "react";
import { Share, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

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
const PrayerBottomModal = ({
  handleCloseBottomModal,
  colorScheme,
  prayerBottomSheetModalRef,
  setPrayer,
  prayer,
  handleTriggerEdit,
  actualTheme,
}: any) => {
  console.log(prayer);
  // ref
  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["50%"], []);
  const dispatch = useDispatch();
  const handleAddToAnsweredPrayer = () => {
    console.log("will switch to answered");
    dispatch(switchPrayerStatus(prayer));
    handleCloseBottomModal();
  };

  const handleArchivePrayer = () => {
    console.log("will switch to archived");
    dispatch(archivePrayer(prayer));
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
    } catch (error) {
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
          handleIndicatorStyle={{
            backgroundColor:
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51",
          }}
          handleStyle={{
            borderTopWidth: 1,
            borderTopColor: "gainsboro",
            backgroundColor:
              actualTheme && actualTheme.Bg
                ? actualTheme.Bg
                : colorScheme === "dark"
                  ? "#121212"
                  : "white",
          }}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetView
            style={getMainBackgroundColorStyle(actualTheme)}
            className="flex-1 dark:bg-dark-background gap-3 p-4"
          >
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-400 flex-row justify-between items-center p-4 rounded-md"
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
                className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-secondary p-4 rounded-md"
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
                        ? "#A5C9FF"
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
                  className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-secondary p-4 rounded-md"
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
                          ? "#A5C9FF"
                          : "#2f2d51"
                    }
                  />
                </TouchableOpacity>

                {prayer?.status !== "Answered" && (
                  <TouchableOpacity
                    onPress={handleAddToAnsweredPrayer}
                    style={getSecondaryBackgroundColorStyle(actualTheme)}
                    className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-secondary p-4 rounded-md"
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
                            ? "#A5C9FF"
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
                className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-secondary p-4 rounded-md"
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
                        ? "#A5C9FF"
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
