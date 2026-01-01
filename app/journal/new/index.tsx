import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { Container } from "@components/Container";
import { useColorScheme } from "nativewind";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import useStore from "@lib/zustand-store";
import Feather from "@expo/vector-icons/Feather";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { CheckReview } from "@hooks/useShowReview";
import EncouragementModal from "@modals/encouragement-modal";
import { getRandomJournalEncouragement } from "@lib/encouragement";

const questions = [
  "What's on your heart today?",
  "What's on your mind right now?",
  "Is there someone you want to pray for today?",
  "What's something you need to surrender to God?",
  "What do you feel God is saying to you today?",
];

const NewJournal = () => {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [lastVideoDuration, setLastVideoDuration] = useState<number | null>(
    null
  );
  const [title, setTitle] = useState("");
  const { handleAddJournal, reviewRequested, setReviewRequested, journals } =
    useStore();
  const [cameraType, setCameraType] = useState<"front" | "back">("front");
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementData, setEncouragementData] = useState<any>(null);

  // Speech recognition states
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Pick a random question on each mount
  const randomQuestion = useMemo(() => {
    return questions[Math.floor(Math.random() * questions.length)];
  }, []);

  // Speech recognition event handlers
  useSpeechRecognitionEvent("start", () => setIsTranscribing(true));
  useSpeechRecognitionEvent("end", () => setIsTranscribing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript || "");
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("Speech recognition error:", event.error, event.message);
  });

  React.useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(status === "granted");
    })();
  }, []);

  // Timer effect for recording
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      setRecordingSeconds(0);
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRecording && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // When video is saved, store the last duration
  React.useEffect(() => {
    if (!isRecording && videoUri && recordingSeconds > 0) {
      setLastVideoDuration(recordingSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUri]);

  // Helper to format seconds as mm:ss
  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  if (!permission || !micPermission) {
    return <View />;
  }

  if (!permission.granted || !micPermission.granted) {
    return (
      <View className="flex-1 bg-light-background dark:bg-dark-background items-center justify-center gap-4 p-4">
        <Feather
          name="alert-circle"
          size={80}
          color={colorScheme === "dark" ? "white" : "#2f2d51"}
        />
        <Text className="w-4/5 text-center font-inter-medium text-balance text-lg text-light-primary dark:text-dark-primary">
          Permissions were denied. Please enable camera and microphone
          permissions in your device settings to use this feature.
        </Text>
        <Pressable
          className="w-full items-center justify-center rounded-xl border bg-light-primary dark:bg-dark-primary p-4"
          onPress={() => {
            Linking.openSettings();
          }}
        >
          <Text className="font-inter-bold text-base text-light-background dark:text-dark-background">
            Open Settings
          </Text>
        </Pressable>
      </View>
    );
  }

  const startSpeechRecognition = async () => {
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        console.warn("Speech recognition permissions not granted");
        return;
      }

      ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        maxAlternatives: 1,
        continuous: true,
        requiresOnDeviceRecognition: false,
        addsPunctuation: true,
      });
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  };

  const stopSpeechRecognition = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  };

  const handleRecordPress = async () => {
    if (isRecording) {
      // Stop recording
      if (
        cameraRef.current &&
        typeof cameraRef.current.stopRecording === "function"
      ) {
        await cameraRef.current.stopRecording();
      }
      setIsRecording(false);
      // Stop speech recognition
      await stopSpeechRecognition();
    } else {
      // Start recording
      if (
        cameraRef.current &&
        typeof cameraRef.current.recordAsync === "function"
      ) {
        setIsRecording(true);
        setTranscript(""); // Clear previous transcript
        // Start speech recognition
        await startSpeechRecognition();
        try {
          const video = await cameraRef.current.recordAsync();
          setVideoUri(video?.uri ?? null);
        } catch (e) {
          console.log("error: ", e);
          setIsRecording(false);
          await stopSpeechRecognition();
        }
      }
    }
  };

  const handleSaveVideo = async () => {
    if (videoUri && hasMediaLibraryPermission) {
      await MediaLibrary.saveToLibraryAsync(videoUri);

      // Add to journal store with transcription
      const journalEntry = {
        date: new Date().toISOString(),
        content: transcript || title || "Video Journal Entry",
        time: recordingSeconds.toString(),
        type: "video" as const,
        videoUri,
        title: title || "Video Journal Entry",
      };

      handleAddJournal(journalEntry);

      // Check if this is the first journal overall or a milestone journal
      const totalJournals = journals.length;
      const isFirstJournal = totalJournals === 0;
      const isMilestoneJournal =
        totalJournals > 0 && (totalJournals + 1) % 5 === 0;

      if (isFirstJournal || isMilestoneJournal) {
        const encouragement = getRandomJournalEncouragement(isFirstJournal);
        setEncouragementData(encouragement);
        setShowEncouragement(true);
      } else {
        // Navigate back to journal list if no encouragement modal
        router.back();
      }

      setVideoUri(null);
      setTitle("");
      setTranscript("");
      setRecordingSeconds(0);
      setLastVideoDuration(null);

      if (!reviewRequested) {
        await CheckReview();
        setReviewRequested(true);
      }
    }
  };

  const handleDiscardVideo = () => {
    setVideoUri(null);
    setTitle("");
    setTranscript("");
    setRecordingSeconds(0);
    setLastVideoDuration(null);
  };

  const handleCloseEncouragement = () => {
    setShowEncouragement(false);
    setEncouragementData(null);
    router.back();
  };

  return (
    <Container>
      <View style={{ paddingBottom: insets.bottom, flex: 1 }}>
        <View className="mb-10">
          {/* Centered Private View */}
          <View
            style={{
              position: "absolute",
              top: 0,
              alignSelf: "center",
              zIndex: 1,
            }}
            className="bg-light-secondary border border-light-primary flex-row items-center gap-2 dark:bg-dark-secondary px-2 py-1 rounded-full"
          >
            <FontAwesome
              name="lock"
              size={20}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
            <Text className="font-inter-semibold text-light-primary dark:text-dark-primary">
              Private
            </Text>
          </View>
          {/* Back Button */}
          <TouchableOpacity
            style={{ position: "absolute", left: 0, top: 0, zIndex: 2 }}
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
        </View>
        <View className="flex-1 min-h-96">
          {videoUri ? (
            <View className="items-center justify-center flex-1">
              <Text className="mb-4 font-inter-bold text-xl text-light-primary dark:text-dark-primary">
                Journal recorded!
              </Text>
              <Pressable
                className="bg-light-primary w-full items-center justify-center dark:bg-dark-accent p-4 rounded-lg mb-2"
                onPress={handleSaveVideo}
              >
                <Text className="text-light-background font-inter-bold text-base dark:text-dark-background">
                  Save
                </Text>
              </Pressable>
              <Pressable
                className="bg-light-secondary w-full items-center justify-center dark:bg-dark-secondary p-4 rounded-lg"
                onPress={handleDiscardVideo}
              >
                <Text className="text-light-primary font-inter-bold text-base dark:text-dark-primary">
                  Discard
                </Text>
              </Pressable>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                marginTop: 10,
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <CameraView
                style={{ flex: 1, borderRadius: 16, overflow: "hidden" }}
                ref={cameraRef}
                facing={cameraType}
                mode="video"
                enableTorch={false}
                onCameraReady={() => {
                  // Camera ready
                }}
              />
              <Pressable
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 24,
                  padding: 8,
                  zIndex: 10,
                }}
                onPress={() =>
                  setCameraType((prev) => (prev === "front" ? "back" : "front"))
                }
                accessibilityLabel="Switch camera"
              >
                <Ionicons name="camera-reverse" size={28} color="#fff" />
              </Pressable>
            </View>
          )}
        </View>
        {!videoUri && (
          <View className="mt-4 flex-1">
            <View className="flex-row self-end bg-white dark:bg-dark-secondary px-4 py-2 rounded-lg items-center gap-1">
              <Ionicons
                name="time-outline"
                size={18}
                color={colorScheme === "dark" ? "white" : "#2f2d51"}
              />
              <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
                {isRecording
                  ? formatTime(recordingSeconds)
                  : lastVideoDuration !== null
                  ? formatTime(lastVideoDuration)
                  : "00:00"}
              </Text>
            </View>

            <View className="mt-auto items-center gap-4">
              {isRecording ? (
                <View className="w-full">
                  <Text className="font-inter-semibold text-lg text-center text-balance text-light-primary dark:text-dark-primary mb-2">
                    {isTranscribing ? "Listening..." : "Recording..."}
                  </Text>
                  {transcript ? (
                    <View className="bg-light-secondary dark:bg-dark-secondary p-4 rounded-xl h-16 max-h-16">
                      <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                      >
                        <Text className="font-inter-medium text-sm text-light-primary dark:text-dark-primary">
                          {transcript}
                        </Text>
                      </ScrollView>
                    </View>
                  ) : (
                    <Text className="font-inter-medium text-sm text-center text-light-primary/60 dark:text-dark-primary/60">
                      Start speaking your prayer...
                    </Text>
                  )}
                </View>
              ) : (
                <Text className="font-inter-semibold text-lg text-center text-balance text-light-primary dark:text-dark-primary">
                  {randomQuestion}
                </Text>
              )}
              {!videoUri && (
                <Pressable
                  className={`size-16 ${
                    isRecording ? "bg-red-500" : "bg-white"
                  } border border-gray-200 items-center justify-center rounded-full`}
                  onPress={handleRecordPress}
                >
                  <View
                    className={`w-3/4 h-3/4 rounded-full ${
                      isRecording ? "bg-white" : "bg-red-500"
                    }`}
                  />
                </Pressable>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Encouragement Modal */}
      <EncouragementModal
        visible={showEncouragement && encouragementData !== null}
        onClose={handleCloseEncouragement}
        actualTheme={null}
        colorScheme={colorScheme!}
        message={encouragementData?.message || ""}
        verse={encouragementData?.verse || { text: "", reference: "" }}
      />
    </Container>
  );
};

export default NewJournal;
