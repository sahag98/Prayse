import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { LOGIN_SCREEN } from "@routes";

const AddPraiseModal = ({
  actualTheme,
  colorScheme,
  currentUser,
  supabase,
  praiseBottomSheetRef,
}: any) => {
  const [newPraise, setNewPraise] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [praiseCount, setPraiseCount] = useState(0);

  const queryClient = useQueryClient();
  const snapPoints = useMemo(() => ["40%"], []);

  useEffect(() => {
    const fetchPraiseCount = async () => {
      const count = await AsyncStorage.getItem("praiseCount");
      setPraiseCount(count ? parseInt(count) : 0);
    };
    fetchPraiseCount();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  async function handleSubmit() {
    if (newPraise.length === 0) {
      console.log("Please enter a praise");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("praises")
        .insert([
          {
            user_id: currentUser && !isAnonymous ? currentUser.id : null,
            content: newPraise,
          },
        ])
        .select();

      if (data) {
        const newCount = praiseCount + 1;
        setPraiseCount(newCount);
        await AsyncStorage.setItem("praiseCount", newCount.toString());
      }

      praiseBottomSheetRef.current?.close();
      queryClient.invalidateQueries({ queryKey: ["praises"] });
      setNewPraise("");
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        ref={praiseBottomSheetRef}
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
          className="flex-1 gap-4 items-center bg-light-background dark:bg-dark-secondary p-4 "
        >
          {/* <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, width: "100%" }}
            keyboardVerticalOffset={100}
          > */}
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="text-2xl text-light-primary dark:text-dark-primary font-inter-bold"
          >
            Add Praise
          </Text>

          <BottomSheetTextInput
            style={[
              getSecondaryTextColorStyle(actualTheme),
              getSecondaryBackgroundColorStyle(actualTheme),
            ]}
            className="w-full font-inter-regular rounded-lg text-light-primary dark:text-dark-primary bg-light-secondary placeholder:text-gray-600 dark:bg-dark-background p-4"
            placeholder="Share a praise with us!"
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
            defaultValue={newPraise}
            onChangeText={setNewPraise}
          />

          <View className="flex-row gap-2 items-center self-start">
            <Pressable
              onPress={() => {
                if (isAnonymous && !currentUser) {
                  Alert.alert(
                    "Sign In",
                    "You need to sign in to submit a praise with your name.",
                    [
                      {
                        text: "Cancel",
                        onPress: () => setIsAnonymous(true),
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => router.push(LOGIN_SCREEN),
                      },
                    ],
                  );
                } else {
                  setIsAnonymous((prev) => !prev);
                }
              }}
              className="size-6 border border-light-primary dark:border-dark-primary items-center justify-center rounded-lg"
            >
              {isAnonymous && (
                <AntDesign
                  name="check"
                  size={15}
                  color={
                    actualTheme && actualTheme.MainTxt
                      ? actualTheme.MainTxt
                      : colorScheme == "dark"
                        ? "white"
                        : "#2f2d51"
                  }
                />
              )}
            </Pressable>
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-medium text-sm text-light-primary dark:text-dark-primary"
            >
              Anonymous
            </Text>
          </View>

          {praiseCount < 10 ? (
            <Pressable
              onPress={handleSubmit}
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              className="bg-light-primary mt-4 w-full dark:bg-dark-accent p-4 items-center justify-center rounded-lg"
            >
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="text-lg text-light-background dark:text-dark-background font-inter-bold"
              >
                Add
              </Text>
            </Pressable>
          ) : (
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="text-lg text-light-primary dark:text-dark-primary font-inter-bold"
            >
              Thank you for praising God with us today. Come back tomorrow to
              start it off.
            </Text>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default AddPraiseModal;
