import React, { useEffect } from "react";
import {
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { HeaderTitle } from "../styles/appStyles";
import { getMainTextColorStyle } from "@lib/customStyles";

const DevoItem = ({
  actualTheme,
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
        style={getMainTextColorStyle(actualTheme)}
        className="font-inter-bold tracking-wider mb-4 text-xl text-light-primary dark:text-dark-primary"
      >
        {devo.title}
      </HeaderTitle>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
      >
        {devo.description}
      </Text>

      <View>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://triedbyfire.substack.com?utm_source=navbar&utm_medium=web"
            )
          }
          className="my-3 flex-row items-center justify-between"
        >
          <View className="gap-1">
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-semibold text-light-primary dark:text-dark-primary"
            >
              TRIED BY FIRE
            </Text>
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-regular text-sm text-light-primary dark:text-[#d6d6d6]"
            >
              {switchDateFormat(devo.date)}
            </Text>
          </View>
          <Image className="w-14 h-14 rounded-full" source={tbf} />
        </TouchableOpacity>
        <View
          style={
            actualTheme &&
            actualTheme.Secondary && { borderLeftColor: actualTheme.Secondary }
          }
          className="mt-2 mb-3 px-3 border-l-2 border-l-light-accent dark:border-l-dark-accent"
        >
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="ml-1 leading-7 font-inter-regular text-light-primary dark:text-[#efefef]"
          >
            {devo.verse}
          </Text>
        </View>
      </View>

      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="font-inter-bold my-2 text-light-primary dark:text-dark-primary text-2xl"
      >
        {devo.day}
      </Text>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="font-inter-regular text-lg text-light-primary dark:text-dark-primary leading-8"
      >
        {devo.content}
      </Text>
    </ScrollView>
  );
};

export default DevoItem;
