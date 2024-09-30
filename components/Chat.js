import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome, Octicons, FontAwesome5 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import GroupPrayerItem from "../components/GroupPrayerItem";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { cn } from "@lib/utils";

const Chat = ({
  prayerToReact,
  setPrayerToReact,
  setReactionChannel,
  handleOpenBottomModal,
  theme,
  actualTheme,
  currentUser,
  areMessagesLoading,
  groupMessages,
  setGroupMessages,
  flatListRef,
  supabase,
  currGroup,
  setRefreshMsgLikes,
  refreshMsgLikes,
  showToast,
  newMessage,
  setNewMessage,
  handleContentSizeChange,
  sendMessage,
}) => {
  return (
    <View
      className={cn("flex-1 transition-all", prayerToReact && "opacity-50")}
    >
      <View className="flex-1 px-4 w-full relative">
        {areMessagesLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : theme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </View>
        ) : (
          <>
            {groupMessages.length === 0 ? (
              <View className="flex-1 justify-center gap-1 items-center">
                <FontAwesome5
                  name="list-alt"
                  size={80}
                  color={
                    actualTheme && actualTheme.MainTxt
                      ? actualTheme.MainTxt
                      : theme === "dark"
                        ? "white"
                        : "#2f2d51"
                  }
                />
                <Text
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-medium w-3/4 text-center  text-light-primary dark:text-dark-primary"
                >
                  Looks like there are no prayers yet! Be the first to share a
                  prayer.
                </Text>
              </View>
            ) : (
              <FlashList
                showsVerticalScrollIndicator={false}
                estimatedItemSize={120}
                ref={flatListRef}
                inverted
                estimatedListSize={{ height: 800, width: 450 }}
                data={groupMessages}
                ListHeaderComponent={() => <View className="h-8" />}
                ListEmptyComponent={() => (
                  <View className="flex-1 justify-center gap-1 items-center">
                    <FontAwesome5
                      name="list-alt"
                      size={50}
                      color={
                        actualTheme && actualTheme.MainTxt
                          ? actualTheme.MainTxt
                          : theme === "dark"
                            ? "white"
                            : "#2f2d51"
                      }
                    />
                    <Text
                      style={getMainTextColorStyle(actualTheme)}
                      className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
                    >
                      No prayers yet.
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                initialNumToRender={30}
                renderItem={({ item }) => {
                  return (
                    <View className="gap-2">
                      <GroupPrayerItem
                        theme={theme}
                        handleOpenBottomModal={handleOpenBottomModal}
                        prayerToReact={prayerToReact}
                        setReactionChannel={setReactionChannel}
                        setPrayerToReact={setPrayerToReact}
                        actualTheme={actualTheme}
                        currentUser={currentUser}
                        groupMessages={groupMessages}
                        setGroupMessages={setGroupMessages}
                        supabase={supabase}
                        currGroup={currGroup}
                        item={item}
                        setRefreshMsgLikes={setRefreshMsgLikes}
                        refreshMsgLikes={refreshMsgLikes}
                        showToast={showToast}
                      />
                    </View>
                  );
                }}
              />
            )}
          </>
        )}
      </View>
      <View
        style={
          actualTheme &&
          actualTheme.MainTxt && { borderTopColor: actualTheme.MainTxt }
        }
        className="flex-row p-4 justify-between items-center w-full self-center border-t border-t-light-primary dark:border-t-[#aeaeae]"
      >
        <View
          style={
            actualTheme &&
            actualTheme.MainTxt && { borderColor: actualTheme.MainTxt }
          }
          className="flex-1 min-h-9 max-h-52 w-5/6 rounded-lg border border-light-primary dark:border-[#aeaeae] p-3 justify-center"
        >
          <TextInput
            className="w-full font-inter-regular text-light-primary dark:text-dark-primary"
            style={
              actualTheme && actualTheme.MainTxt
                ? [
                    getMainTextColorStyle(actualTheme),
                    { paddingBottom: Platform.OS === "android" ? 0 : 5 },
                  ]
                : theme === "dark"
                  ? { paddingBottom: Platform.OS === "android" ? 0 : 5 }
                  : { paddingBottom: Platform.OS === "android" ? 0 : 5 }
            }
            placeholder="Write a prayer..."
            placeholderTextColor={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : theme === "dark"
                  ? "#b8b8b8"
                  : "#2f2d51"
            }
            selectionColor={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : theme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
            value={newMessage}
            textAlignVertical="center"
            onChangeText={(text) => setNewMessage(text)}
            onContentSizeChange={handleContentSizeChange}
            onSubmitEditing={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            multiline
          />
        </View>
        <TouchableOpacity
          disabled={newMessage.length === 0}
          className="w-[15%] justify-center items-center"
          onPress={sendMessage}
        >
          <FontAwesome
            name="send"
            size={28}
            color={
              actualTheme && actualTheme.Primary
                ? actualTheme.Primary
                : theme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;
