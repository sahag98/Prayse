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

const Chat = ({
  theme,
  actualTheme,
  currentUser,
  onlineUsers,
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
    <View className="flex-1">
      <View
        style={getMainBackgroundColorStyle(actualTheme)}
        className="flex-row items-center bg-light-background dark:bg-dark-background self-center px-3 py-1 justify-center rounded-full mb-3  shadow-sm gap-1 shadow-green-400"
      >
        <Octicons name="dot-fill" size={24} color="green" />
        <Text className="font-inter text-sm text-light-primary dark:text-dark-primary">
          {onlineUsers.length} User{onlineUsers.length > 1 ? "s " : " "}
          Online
        </Text>
      </View>
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
                  className="font-inter font-medium text-lg text-light-primary dark:text-dark-primary"
                >
                  No prayers yet.
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
                keyExtractor={(item) => item.id}
                initialNumToRender={30}
                renderItem={({ item }) => {
                  return (
                    <View className="gap-2">
                      <GroupPrayerItem
                        theme={theme}
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
                      {item.user_id !== currentUser.id && (
                        <View className="flex-row items-center ml-2 mb-2 gap-2">
                          <Text className="font-inter text-sm text-gray-500">
                            Press and hold to pray or praise.
                          </Text>
                        </View>
                      )}
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
        className="flex-row p-4 justify-between items-center w-full self-center border-t border-t-light-primary dark:border-t-dark-secondary"
      >
        <View
          style={
            actualTheme &&
            actualTheme.MainTxt && { borderColor: actualTheme.MainTxt }
          }
          className="flex-1 min-h-9 max-h-52 w-5/6 rounded-lg border border-light-primary dark:border-dark-secondary p-3 justify-center"
        >
          <TextInput
            className="w-full font-inter text-light-primary dark:text-dark-primary"
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
