import {
  Image,
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
// import { supabase } from "../lib/supabase";
import { Button, Input } from "react-native-elements";
import { useEffect } from "react";
import { Session } from "@supabase/supabase-js";
// import { googleSignIn } from "../lib/googleSignIn";
const Community2 = () => {
  const theme = useSelector((state) => state.user.theme);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, getGoogleOAuthUrl, isLoggedIn, session, setOAuthSession } =
    useSupabase();
  console.log("session :", session);
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const onSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const url = await getGoogleOAuthUrl();
      if (!url) return;
      console.log(url);
      const result = await WebBrowser.openAuthSessionAsync(
        url,
        "exp://192.168.1.110:19000",
        {
          showInRecents: true,
        }
      );

      if (result.type === "success") {
        const data = extractParamsFromUrl(result.url);

        if (!data.access_token || !data.refresh_token) return;

        setOAuthSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        // You can optionally store Google's access token if you need it later
        SecureStore.setItemAsync(
          "google-access-token",
          JSON.stringify(data.provider_token)
        );
      }
    } catch (error) {
      // Handle error here
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const extractParamsFromUrl = (url) => {
    const params = new URLSearchParams(url.split("#")[1]);
    const data = {
      access_token: params.get("access_token"),
      expires_in: parseInt(params.get("expires_in") || "0"),
      refresh_token: params.get("refresh_token"),
      token_type: params.get("token_type"),
      provider_token: params.get("provider_token"),
    };

    return data;
  };
  return (
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
        <Text style={theme == "dark" ? styles.welcomeDark : styles.welcome}>
          Welcome to Community
        </Text>
        <Text style={theme == "dark" ? styles.introDark : styles.intro}>
          A place to connect and pray for one another.
        </Text>
      </View>
      <Input
        label="Email"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize={"none"}
      />
      <Input
        label="Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize={"none"}
      />
      <TouchableOpacity
        onPress={onSignInWithGoogle}
        style={theme == "dark" ? styles.signInButtonDark : styles.signInButton}
      >
        <Text
          style={
            theme == "dark"
              ? { color: "white", fontFamily: "Inter-Medium" }
              : { color: "#2f2d51", fontFamily: "Inter-Medium" }
          }
        >
          Sign Up
        </Text>
        {/* <Image source={google} style={styles.googleIcon} /> */}
      </TouchableOpacity>
      <TouchableOpacity style={styles.guestButton}>
        <Text
          style={
            theme == "dark"
              ? {
                  color: "white",
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
          Sign in as guest
        </Text>
      </TouchableOpacity>
    </Container>
  );
};

export default Community2;

const styles = StyleSheet.create({
  guestButton: {
    marginTop: 10,
  },
  signInButtonDark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#212121",
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#93d8f8",
    paddingVertical: 13,
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
    fontSize: 15,
    fontFamily: "Inter-Regular",
    alignSelf: "center",
    color: "#cccccc",
  },
  intro: {
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
  googleIcon: {
    width: 25,
    height: 25,
  },
  imgContainer: {
    marginBottom: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
