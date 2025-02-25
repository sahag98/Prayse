// import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Camera,
//   CameraType,
//   CameraView,
//   useCameraPermissions,
// } from "expo-camera";
// import TextRecognition from "@react-native-ml-kit/text-recognition";
// const CameraScreen = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [imageUri, setImageUri] = useState(null);
//   const cameraRef = useRef<CameraView>(null);
//   const [uri, setUri] = useState<string | null>(null);
//   const [facing, setFacing] = useState<CameraType>("back");
//   const [permission, requestPermission] = useCameraPermissions();
//   if (!permission) {
//     // Camera permissions are still loading.
//     return <View />;
//   }

//   if (!permission.granted) {
//     // Camera permissions are not granted yet.
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to show the camera
//         </Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }
//   //   useEffect(() => {
//   //     (async () => {
//   //       const { status } = await Camera.requestCameraPermissionsAsync();
//   //       setHasPermission(status === true);
//   //     })();
//   //   }, []);

//   //   const takePicture = async () => {
//   //     if (cameraRef.current) {
//   //       const photo = await cameraRef.current.takePictureAsync();
//   //       setImageUri(photo.uri);
//   //       processImage(photo.uri);
//   //     }
//   //   };

//   function toggleCameraFacing() {
//     setFacing((current) => (current === "back" ? "front" : "back"));
//   }

//   const takePicture = async () => {
//     const photo = await cameraRef.current?.takePictureAsync();
//     setUri(photo?.uri ?? null);

//     console.log("uri: ", photo?.uri);
//     if (photo?.uri) processImage(photo?.uri);
//   };

//   const processImage = async (uri: string) => {
//     try {
//       const result = await TextRecognition.recognize(uri);
//       console.log("Extracted Prayer:", result.text);
//       // Save prayer in state or database
//     } catch (error) {
//       console.error("OCR Error:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView
//         autofocus="on"
//         ref={cameraRef}
//         style={styles.camera}
//         facing={facing}
//       >
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//             <Text style={styles.text}>Flip Camera</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.button} onPress={takePicture}>
//             <Text style={styles.text}>Take Picture</Text>
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// };

// export default CameraScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   message: {
//     textAlign: "center",
//     paddingBottom: 10,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "transparent",
//     margin: 64,
//   },
//   button: {
//     flex: 1,
//     alignSelf: "flex-end",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
// });
