import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { Container } from "@components/Container";
import { router } from "expo-router";
import Moment from "moment";
import {
  AntDesign,
  Feather,
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AddAnonymousPrayerModal from "@modals/add-anon-prayer";
import { useSupabase } from "@context/useSupabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMainTextColorStyle } from "@lib/customStyles";
import axios from "@node_modules/axios";
import { ANON_SCREEN } from "@routes";
import { cn } from "@lib/utils";
const AnonymousScreen = () => {
  const { colorScheme } = useColorScheme();
  const [isAddingPrayer, setIsAddingPrayer] = useState(false);
  const { currentUser, supabase } = useSupabase();
  const prayerBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["anonprayers"],
    queryFn: getAnonymousPrayers,
  });
  async function getAnonymousPrayers() {
    const { data, error } = await supabase
      .from("anonymous")
      .select("*, profiles(*)")
      .order("id", { ascending: false });

    return data as [];
  }

  async function incrementPrayer(id: string) {
    const { data: currentData, error: fetchError } = await supabase
      .from("anonymous")
      .select("prayers, profiles(*)")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error(fetchError);
      return;
    }

    if (currentData.profiles && currentData.profiles.expoToken) {
      const message = {
        to: currentData.profiles.expoToken,
        sound: "default",
        title: `${currentData.title} 🙏`,
        body: `Someone prayed for you!`,
        data: {
          screen: ANON_SCREEN,
        },
      };
      await axios.post("https://exp.host/--/api/v2/push/send", message, {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      });
    }

    // Step 2: Increment and update
    const { data, error } = await supabase
      .from("anonymous")
      .update({ prayers: currentData.prayers + 1 })
      .eq("id", id);

    queryClient.invalidateQueries({ queryKey: ["anonprayers"] });
  }

  return (
    <Container>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <AntDesign
          name="left"
          size={30}
          color={colorScheme == "dark" ? "white" : "#2f2d51"}
        />
      </TouchableOpacity>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="flex-1  gap-3 items-center justify-center">
            <Image
              source={require("@assets/prayse-transparent.png")}
              style={{
                tintColor: colorScheme === "dark" ? "white" : "#2f2d51",
                width: 120,
                height: 120,
              }}
            />
            <Text className="font-inter-semibold text-xl text-light-primary dark:text-dark-primary">
              Anonymous Prayers
            </Text>
            <Text className="font-inter-regular text-light-primary dark:text-dark-primary">
              Be the first one to start it off!
            </Text>
          </View>
        )}
        style={{
          marginTop: 20,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 10,
        }}
        renderItem={({ item }: { item: any }) => (
          <View className=" gap-4 bg-light-secondary dark:bg-dark-secondary rounded-lg p-4 justify-between">
            <View className="flex-row items-center justify-between gap-2">
              {item.user_id ? (
                <Text className="text-light-primary dark:text-dark-primary font-inter-semibold">
                  {item.profiles.full_name}
                </Text>
              ) : (
                <Text className="text-light-primary dark:text-dark-primary font-inter-semibold">
                  {item.anon_name}
                </Text>
              )}

              <Text className="text-light-primary dark:text-dark-primary text-xs font-inter-regular">
                {Moment(item.created_at).fromNow()}
              </Text>
            </View>
            <Text className="text-light-primary dark:text-dark-primary font-inter-regular">
              {item.title}
            </Text>

            <View className="w-full border-b border-light-primary/15 dark:border-dark-primary/25" />

            <Pressable
              onPress={() => incrementPrayer(item.id)}
              className="flex-row self-start px-2 py-1 rounded-xl items-center gap-1"
            >
              <MaterialCommunityIcons
                name="hands-pray"
                size={18}
                color={
                  colorScheme === "dark"
                    ? item.prayers > 0
                      ? "#ff3333"
                      : "white"
                    : item.prayers > 0
                      ? "red"
                      : "#2f2d51"
                }
              />
              <Text
                className={cn(
                  "font-inter-medium",
                  item.prayers > 0
                    ? "text-red-500"
                    : "dark:text-dark-primary text-light-primary",
                )}
              >
                {item?.prayers}
              </Text>
            </Pressable>

            {/* <TouchableOpacity>
              <Feather name="heart" size={24} color="black" />
            </TouchableOpacity> */}
          </View>
        )}
      />
      <Pressable
        onPress={() => {
          // setIsAddingPrayer(true);

          prayerBottomSheetModalRef.current?.present();
        }}
        className="absolute bottom-10 right-4 size-20 items-center justify-center rounded-full bg-light-primary dark:bg-dark-accent"
      >
        <AntDesign
          name="plus"
          size={24}
          color={colorScheme === "dark" ? "#121212" : "white"}
        />
      </Pressable>
      <AddAnonymousPrayerModal
        supabase={supabase}
        colorScheme={colorScheme}
        currentUser={currentUser}
        setIsAddingPrayer={setIsAddingPrayer}
        prayerBottomSheetModalRef={prayerBottomSheetModalRef}
      />
    </Container>
  );
};

export default AnonymousScreen;

const styles = StyleSheet.create({});
