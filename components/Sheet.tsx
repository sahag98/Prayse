import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const Sheet = () => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <BottomSheetModalProvider>
      <View>
        <TouchableOpacity onPress={handlePresentModalPress}>
          <Text>What's New!</Text>
        </TouchableOpacity>
        {/* <Button
          onPress={handlePresentModalPress}
          title="What's new!"
          color="black"
        /> */}
        <BottomSheetModal
          contentHeight={600}
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     padding: 24,
  //     justifyContent: "center",
  //     backgroundColor: "grey",
  //   },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default Sheet;
