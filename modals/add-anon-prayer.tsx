import React, { useCallback, useMemo, useState } from "react";
import { Pressable, Text } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const AddAnonymousPrayerModal = ({
  actualTheme,
  colorScheme,
  currentUser,
  supabase,
  prayerBottomSheetModalRef,
}: any) => {
  const [newPrayer, setNewPrayer] = useState("");
  const [isAnonymous] = useState(true);

  const queryClient = useQueryClient();
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  async function handleSubmit() {
    if (newPrayer.length === 0) {
      console.log("Please enter a prayer");
      return;
    }
    //get random two numbers from 0 to 9
    const randomNumber1 = Math.floor(Math.random() * 10);
    const randomNumber2 = Math.floor(Math.random() * 10);
    const anonName = `Anonymous${randomNumber1}${randomNumber2}`;
    try {
      const { error } = await supabase
        .from("anonymous")
        .insert({
          title: newPrayer,
          user_id: currentUser && !isAnonymous ? currentUser.id : null,
          anon_name: isAnonymous ? anonName : null,
        })
        .select();
      console.log("error", error);
      prayerBottomSheetModalRef.current?.close();
      queryClient.invalidateQueries({ queryKey: ["anonprayers"] });
      setNewPrayer("");
    } catch (error) {
      console.log("error", error);
    } finally {
      const { data } = await supabase.functions.invoke("get-tokens");

      data.map(async (d: any) => {
        console.log(d.token);
        const message = {
          to: d.token,
          sound: "default",
          title: `New Anonymous Prayer 🙏`,
          body: `Someone has a prayer request. Tap to lift them up.`,
          data: {
            screen: `anonymous`,
          },
        };
        await axios.post("https://exp.host/--/api/v2/push/send", message, {
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        });
      });
    }
  }

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        ref={prayerBottomSheetModalRef}
        index={1}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === "dark" ? "white" : "#2f2d51",
        }}
        handleStyle={{
          // borderTopWidth: 1,
          // borderTopColor: "gainsboro",
          backgroundColor: colorScheme === "dark" ? "#212121" : "#f2f7ff",
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
            Add Prayer
          </Text>

          <BottomSheetTextInput
            style={[
              getSecondaryTextColorStyle(actualTheme),
              getSecondaryBackgroundColorStyle(actualTheme),
            ]}
            className="w-full font-inter-medium min-h-24 rounded-lg text-light-primary dark:text-dark-primary bg-light-secondary placeholder:text-gray-600 dark:placeholder:text-stone-400 dark:bg-dark-background p-4"
            placeholder="How can we pray for you today?"
            multiline
            placeholderTextColor={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : colorScheme === "dark"
                ? "#f4f4f4"
                : "#2f2d51"
            }
            selectionColor={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : colorScheme === "dark"
                ? "#e0e0e0"
                : "#2f2d51"
            }
            defaultValue={newPrayer}
            onChangeText={setNewPrayer}
          />

          <Pressable
            onPress={handleSubmit}
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="bg-light-primary mt-0 w-full dark:bg-dark-accent p-4 items-center justify-center rounded-lg"
          >
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="text-lg text-light-background dark:text-dark-background font-inter-bold"
            >
              Add
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default AddAnonymousPrayerModal;
