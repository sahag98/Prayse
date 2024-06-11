import React, { useEffect } from "react";
import {
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { HeaderTitle } from "../styles/appStyles";

const DevoItem = ({
  devo,
  isFocused,
  tbf,
  currentUser,
  refresh,
  setChannel,
  fetchLikes,
  fetchReflections,
  loadDevotionals,
  supabase,
  theme,
  refreshReflections,
}) => {
  useEffect(() => {
    fetchLikes(devo.title);
    fetchReflections(devo.title);
    /**
     * Step 1:
     *
     * Create the supabase channel for the roomCode, configured
     * so the channel receives its own messages
     */
    const channel = supabase.channel(`room:${devo.title}`, {
      config: {
        broadcast: {
          self: true,
        },
        presence: {
          key: devo.title,
        },
      },
    });

    /**
     * Step 2:
     *
     * Listen to broadcast messages with a `message` event
     */
    channel.on("broadcast", { event: "message" }, ({ payload }) => {
      fetchLikes(payload.devo_title);
    });

    /**
     * Step 3:
     *
     * Subscribe to the channel
     */
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.track({ currentUser });
      }
    });

    /**
     * Step 4:
     *
     * Set the channel in the state
     */
    setChannel(channel);

    /**
     * * Step 5:
     *
     * Return a clean-up function that unsubscribes from the channel
     * and clears the channel state
     */
    return () => {
      channel.unsubscribe();
      setChannel(undefined);
    };
  }, [currentUser?.id, devo.title, refreshReflections, isFocused]);

  function switchDateFormat(dateString) {
    const dateParts = dateString.split("-");

    const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;

    return formattedDate;
  }

  // Example usage

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={loadDevotionals} />
      }
      showsVerticalScrollIndicator={false}
      key={devo._id}
    >
      <HeaderTitle
        style={
          theme === "dark"
            ? {
                fontFamily: "Inter-Black",
                marginTop: 0,
                letterSpacing: 1,
                marginBottom: 15,
                fontSize: 24,
                color: "white",
              }
            : {
                fontFamily: "Inter-Black",
                letterSpacing: 1,
                marginTop: 0,
                fontSize: 24,
                marginBottom: 15,
                color: "#2F2D51",
              }
        }
      >
        {devo.title}
      </HeaderTitle>
      <Text
        style={theme === "dark" ? styles.descriptionDark : styles.description}
      >
        {devo.description}
      </Text>

      <View>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://triedbyfire.substack.com?utm_source=navbar&utm_medium=web",
            )
          }
          style={{
            marginVertical: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ gap: 2 }}>
            <Text style={theme === "dark" ? styles.ownerDark : styles.owner}>
              TRIED BY FIRE
            </Text>
            <Text
              style={
                theme === "dark"
                  ? {
                      color: "#d6d6d6",
                      fontSize: 13,
                      fontFamily: "Inter-Regular",
                    }
                  : {
                      color: "#2f2d51",
                      fontSize: 13,
                      fontFamily: "Inter-Regular",
                    }
              }
            >
              {switchDateFormat(devo.date)}
            </Text>
          </View>
          <Image style={styles.img} source={tbf} />
        </TouchableOpacity>
        <View
          style={
            theme === "dark"
              ? {
                  marginTop: 5,
                  marginBottom: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: "#A5C9FF",
                  paddingHorizontal: 10,
                }
              : {
                  marginTop: 5,
                  marginBottom: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: "#ffcd8b",
                  paddingHorizontal: 10,
                }
          }
        >
          <Text
            style={
              theme === "dark"
                ? {
                    color: "#efefef",
                    marginLeft: 3,
                    lineHeight: 25,
                    fontSize: 15,
                    fontFamily: "Inter-Regular",
                  }
                : {
                    color: "#2f2d51",
                    marginLeft: 3,
                    lineHeight: 25,
                    fontSize: 15,
                    fontFamily: "Inter-Regular",
                  }
            }
          >
            {devo.verse}
          </Text>
        </View>
      </View>

      <Text style={theme === "dark" ? styles.dayDark : styles.day}>
        {devo.day}
      </Text>
      <Text style={theme === "dark" ? styles.contentDark : styles.content}>
        {devo.content}
      </Text>
    </ScrollView>
  );
};

export default DevoItem;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#93D8F8",
    borderRadius: 10,
    color: "#2f2d51",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  imgContainer: {
    backgroundColor: "white",
    height: 180,
    width: 180,
    borderRadius: 100,
    marginVertical: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  refreshDark: {
    paddingVertical: 7,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  refresh: {
    paddingVertical: 7,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionDark: {
    color: "#d6d6d6",
    fontFamily: "Inter-Medium",
    fontSize: 16,
    marginBottom: 15,
  },
  description: {
    color: "#2F2D51",
    fontFamily: "Inter-Medium",
    fontSize: 16,
    marginBottom: 15,
  },
  ownerDark: {
    color: "#d6d6d6",
    fontFamily: "Inter-Bold",
  },
  owner: {
    color: "#2F2D51",
    fontFamily: "Inter-Bold",
  },
  dayDark: {
    color: "white",
    letterSpacing: 1,
    fontSize: 20,
    fontFamily: "Inter-Bold",
  },
  day: {
    color: "#2F2D51",
    letterSpacing: 1,
    fontSize: 20,
    fontFamily: "Inter-Bold",
  },
  contentDark: {
    color: "#f9f9f9",
    textAlign: "justify",
    fontSize: 15,
    lineHeight: 35,
    fontFamily: "Inter-Regular",
    marginBottom: 70,
  },
  content: {
    color: "#2F2D51",
    fontSize: 15,
    fontFamily: "Inter-Regular",
    lineHeight: 35,
    marginBottom: 70,
  },
});
