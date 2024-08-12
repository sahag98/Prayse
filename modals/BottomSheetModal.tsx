import React, { useCallback, useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const BottomModal = ({
  bottomSheetModalRef,
  handlePresentModalPress,
  prayerToReact,
}: any) => {
  //   console.log(prayerToReact);
  // ref
  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  // callbacks

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <BottomSheetModalProvider>
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
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
            <View className="flex-row items-center gap-3">
              <TouchableOpacity className="bg-gray-100 items-center flex-row gap-2 px-2 py-1 rounded-xl">
                <Text className="font-inter">🙏</Text>
                <AntDesign name="pluscircleo" size={18} color="#2f2d51" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-gray-100 flex-row gap-2 items-center px-2 py-1 rounded-xl">
                <Text className=" font-inter">🙌</Text>
                <AntDesign name="pluscircleo" size={18} color="#2f2d51" />
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default BottomModal;
