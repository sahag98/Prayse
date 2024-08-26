//@ts-nocheck

import React, { useCallback, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
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

const AddQuestionModal = ({
  actualTheme,
  colorScheme,
  setIsAddingQuestion,
  questionBottomSheetModalRef,
}: any) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  // ref
  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["50%", "75%"], []);
  const dispatch = useDispatch();

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);

    if (index === -1) {
      setIsAddingQuestion(false);
    }
  }, []);

  function handleApproval() {
    if (newQuestion.length === 0) {
      console.log("Please enter a question");
    } else {
      setIsApproving(true);
      console.log("handleApproval");
    }
  }

  // renders
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={questionBottomSheetModalRef}
        index={1}
        handleStyle={{
          backgroundColor:
            actualTheme && actualTheme.Bg
              ? actualTheme.Bg
              : colorScheme === "dark"
                ? "#2f2d51"
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
            className="text-2xl font-bold font-inter"
          >
            Add Question
          </Text>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className=" text-light-primary dark:text-dark-primary font-inter"
          >
            Please be sure to keep your question short and to the point.
          </Text>
          <TextInput
            style={[
              getSecondaryTextColorStyle(actualTheme),
              getSecondaryBackgroundColorStyle(actualTheme),
              { textAlignVertical: "top" },
            ]}
            onSubmitEditing={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            className="w-full font-inter rounded-lg bg-light-secondary dark:bg-dark-secondary p-4"
            placeholder="What is your question?"
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
            value={newQuestion}
            onChangeText={(text) => setNewQuestion(text)}
          />
          <TouchableOpacity
            onPress={handleApproval}
            disabled={isApproving}
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className={cn(
              "w-full font-inter justify-center items-center rounded-lg bg-light-primary dark:bg-dark-primary transition-opacity p-4",
              isApproving && "opacity-50",
              !isApproving && newQuestion.length === 0 && "opacity-50",
            )}
          >
            <Text className="text-lg font-bold font-inter text-light-background dark:text-dark-background">
              Submit for Approval
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default AddQuestionModal;
