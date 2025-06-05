import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { Container } from "@styles/appStyles";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
} from "@lib/customStyles";
import { useSelector } from "react-redux";
import { ActualTheme } from "../../types/reduxTypes";
import { router, useNavigation } from "expo-router";
import { QUESTION_SCREEN } from "@routes";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import ProfileModal from "@modals/ProfileModal";
import { useSupabase } from "@context/useSupabase";
import AddQuestionModal from "@modals/AddQuestionModal";

const screenWidth = Dimensions.get("window").width - 30;

const CarouselItem = ({
  currentUser,
  item,
  existingAnswers,
  index,
  scrollX,
}: {
  currentUser: any;
  item: any;
  index: number;
  existingAnswers: any;
  scrollX: Animated.SharedValue<number>;
}) => {
  const navigation = useNavigation();
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      "clamp",
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      "clamp",
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[{ width: screenWidth }, animatedStyle, styles.carouselItem]}
    >
      <Pressable
        onPress={() => {
          if (currentUser) {
            navigation.navigate(QUESTION_SCREEN, {
              title: item.title,
              question_id: item.id,
            });
          } else {
            router.replace("/login");
          }
        }}
        className="bg-light-secondary rounded-lg gap-4 justify-between w-full p-3"
      >
        <View className="flex-row items-center gap-2">
          <Image
            source={{ uri: item?.profiles.avatar_url }}
            style={{ width: 30, height: 30, borderRadius: 50 }}
          />
          <Text>{item.profiles?.full_name}</Text>
        </View>
        <View className="gap-4">
          <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
            {new Date(item.created_at).toDateString()}
          </Text>
          <Text className="font-inter-semibold text-2xl text-light-primary dark:text-dark-primary">
            {item.title}
          </Text>
        </View>
        <View className="flex-row items-center self-end gap-3">
          <Pressable className="bg-light-background p-1 rounded-lg">
            <Text className="text-sm">🙌</Text>
          </Pressable>
          <Pressable className="bg-light-background flex-row items-center gap-2 p-1 rounded-lg">
            <Text className="text-light-primary text-sm font-medium">
              {existingAnswers.length}
            </Text>
            <Ionicons name="chatbubble-outline" size={17} color="#2f2d51" />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const ExplorScreen = () => {
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  const navigation = useNavigation();
  const scrollX = useSharedValue(0);
  const { colorScheme } = useColorScheme();
  const [profileVisible, setProfileVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    currentUser,
    setCurrentUser,
    fetchTestQuestions,
    fetchQuestions,
    fetchAnswers,
    session,
    answers,
    questions,
    refreshMembers,
    fetchTestAnswers,
    setRefreshMembers,
    logout,
    supabase,
  } = useSupabase();

  const questionBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchQuestions();
    fetchAnswers();
    // fetchTestQuestions();
    // fetchTestAnswers();
  }, []);

  const getThisWeeksQuestions = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Set to start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to end of current week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);

    return questions.filter((question: { created_at: string }) => {
      const questionDate = new Date(question.created_at);
      return questionDate >= startOfWeek && questionDate <= endOfWeek;
    });
  };
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const thisWeeksQuestions = getThisWeeksQuestions();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (thisWeeksQuestions.length > 0) {
        const nextIndex = (activeIndex + 1) % thisWeeksQuestions.length;
        const nextOffset = nextIndex * screenWidth;

        flatListRef.current?.scrollToOffset({
          offset: nextOffset,
          animated: true,
        });

        setActiveIndex(nextIndex);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [activeIndex, thisWeeksQuestions.length]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const existingAnswers = answers.filter(
      (answer: any) => answer.question_id === item.id,
    );
    return (
      <CarouselItem
        currentUser={currentUser}
        existingAnswers={existingAnswers}
        item={item}
        index={index}
        scrollX={scrollX}
      />
    );
  };

  const popularQuestions = questions.slice().sort((a: any, b: any) => {
    const aAnswers = answers.filter(
      (answer: any) => answer.question_id === a.id,
    ).length;
    const bAnswers = answers.filter(
      (answer: any) => answer.question_id === b.id,
    ).length;
    return bAnswers - aAnswers;
  });

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      //@ts-ignore
      className="dark:bg-[#121212] bg-[#f2f7ff] flex-1"
    >
      {currentUser ? (
        <View className="flex-row items-center mb-3 justify-between">
          <View className="flex-row items-center gap-2">
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary"
            >
              Hey {currentUser?.full_name}
            </Text>
            <View>
              <MaterialCommunityIcons
                name="hand-wave"
                size={30}
                color="#ffe03b"
              />
            </View>
          </View>
          <ProfileModal
            logout={logout}
            setCurrentUser={setCurrentUser}
            actualTheme={actualTheme}
            colorScheme={colorScheme}
            supabase={supabase}
            profileVisible={profileVisible}
            user={currentUser}
            setProfileVisible={setProfileVisible}
          />

          <TouchableOpacity className="relative p-3 self-end ml-auto">
            <Image
              className="w-16 h-16 rounded-full"
              source={{
                uri: currentUser?.avatar_url
                  ? currentUser?.avatar_url
                  : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
              }}
            />
            <TouchableOpacity
              onPress={() => setProfileVisible(true)}
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              className="absolute bg-light-primary p-2 dark:bg-dark-accent rounded-full items-center justify-center bottom-1 right-1"
            >
              <Ionicons
                name="settings"
                size={17}
                color={
                  actualTheme && actualTheme.PrimaryTxt
                    ? actualTheme.PrimaryTxt
                    : colorScheme === "dark"
                      ? "#121212"
                      : "white"
                }
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row items-center mb-3 justify-between">
          <View className="flex-row items-center gap-2">
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary"
            >
              Hey
            </Text>
            <View>
              <MaterialCommunityIcons
                name="hand-wave"
                size={30}
                color="#ffe03b"
              />
            </View>
          </View>

          <Pressable
            onPress={() => router.replace("/login")}
            className="bg-light-primary rounded-lg p-4 dark:bg-dark-accent"
          >
            <Text className="font-inter-bold text-light-background dark:text-dark-background">
              Sign In
            </Text>
          </Pressable>
        </View>
      )}
      <Text className="font-inter-semibold text-light-primary dark:text-dark-primary text-2xl">
        Questions
      </Text>
      <View className="mt-5 gap-3">
        <Text className="font-inter-semibold text-light-primary text-xl dark:text-dark-primary">
          This Week
        </Text>
        {thisWeeksQuestions.length > 0 ? (
          <Animated.FlatList
            ref={flatListRef}
            data={thisWeeksQuestions}
            horizontal
            pagingEnabled
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            // ListEmptyComponent={() => (
            //   <View className="items-center justify-center w-full bg-red-200">
            //     <Text>Empty</Text>
            //   </View>
            // )}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            snapToInterval={screenWidth}
            decelerationRate="normal"
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth,
              );
              setActiveIndex(index);
            }}
          />
        ) : (
          <View className="justify-center items-center gap-3 py-5">
            <Text className="font-inter-semibold text-light-primary dark:text-dark-primary">
              Nothing yet for this week!
            </Text>
          </View>
        )}
        <View className="justify-center flex-row gap-2">
          {thisWeeksQuestions.map((item: any, index: number) => (
            <View
              key={index}
              className={`size-3 rounded-full ${
                index === activeIndex
                  ? "bg-light-primary dark:bg-white"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </View>
      </View>
      <View className="gap-3 mt-5 flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="font-inter-semibold text-light-primary text-xl dark:text-dark-primary">
            Popular
          </Text>
          <Pressable onPress={() => router.push("/question-list")}>
            <Text className="font-inter-bold underline text-light-primary dark:text-dark-primary">
              View All
            </Text>
          </Pressable>
        </View>
        <FlatList
          style={{ marginBottom: 20 }}
          contentContainerStyle={{ gap: 8 }}
          showsVerticalScrollIndicator={false}
          data={popularQuestions}
          ListFooterComponent={() => <View className="h-24" />}
          renderItem={({ item }) => {
            const existingAnswers = answers.filter(
              (answer: any) => answer.question_id === item.id,
            );
            return (
              <Pressable
                onPress={() => {
                  if (currentUser) {
                    navigation.navigate(QUESTION_SCREEN, {
                      title: item.title,
                      question_id: item.id,
                    });
                  } else {
                    router.replace("/login");
                  }
                }}
                className="bg-light-secondary dark:bg-dark-secondary rounded-lg gap-2 justify-between w-full p-3"
              >
                {item.profiles ? (
                  <View className="flex-row items-center gap-2">
                    <Image
                      source={{ uri: item.profiles?.avatar_url }}
                      style={{ width: 30, height: 30, borderRadius: 50 }}
                    />
                    <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
                      {item.profiles?.full_name}
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
                      Prayse
                    </Text>
                  </View>
                )}

                <View className="gap-2">
                  <Text className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary">
                    {item.title}
                  </Text>
                </View>
                <View className="flex-row items-center self-end gap-3">
                  <Pressable className="bg-light-background border-none dark:border dark:border-[#616161] dark:bg-dark-background flex-row items-center gap-2 px-2 py-1 rounded-lg">
                    <Text className="text-light-primary dark:text-dark-primary text-sm font-medium">
                      {existingAnswers.length}
                    </Text>
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color={colorScheme === "dark" ? "white" : "#2f2d51"}
                    />
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </View>

      <Pressable
        onPress={() => {
          setIsAddingQuestion(true);
          questionBottomSheetModalRef.current?.present();
        }}
        className="absolute bottom-5 right-4 size-20 items-center justify-center rounded-full bg-light-primary dark:bg-dark-accent"
      >
        <FontAwesome
          name="pencil-square-o"
          size={30}
          color={
            actualTheme && actualTheme.PrimaryTxt
              ? actualTheme.PrimaryTxt
              : colorScheme === "dark"
                ? "#121212"
                : "white"
          }
        />
      </Pressable>
      <AddQuestionModal
        actualTheme={actualTheme}
        supabase={supabase}
        colorScheme={colorScheme}
        currentUser={currentUser}
        setIsAddingQuestion={setIsAddingQuestion}
        questionBottomSheetModalRef={questionBottomSheetModalRef}
      />
      {/* <View className="flex-row w-full gap-3 items-center">
        <Link asChild className="w-full" href={`/${QUESTION_LIST_SCREEN}`}>
          <TouchableOpacity
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="flex-1 justify-between relative p-3 gap-5 rounded-lg bg-light-secondary dark:bg-dark-secondary"
          >
            <View className="flex-row justify-between items-center">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-xl text-light-primary dark:text-dark-primary"
              >
                Questions
              </Text>
              <MaterialCommunityIcons
                name="frequently-asked-questions"
                size={24}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </View>
            <View className="gap-3">
              <Text
                className="font-inter-medium leading-6 text-light-primary dark:text-dark-primary"
                style={getSecondaryTextColorStyle(actualTheme)}
              >
                Weekly biblical questions to answer and reflect on.
              </Text>
              <Link
                asChild
                className="w-full"
                href={`/${QUESTION_LIST_SCREEN}`}
              >
                <TouchableOpacity
                  style={getPrimaryBackgroundColorStyle(actualTheme)}
                  className="flex-row items-center rounded-md justify-center w-full p-3 bg-light-primary dark:bg-dark-accent"
                >
                  <Text
                    style={getPrimaryTextColorStyle(actualTheme)}
                    className="font-inter-bold text-lg text-light-background dark:text-dark-background"
                  >
                    View
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </TouchableOpacity>
        </Link>
      </View> */}
    </Container>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ExplorScreen;
