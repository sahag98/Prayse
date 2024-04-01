import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { FontAwesome, Octicons } from "@expo/vector-icons";

import { FlashList } from "@shopify/flash-list";

import GroupPrayerItem from "../components/GroupPrayerItem";

const Chat = ({
  theme,
  currentUser,
  onlineUsers,
  areMessagesLoading,
  groupMessages,
  setGroupMessages,
  flatListRef,
  handleScroll,
  supabase,
  currGroup,
  setRefreshMsgLikes,
  refreshMsgLikes,
  allGroups,
  showToast,
  newMessage,
  setNewMessage,
  handleContentSizeChange,
  sendMessage,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: theme == "dark" ? "#121212" : "#f2f7ff",
          alignItems: "center",
          alignSelf: "center",
          paddingHorizontal: 2,
          paddingVertical: 4,
          justifyContent: "center",
          borderRadius: 50,
          marginBottom: 10,
          shadowColor: "#2bc035",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.17,
          shadowRadius: 3.05,
          elevation: 4,
          width: "35%",
          gap: 5,
        }}
      >
        <Octicons name="dot-fill" size={24} color="green" />
        <Text
          style={{
            color: theme == "dark" ? "white" : "#2f2d51",
            fontFamily: "Inter-Regular",
            fontSize: 13,
          }}
        >
          {onlineUsers.length} User{onlineUsers.length > 1 ? "'s " : " "}
          Online
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          width: "100%",
          position: "relative",
        }}
      >
        {areMessagesLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={theme == "dark" ? "white" : "#2f2d51"} />
          </View>
        ) : (
          <>
            {groupMessages.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={
                    theme == "dark"
                      ? { fontFamily: "Inter-Regular", color: "#bebebe" }
                      : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                  }
                >
                  No messages yet.
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
                ListHeaderComponent={() => (
                  <View
                    style={
                      theme == "dark"
                        ? {
                            height: 30,
                          }
                        : {
                            height: 30,
                          }
                    }
                  />
                )}
                onScroll={handleScroll}
                keyExtractor={(e, i) => i.toString()}
                initialNumToRender={30}
                renderItem={({ item, index }) => {
                  return (
                    <GroupPrayerItem
                      theme={theme}
                      currentUser={currentUser}
                      groupMessages={groupMessages}
                      setGroupMessages={setGroupMessages}
                      supabase={supabase}
                      currGroup={currGroup}
                      item={item}
                      setRefreshMsgLikes={setRefreshMsgLikes}
                      refreshMsgLikes={refreshMsgLikes}
                      allGroups={allGroups}
                      showToast={showToast}
                    />
                  );
                }}
              />
            )}
          </>
        )}
      </View>
      <View
        style={[
          styles.inputField,
          {
            borderTopWidth: 1,
            borderTopColor: currGroup.groups.color.toLowerCase(),
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            minHeight: 35,
            maxHeight: 200,
            width: "85%",
            backgroundColor: theme == "dark" ? "#212121" : "white",
            borderWidth: theme == "dark" ? 0 : 1,
            borderColor: "#2f2d51",
            borderRadius: 10,
            padding: 10,
            justifyContent: "center",
          }}
        >
          <TextInput
            style={
              theme == "dark"
                ? [
                    styles.inputDark,
                    { paddingBottom: Platform.OS == "android" ? 0 : 5 },
                  ]
                : [
                    styles.input,
                    { paddingBottom: Platform.OS == "android" ? 0 : 5 },
                  ]
            }
            placeholder="Write a prayer..."
            placeholderTextColor={theme == "dark" ? "#b8b8b8" : "#2f2d51"}
            selectionColor={theme == "dark" ? "white" : "#2f2d51"}
            value={newMessage}
            textAlignVertical="center"
            onChangeText={(text) => setNewMessage(text)}
            onContentSizeChange={handleContentSizeChange}
            onSubmitEditing={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            multiline={true}
          />
        </View>
        <TouchableOpacity
          disabled={newMessage.length == 0 ? true : false}
          style={{
            width: "15%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={sendMessage}
        >
          <FontAwesome
            name="send"
            size={28}
            color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  inputField: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  inputDark: {
    color: "white",
    fontFamily: "Inter-Regular",
    width: "100%",
    paddingBottom: 5,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "85%",
    paddingBottom: 5,
  },
});
