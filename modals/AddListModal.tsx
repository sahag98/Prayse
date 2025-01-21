import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
import { cn } from "@lib/utils";

const AddListModal = ({
  actualTheme,
  addNewFolder,
  colorScheme,
  folderName,
  setFolderName,
  bottomSheetModalRef,
}: any) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  // ref
  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);

    // if (index === -1) {
    //   setIsAddingQuestion(false);
    //   setSuccess(false);
    //   setError(null);
    // }
  }, []);

  // renders
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
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
          borderRadius: 15,
          borderTopColor: "gainsboro",
          backgroundColor:
            actualTheme && actualTheme.Bg
              ? actualTheme.Bg
              : colorScheme === "dark"
                ? "#121212"
                : "#f2f7ff",
        }}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView
          style={getMainBackgroundColorStyle(actualTheme)}
          className="flex-1 gap-3 items-center bg-light-background dark:bg-dark-background p-4 "
        >
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="text-2xl text-light-primary dark:text-dark-primary font-inter-bold"
          >
            Create Prayer List
          </Text>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter-medium text-light-primary dark:text-dark-primary"
          >
            Choose one of these examples or create your own!
          </Text>
          <View className="flex-row mb-3 items-center gap-2 justify-between">
            <Pressable
              onPress={() => setFolderName("Friends")}
              className="bg-light-secondary items-center justify-center dark:bg-dark-accent flex-1 p-3 rounded-lg"
            >
              <Text className="font-inter-semibold text-light-primary dark:text-dark-background">
                Friends
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFolderName("Church")}
              className="bg-light-secondary items-center justify-center dark:bg-dark-accent flex-1 p-3 rounded-lg"
            >
              <Text className="font-inter-semibold text-light-primary dark:text-dark-background">
                Church
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFolderName("Bible Study")}
              className="bg-light-secondary items-center justify-center dark:bg-dark-accent flex-1 p-3 rounded-lg"
            >
              <Text className="font-inter-semibold text-light-primary dark:text-dark-background">
                Bible Study
              </Text>
            </Pressable>
          </View>
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
            className="w-full border text-light-primary font-inter-regular dark:text-dark-primary border-light-primary dark:border-[#c1c0c0] p-5 rounded-lg"
            placeholder="What's the name of the list?"
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
            onChangeText={(text) => setFolderName(text)}
            defaultValue={folderName}
          />
          <Pressable
            onPress={addNewFolder}
            className="bg-light-primary dark:bg-dark-accent p-4 items-center justify-center rounded-lg w-full"
          >
            <Text className="font-inter-semibold text-lg text-light-background dark:text-dark-background">
              Create
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default AddListModal;
