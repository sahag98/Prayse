import React from "react";
import { StyleSheet, SafeAreaView, View, Pressable, Text } from "react-native";
import Animated, {
  withDelay,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// export default function App() {
//   const isExpanded = useSharedValue(false);

//   const handlePress = () => {
//     isExpanded.value = !isExpanded.value;
//   };

//   const plusIconStyle = useAnimatedStyle(() => {
//     // highlight-next-line
//     const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
//     const translateValue = withTiming(moveValue);
//     const rotateValue = isExpanded.value ? "45deg" : "0deg";

//     return {
//       transform: [
//         { translateX: translateValue },
//         { rotate: withTiming(rotateValue) },
//       ],
//     };
//   });

//   return (
//     <SafeAreaView>
//       <View style={styles.mainContainer}>
//         <View style={styles.buttonContainer}>
//           <AnimatedPressable
//             onPress={handlePress}
//             style={[styles.shadow, mainButtonStyles.button]}
//           >
//             <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
//               +
//             </Animated.Text>
//           </AnimatedPressable>
//           <FloatingActionButton
//             isExpanded={isExpanded}
//             index={1}
//             buttonLetter={"M"}
//           />
//           <FloatingActionButton
//             isExpanded={isExpanded}
//             index={2}
//             buttonLetter={"W"}
//           />
//           <FloatingActionButton
//             isExpanded={isExpanded}
//             index={3}
//             buttonLetter={"S"}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 56,
    width: 56,
    borderRadius: 100,
    backgroundColor: "red",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 24,
    color: "#f8f9ff",
  },
});

const styles = StyleSheet.create({
  mainContainer: {
    position: "relative",
    height: 260,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: "#2d22c8",
    position: "absolute",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -2,
    flexDirection: "row",
  },
  buttonContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    color: "#f8f9ff",
    fontWeight: 500,
  },
});
