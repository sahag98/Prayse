//@ts-nocheck

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { fetchLikes, fetchPraises } from "@functions/reactions/FetchReactions";
import { toggleLike, togglePraise } from "@functions/reactions/ToogleReactions";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { cn } from "@lib/utils";

const BottomModal = ({
  bottomSheetModalRef,
  reactionChannel,
  currentUser,
  supabase,
  handlePresentModalPress,
  setPrayerToReact,
  prayerToReact,
}: any) => {
  const [likes, setLikes] = useState();
  const [praises, setPraises] = useState();
  const [isLiking, setIsLiking] = useState(false);
  const [isPraising, setIsPraising] = useState(false);
  const [isLoadingReactions, setIsLoadingReactions] = useState(false);
  useEffect(() => {
    async function Load() {
      if (prayerToReact) {
        try {
          setIsLoadingReactions(true);

          const likesArray = await fetchLikes(prayerToReact?.id, supabase);
          const praisesArray = await fetchPraises(prayerToReact?.id, supabase);
          setLikes(likesArray);
          setPraises(praisesArray);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingReactions(false);
        }
      }
    }
    Load();
  }, [prayerToReact, isLiking, isPraising]);
  // ref
  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);

    if (index === -1) {
      setPrayerToReact(null);
    }
  }, []);

  const isLikedByMe = !!likes?.find((like) => like.user_id === currentUser.id);
  const isPraisedByMe = !!praises?.find(
    (praise) => praise.user_id === currentUser.id,
  );

  // renders
  return (
    <BottomSheetModalProvider>
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetView className="flex-1 bg-white gap-3 p-4">
            <View className="flex-row items-center gap-2">
              <Image
                className="size-10"
                source={{
                  uri: prayerToReact?.profiles?.avatar_url
                    ? prayerToReact?.profiles?.avatar_url
                    : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
                }}
              />
              <Text className="font-inter font-bold text-lg text-light-primary dark:text-dark-background">
                {prayerToReact?.profiles?.full_name}
              </Text>
            </View>
            <Text className="font-inter text-light-primary dark:text-dark-background">
              {prayerToReact?.message}
            </Text>
            {isLoadingReactions ? (
              <ActivityIndicator className="self-start" />
            ) : (
              <View className="flex-row items-center gap-4">
                <TouchableOpacity
                  disabled={isLikedByMe}
                  onPress={() => {
                    toggleLike(
                      prayerToReact.id,
                      prayerToReact.profiles.expoToken,
                      prayerToReact.message,
                      supabase,
                      setLikes,
                      likes,
                      currentUser.id,
                      reactionChannel,
                    );
                    setIsLiking(true);
                  }}
                  className={cn(
                    "bg-gray-100 items-center flex-row gap-2 px-3 py-2 rounded-xl",
                    isLikedByMe && "bg-green-300",
                  )}
                >
                  <Text className="font-inter">🙏</Text>
                  <AntDesign
                    name={isLikedByMe ? "check" : "pluscircleo"}
                    size={18}
                    color="#2f2d51"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isPraisedByMe}
                  onPress={() =>
                    togglePraise(
                      prayerToReact.id,
                      prayerToReact.profiles.expoToken,
                      prayerToReact.message,
                      supabase,
                      setPraises,
                      praises,
                      currentUser.id,
                      reactionChannel,
                    )
                  }
                  className={cn(
                    "bg-gray-100 items-center flex-row gap-2 px-3 py-2 rounded-xl",
                    isPraisedByMe && "bg-green-300",
                  )}
                >
                  <Text className=" font-inter">🙌</Text>
                  <AntDesign
                    name={isPraisedByMe ? "check" : "pluscircleo"}
                    size={18}
                    color="#2f2d51"
                  />
                </TouchableOpacity>
              </View>
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default BottomModal;
