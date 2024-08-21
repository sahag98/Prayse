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
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { addToAnsweredPrayer } from "@redux/answeredReducer";
import { deletePrayer } from "@redux/prayerReducer";
const PrayerBottomModal = ({
  colorScheme,
  prayerBottomSheetModalRef,
  setPrayer,
  setIsEditing,
  setLoading,
  // handleTriggerEdit,
  // answeredAlready,
  opacity,
  // selectedEdit,
  // setSelectedEdit,
  actualTheme,
}: any) => {
  // ref
  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["50%"], []);
  const dispatch = useDispatch();
  const handleAddToAnsweredPrayer = (prayer) => {
    setIsEditing(false);
    dispatch(
      addToAnsweredPrayer({
        answeredDate: new Date().toDateString(),
        prayer,
        id: uuid.v4(),
      }),
    );
    setLoading(true);
    setIsBoxVisible(false);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500, // in milliseconds
      useNativeDriver: true,
    }).start();
    time();
    setSelectedEdit("");
  };

  const handleDelete = (prayer) => {
    dispatch(deletePrayer(prayer));
    setSelectedEdit("");
    setIsBoxVisible(false);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500, // in milliseconds
      useNativeDriver: true,
    }).start();
  };

  const onShare = async (title) => {
    try {
      await Share.share({
        message: title,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // callbacks

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
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetView
            // style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="flex-1 gap-3 p-4"
          >
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-400 flex-row justify-between items-center p-5 rounded-md"
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter font-bold text-light-primary dark:text-dark-primary"
              >
                Delete prayer
              </Text>
              <Feather name="trash-2" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={handleEdit}
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-secondary p-5 rounded-md"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter font-bold text-light-primary dark:text-dark-primary"
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
                      : "#6B7EFF"
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddToAnsweredPrayer}
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-secondary p-5 rounded-md"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter font-bold text-light-primary dark:text-dark-primary"
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
                      : "#6B7EFF"
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onShare}
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-light-secondary flex-row justify-between items-center dark:bg-dark-secondary p-5 rounded-md"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter font-bold text-light-primary dark:text-dark-primary"
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
                      : "#6B7EFF"
                }
              />
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default PrayerBottomModal;
