import React, { useState } from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import { Container } from "@components/Container";
import { useColorScheme } from "nativewind";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import Moment from "moment";
import useStore from "@hooks/store";

const JournalView = () => {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { journals } = useStore();

  // Find the journal entry by date (id)
  const journal = journals.find((j) => j.date === id);

  const [answer, setAnswer] = useState(journal?.answer || "");
  const { handleUpdateJournalAnswer } = useStore();

  // Initialize video player at the top level
  const player = useVideoPlayer(journal?.videoUri || "", (player) => {
    player.loop = false;
  });

  if (!journal) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <Text className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary">
            Journal not found
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <View style={{ paddingBottom: insets.bottom, flex: 1 }}>
        {/* Header */}
        <View className="flex-row mb-6 items-center gap-2">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <AntDesign
              name="left"
              size={30}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
          <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary">
            Journal Entry
          </Text>
          <TouchableOpacity
            onPress={() => {
              useStore.getState().handleDeleteJournal(journal.date);
              router.back();
            }}
            style={{ marginLeft: "auto" }}
            accessibilityLabel="Delete Journal"
          >
            <Feather
              name="trash-2"
              size={24}
              color={colorScheme === "dark" ? "#ff4d4f" : "#d32f2f"}
            />
          </TouchableOpacity>
        </View>

        {/* Journal Content */}
        <View className="flex-1">
          {/* Title and Meta Info */}
          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-2">
              <TextJournalContent
                content={journal.content || ""}
                colorScheme={colorScheme}
              />
              {/* <Text className="font-inter-bold text-xl text-light-primary dark:text-dark-primary">
                {journal.content.split(" ").slice(0, 20).join(" ")}...
              </Text> */}
            </View>

            <View className="flex-row items-center gap-4">
              <View className="flex-row bg-white dark:bg-dark-secondary px-3 py-2 rounded-lg items-center gap-2">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colorScheme === "dark" ? "white" : "#2f2d51"}
                />
                <Text className="font-inter-medium text-sm text-light-primary dark:text-dark-primary">
                  {journal.type === "video"
                    ? `${Math.floor(Number(journal.time) / 60)
                        .toString()
                        .padStart(
                          2,
                          "0",
                        )}:${(Number(journal.time) % 60).toString().padStart(2, "0")}`
                    : `${Math.floor(Number(journal.time) / 60)}:${Number(journal.time) % 60}`}
                </Text>
              </View>

              <View className="flex-row gap-2 items-center">
                <Feather
                  name="calendar"
                  size={16}
                  color={colorScheme === "dark" ? "white" : "#2f2d51"}
                />
                <Text className="font-inter-medium text-sm text-light-primary dark:text-dark-primary">
                  {Moment(journal.date).format("MMM DD, YYYY")}
                </Text>
              </View>
            </View>
          </View>

          {/* Answer Field */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-inter-semibold text-light-primary dark:text-dark-primary mb-2">
                How did God answer this prayer?
              </Text>
            </View>
            <TextInput
              value={answer}
              onChangeText={setAnswer}
              onBlur={() => handleUpdateJournalAnswer(journal.date, answer)}
              onSubmitEditing={() =>
                handleUpdateJournalAnswer(journal.date, answer)
              }
              selectionColor={colorScheme === "dark" ? "white" : "#2f2d51"}
              placeholder="Write answer here..."
              multiline
              blurOnSubmit
              className="bg-white dark:bg-dark-secondary p-3 rounded-xl text-light-primary dark:text-dark-primary min-h-20"
              style={{ textAlignVertical: "top" }}
            />
            {/* <Pressable className="bg-light-primary dark:bg-dark-accent p-4 rounded-lg items-center justify-center">
              <Text>Submit</Text>
            </Pressable> */}
          </View>

          {/* Video Player or Text Content */}

          <View className="flex-1 bg-black rounded-xl overflow-hidden">
            <VideoView
              style={{
                flex: 1,
                borderRadius: 16,
                overflow: "hidden",
              }}
              player={player}
              nativeControls
              contentFit="contain"
            />
          </View>
        </View>
      </View>
    </Container>
  );
};

const TextJournalContent = ({
  content = "",
  colorScheme = "",
}: {
  content?: string;
  colorScheme?: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const words = content.split(" ");
  const isLong = words.length > 20;
  const displayText =
    !expanded && isLong ? words.slice(0, 20).join(" ") + "..." : content;

  return (
    <View className="flex-1 bg-white dark:bg-dark-secondary p-4 rounded-xl">
      <Text className="font-inter-medium text-base text-light-primary dark:text-dark-primary leading-6">
        {displayText}
      </Text>
      {isLong && !expanded && (
        <TouchableOpacity
          onPress={() => setExpanded(true)}
          style={{ marginTop: 8 }}
        >
          <Text className="font-inter-semibold text-light-primary dark:text-dark-primary">
            View More
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default JournalView;
