import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSupabase } from "../context/useSupabase";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Container,
  ModalActionGroup,
  ModalContainer,
  ModalView,
} from "../styles/appStyles";
import { useSelector } from "react-redux";
import globe from "../assets/globe.png";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import { Modal } from "react-native";

const Login = () => {
  const theme = useSelector((state) => state.user.theme);
  const [forgotModal, setForgotModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, login, forgotPassword } = useSupabase();
  const [passVisible, setPassVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 5000,
    });
  };

  const SignUp = () => {
    if (email.length == 0 || password.length == 0) {
      showToast("error", "Email and password field can't be empty.");
      return;
    } else {
      register(email, password);
      setIsLoggingIn(true);
      // setCheckInbox(true);
    }
  };

  // const onSignInWithGoogle = async () => {
  //   setLoading(true);
  //   try {
  //     const url = await getGoogleOAuthUrl();
  //     if (!url) return;
  //     const result = await WebBrowser.openAuthSessionAsync(
  //       url,
  //       "prayseapp://google-auth",
  //       //exp://192.168.1.110:19000
  //       //prayseapp://google-auth
  //       {
  //         showInRecents: true,
  //       }
  //     );

  //     if (result.type === "success") {
  //       const data = extractParamsFromUrl(result.url);

  //       if (!data.access_token || !data.refresh_token) return;
  //       setOAuthSession({
  //         access_token: data.access_token,
  //         refresh_token: data.refresh_token,
  //       });

  //       // You can optionally store Google's access token if you need it later
  //       SecureStore.setItemAsync(
  //         "google-access-token",
  //         JSON.stringify(data.provider_token)
  //       );
  //     }
  //   } catch (error) {
  //     // Handle error here
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const extractParamsFromUrl = (url) => {
  //   const params = new URLSearchParams(url.split("#")[1]);
  //   const data = {
  //     access_token: params.get("access_token"),
  //     expires_in: parseInt(params.get("expires_in") || "0"),
  //     refresh_token: params.get("refresh_token"),
  //     token_type: params.get("token_type"),
  //     provider_token: params.get("provider_token"),
  //   };

  //   return data;
  // };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Container
        style={
          theme == "dark"
            ? {
                backgroundColor: "#121212",
                justifyContent: "center",
                alignItems: "center",
              }
            : {
                backgroundColor: "#F2F7FF",
                justifyContent: "center",
                alignItems: "center",
              }
        }
      >
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={globe} />
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.freepik.com/")}
          >
            <Text
              style={
                theme == "dark"
                  ? {
                      fontSize: 10,
                      fontFamily: "Inter-Regular",
                      color: "white",
                    }
                  : { fontSize: 10, fontFamily: "Inter-Regular" }
              }
            >
              Designed by{" "}
              <Text
                style={{
                  fontSize: 12,
                  color: "#3b3bff",
                  fontFamily: "Inter-Bold",
                }}
              >
                freepik
              </Text>
            </Text>
          </TouchableOpacity>
          <Text style={theme == "dark" ? styles.welcomeDark : styles.welcome}>
            Welcome to Community
          </Text>
          <Text style={theme == "dark" ? styles.introDark : styles.intro}>
            A place to connect and pray for one another.
          </Text>
        </View>
        {isLoggingIn && (
          <>
            <TextInput
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#a3a3a3"}
              value={email}
              blurOnSubmit={true}
              style={
                theme == "dark"
                  ? {
                      backgroundColor: "#212121",
                      color: "#d6d6d6",
                      padding: 10,
                      width: "100%",
                      marginBottom: 10,
                      fontFamily: "Inter-Regular",
                      borderRadius: 10,
                    }
                  : {
                      backgroundColor: "#caecfc",
                      padding: 10,
                      width: "100%",
                      fontFamily: "Inter-Regular",
                      marginBottom: 10,
                      borderRadius: 10,
                    }
              }
              placeholder="Enter Email"
            />
            <View
              style={{
                width: "100%",
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => setPassVisible(!passVisible)}
                style={{
                  position: "absolute",
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  padding: 5,
                  zIndex: 99,
                }}
              >
                <Ionicons
                  name="eye-outline"
                  size={20}
                  style={{ marginBottom: 4, marginRight: 2 }}
                  color={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
                />
              </TouchableOpacity>
              <TextInput
                cursorColor={theme == "dark" ? "white" : "#2f2d51"}
                onChangeText={(text) => setPassword(text)}
                value={password}
                autoCapitalize="none"
                blurOnSubmit={true}
                secureTextEntry={!passVisible}
                placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#a3a3a3"}
                style={
                  theme == "dark"
                    ? {
                        backgroundColor: "#212121",
                        padding: 10,
                        color: "#d6d6d6",
                        width: "100%",
                        fontFamily: "Inter-Regular",
                        marginBottom: 5,
                        borderRadius: 10,
                      }
                    : {
                        backgroundColor: "#caecfc",
                        padding: 10,
                        fontFamily: "Inter-Regular",
                        width: "100%",
                        marginBottom: 5,
                        borderRadius: 10,
                      }
                }
                placeholder="Enter Password"
              />
            </View>
            <TouchableOpacity
              onPress={() => setForgotModal(true)}
              style={{
                alignSelf: "flex-end",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#ff6262", fontSize: 13 }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={forgotModal}
              onRequestClose={() => setForgotModal(false)}
              statusBarTranslucent={true}
              // onShow={() => inputRef.current?.focus()}
            >
              <ModalContainer
                style={
                  theme == "dark"
                    ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                    : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                }
              >
                <ModalView
                  style={
                    theme == "dark"
                      ? { backgroundColor: "#121212", width: "100%" }
                      : { backgroundColor: "#93D8F8" }
                  }
                >
                  <Text
                    style={
                      theme == "dark"
                        ? {
                            color: "white",
                            fontFamily: "Inter-Regular",
                            textAlign: "center",
                          }
                        : {
                            color: "#2f2d51",
                            fontFamily: "Inter-Regular",
                            textAlign: "center",
                          }
                    }
                  >
                    Password recovery has not been implemented yet. Contact
                    Developer to reset your account.
                  </Text>

                  <ModalActionGroup>
                    {/* <ModalAction color={"white"} onPress={{}}>
                      <Text>Close</Text>
                    </ModalAction> */}
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL("mailto:arzsahag@gmail.com")
                      }
                      style={
                        theme == "dark"
                          ? {
                              backgroundColor: "#A5C9FF",
                              width: "100%",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 15,
                              borderRadius: 10,
                            }
                          : {
                              backgroundColor: "#2f2d51",
                              width: "100%",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 15,
                              borderRadius: 10,
                            }
                      }
                    >
                      <MaterialCommunityIcons
                        name="email-edit-outline"
                        style={{ marginRight: 10 }}
                        size={24}
                        color={theme == "dark" ? "#121212" : "white"}
                      />
                      <Text
                        style={
                          theme == "dark"
                            ? { color: "#121212", fontFamily: "Inter-SemiBold" }
                            : { color: "white", fontFamily: "Inter-SemiBold" }
                        }
                      >
                        Contact Developer
                      </Text>
                    </TouchableOpacity>
                  </ModalActionGroup>
                </ModalView>
              </ModalContainer>
            </Modal>
            <TouchableOpacity
              onPress={() => {
                login(email, password);
                setEmail("");
                setPassword("");
              }}
              style={
                theme == "dark" ? styles.signInButtonDark : styles.signInButton
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? { color: "#212121", fontFamily: "Inter-Medium" }
                    : { color: "#2f2d51", fontFamily: "Inter-Medium" }
                }
              >
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsLoggingIn(false)}
              style={
                theme == "dark" ? styles.signUpButtonDark : styles.signUpButton
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#A5C9FF",
                        textDecorationLine: "underline",
                        fontFamily: "Inter-Medium",
                      }
                    : {
                        color: "#2f2d51",
                        textDecorationLine: "underline",
                        fontFamily: "Inter-Medium",
                      }
                }
              >
                Don't have an account yet? Sign up.
              </Text>
            </TouchableOpacity>
          </>
        )}
        {!isLoggingIn && (
          <>
            <TextInput
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#a3a3a3"}
              value={email}
              blurOnSubmit={true}
              style={
                theme == "dark"
                  ? {
                      backgroundColor: "#212121",
                      padding: 10,
                      width: "100%",
                      fontFamily: "Inter-Regular",
                      marginBottom: 10,
                      borderRadius: 10,
                    }
                  : {
                      backgroundColor: "#caecfc",
                      padding: 10,
                      width: "100%",
                      fontFamily: "Inter-Regular",
                      marginBottom: 10,
                      borderRadius: 10,
                    }
              }
              placeholder="Enter Email"
            />

            <TextInput
              onChangeText={(text) => setPassword(text)}
              value={password}
              blurOnSubmit={true}
              secureTextEntry={true}
              placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#a3a3a3"}
              style={
                theme == "dark"
                  ? {
                      backgroundColor: "#212121",
                      padding: 10,
                      width: "100%",
                      fontFamily: "Inter-Regular",
                      marginBottom: 10,
                      borderRadius: 10,
                    }
                  : {
                      backgroundColor: "#caecfc",
                      padding: 10,
                      width: "100%",
                      fontFamily: "Inter-Regular",
                      marginBottom: 10,
                      borderRadius: 10,
                    }
              }
              placeholder="Enter Password"
            />

            <TouchableOpacity
              onPress={SignUp}
              style={
                theme == "dark"
                  ? [styles.signInButtonDark, { backgroundColor: "#f1d592" }]
                  : [styles.signInButton, { backgroundColor: "#2f2d51" }]
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? { color: "#212121", fontFamily: "Inter-Medium" }
                    : { color: "white", fontFamily: "Inter-Medium" }
                }
              >
                Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsLoggingIn(true)}
              style={
                theme == "dark" ? styles.signUpButtonDark : styles.signUpButton
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#A5C9FF",
                        textDecorationLine: "underline",
                        fontFamily: "Inter-Medium",
                      }
                    : {
                        color: "#2f2d51",
                        textDecorationLine: "underline",
                        fontFamily: "Inter-Medium",
                      }
                }
              >
                Already have an account? Sign in.
              </Text>
            </TouchableOpacity>
          </>
        )}
        <Text style={theme == "dark" ? styles.anonDark : styles.anon}>
          You can ensure anonymity by enabling it upon signing in on the profile
          settings page.
        </Text>
      </Container>
      {/* <CheckInboxModal checkInbox={checkInbox} setCheckInbox={setCheckInbox} /> */}
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  anonDark: {
    marginTop: 15,
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#cccccc",
  },
  anon: {
    marginTop: 15,
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#5b579d",
  },
  signInButtonDark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#A5C9FF",
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  signUpButtonDark: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  signUpButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#93d8f8",
    paddingVertical: 13,
    width: "100%",
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  welcome: {
    fontSize: 20,
    marginTop: 15,
    fontFamily: "Inter-Bold",
    letterSpacing: 2,
    alignSelf: "center",
    color: "#2F2D51",
  },
  introDark: {
    marginTop: 2,
    fontSize: 15,
    fontFamily: "Inter-Regular",
    alignSelf: "center",
    color: "#cccccc",
  },
  intro: {
    marginTop: 2,
    fontSize: 15,
    fontFamily: "Inter-Regular",
    alignSelf: "center",
    color: "#2f2d51",
  },
  welcomeDark: {
    marginTop: 15,
    fontSize: 20,
    fontFamily: "Inter-Bold",
    alignSelf: "center",
    letterSpacing: 2,
    color: "white",
  },
  img: {
    width: 200,
    height: 200,
  },

  imgContainer: {
    marginBottom: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
