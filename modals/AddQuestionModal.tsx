//@ts-nocheck

import React, { useCallback, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

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
  currentUser,
  setIsAddingQuestion,
  supabase,
  questionBottomSheetModalRef,
}: any) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  // ref
  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["50%", "75%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);

    if (index === -1) {
      setIsAddingQuestion(false);
      setSuccess(false);
      setError(null);
    }
  }, []);

  async function handleApproval() {
    if (newQuestion.length === 0) {
      console.log("Please enter a question");
      return;
    }
    try {
      setIsApproving(true);
      console.log("handleApproval");

      const { data, error } = await supabase.from("approvals").insert({
        question: newQuestion,
        user_id: currentUser?.id,
        user_name: currentUser?.full_name,
      });
      console.log("data", data);
      console.log("error", error);

      if (!error) {
        setSuccess(true);
      } else {
        setError(error);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsApproving(false);
      setNewQuestion("");
    }
  }

  // renders
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={questionBottomSheetModalRef}
        index={1}
        handleIndicatorStyle={{
          backgroundColor:
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : colorScheme === "dark"
                ? "white"
                : "#f2f7ff",
        }}
        handleStyle={{
          borderTopWidth: 1,
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
            Write a Question
          </Text>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className=" text-light-primary dark:text-dark-primary font-inter-medium"
          >
            Please be sure to keep your question biblical and to the point.
          </Text>
          <TextInput
            style={[
              getSecondaryTextColorStyle(actualTheme),
              getSecondaryBackgroundColorStyle(actualTheme),
            ]}
            onSubmitEditing={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            className="w-full font-inter-regular min-h-32 max-h-40 rounded-lg text-light-primary dark:text-dark-primary bg-light-secondary dark:bg-dark-secondary p-4"
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
            multiline
            onChangeText={setNewQuestion}
          />
          <TouchableOpacity
            onPress={handleApproval}
            disabled={isApproving}
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className={cn(
              "w-full justify-center items-center rounded-lg bg-light-primary dark:bg-dark-primary transition-opacity p-4",
              isApproving && "opacity-50",
              !isApproving && newQuestion.length === 0 && "opacity-50",
            )}
          >
            <Text className="text-lg font-inter-bold text-light-background dark:text-dark-background">
              Submit for Approval
            </Text>
          </TouchableOpacity>
          {success && (
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-light-secondary w-full dark:bg-dark-secondary p-4 rounded-lg"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary font-inter-bold text-lg dark:text-dark-primary"
              >
                Question submitted
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary font-inter-regular dark:text-dark-primary"
              >
                We will review your question and get back to you soon!
              </Text>
            </View>
          )}
          {error && <Text>Error submitting question</Text>}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default AddQuestionModal;
