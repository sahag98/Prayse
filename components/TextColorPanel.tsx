import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";
import ColorPicker, {
  colorKit,
  HueSlider,
  OpacitySlider,
  Panel1,
  PreviewText,
  Swatches,
} from "reanimated-color-picker";

import {
  setCustomAccentTxt,
  setCustomMainTxt,
  setCustomPrimaryTxt,
  setCustomSecondaryTxt,
} from "@redux/themeReducer";

export default function TextColorPanel({
  type,
  title,
}: {
  type: string;
  title: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const customSwatches = new Array(6)
    .fill("#fff")
    .map(() => colorKit.randomRgbColor().hex());

  const selectedColor = useSharedValue(customSwatches[0]);
  const backgroundColorStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor.value,
  }));

  const onColorSelect = (color: any) => {
    // "worklet";
    selectedColor.value = color.hex;

    console.log("hex: ", color.hex);

    switch (type) {
      case "maintxt":
        dispatch(setCustomMainTxt(color.hex));
        break;
      case "primarytxt":
        dispatch(setCustomPrimaryTxt(color.hex));
        break;
      case "secondarytxt":
        dispatch(setCustomSecondaryTxt(color.hex));
        break;
      case "accenttxt":
        dispatch(setCustomAccentTxt(color.hex));
        break;

      default:
        break;
    }
    // dispatch(setCustomBg(color.hex));
    // dispatch(setCustomBg(color.hex));
  };

  return (
    <>
      {type !== "primarytxt" &&
        type !== "secondarytxt" &&
        type !== "accenttxt" && (
          <Pressable
            className="rounded-lg bg-light-secondary w-full p-5"
            onPress={() => setShowModal(true)}
          >
            <Text
              style={{
                color: "#707070",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {title}
            </Text>
          </Pressable>
        )}
      {type !== "maintxt" && (
        <Pressable
          className="rounded-lg bg-light-secondary flex-1 p-5"
          onPress={() => setShowModal(true)}
        >
          <Text
            style={{
              color: "#707070",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {title}
          </Text>
        </Pressable>
      )}

      <Modal
        onRequestClose={() => setShowModal(false)}
        visible={showModal}
        animationType="slide"
      >
        <Animated.View style={[styles.container, backgroundColorStyle]}>
          <View style={styles.pickerContainer}>
            <ColorPicker
              value={selectedColor.value}
              sliderThickness={25}
              thumbSize={24}
              thumbShape="circle"
              onChange={onColorSelect}
              boundedThumb
            >
              <Panel1 style={styles.panelStyle} />
              <HueSlider style={styles.sliderStyle} />
              <OpacitySlider style={styles.sliderStyle} />
              <Swatches
                style={styles.swatchesContainer}
                swatchStyle={styles.swatchStyle}
                colors={customSwatches}
              />
              <View style={styles.previewTxtContainer}>
                <PreviewText style={{ color: "#707070" }} />
              </View>
            </ColorPicker>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={() => setShowModal(false)}
          >
            <Text style={{ color: "#707070", fontWeight: "bold" }}>Close</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  pickerContainer: {
    alignSelf: "center",
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  panelStyle: {
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,
    marginTop: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  previewTxtContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#bebdbe",
  },
  swatchesContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#bebdbe",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  openButton: {
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    bottom: 10,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignSelf: "center",
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
