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
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Container } from "../styles/appStyles";
import { useSelector } from "react-redux";
import globe from "../assets/globe.png";
import google from "../assets/google-icon.png";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import CheckInboxModal from "../components/CheckInboxModal";
import { set } from "react-native-reanimated";

const Login = () => {
  const theme = useSelector((state) => state.user.theme);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkInbox, setCheckInbox] = useState(false);
  const { register, login } = useSupabase();
  const { getGoogleOAuthUrl, setOAuthSession } = useSupabase();
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
      visibilityTime: 4000,
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
                      color: "#d6d6d6",
                      width: "100%",
                      fontFamily: "Inter-Regular",
                      marginBottom: 10,
                      borderRadius: 10,
                    }
                  : {
                      backgroundColor: "#caecfc",
                      padding: 10,
                      fontFamily: "Inter-Regular",
                      width: "100%",
                      marginBottom: 10,
                      borderRadius: 10,
                    }
              }
              placeholder="Enter Password"
            />

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
