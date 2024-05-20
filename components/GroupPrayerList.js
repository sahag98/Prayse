import {
  SectionList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import GroupPrayerModal from "./GroupPrayerModal";
import Moment from "moment";
import { AntDesign } from "@expo/vector-icons";
const GroupPrayerList = ({
  theme,
  currentUser,
  onlineUsers,
  supabase,
  currGroup,
  allGroups,
}) => {
  const [groupPrayers, setGroupPrayers] = useState([]);
  const [isShowingModal, setIsShowingModal] = useState(false);
  useEffect(() => {
    async function getGroupPrayers() {
      const { data, error } = await supabase
        .from("group_prayers")
        .select("*, profiles(*)")
        .eq("group_id", currGroup.group_id);

      if (error) {
        console.error(error);
      } else {
        // Transform data into sections format
        const prayersByDate = data.reduce((acc, prayer) => {
          const date = Moment(prayer.created_at).startOf("day");
          const now = Moment().startOf("day");

          let label;
          if (date.isSame(now, "day")) {
            label = "Today";
          } else if (date.isSame(now.clone().subtract(1, "days"), "day")) {
            label = "Yesterday";
          } else {
            label = date.format("MMMM Do YYYY");
          }

          if (!acc[label]) {
            acc[label] = [];
          }
          acc[label].push(prayer);
          return acc;
        }, {});

        const sections = Object.keys(prayersByDate).map((date) => ({
          title: date,
          data: prayersByDate[date],
        }));

        setGroupPrayers(sections);
      }
    }

    getGroupPrayers();
  }, [currGroup.group_id, supabase]);

  return (
    <View
      style={{
        paddingHorizontal: 10,
        flex: 1,

        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SectionList
        style={{ width: "100%" }}
        ListEmptyComponent={() => (
          <View>
            <Text>No prayers added yet.</Text>
          </View>
        )}
        sections={groupPrayers}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginTop: 5,
              backgroundColor: "#b7d3ff",
              width: "100%",
              borderRadius: 10,
              gap: 10,
              padding: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Image
                style={{ width: 40, height: 40 }}
                source={{
                  uri: item.profiles?.avatar_url
                    ? item.profiles?.avatar_url
                    : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter-Bold", color: "#2f2d51" }}>
                  {item.profiles.full_name}
                </Text>
                {item.profiles.id === currentUser.id && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#2f2d51",
                        borderRadius: 5,
                        padding: 5,
                      }}
                    >
                      <AntDesign name="check" size={20} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#2f2d51",
                        borderRadius: 5,
                        padding: 5,
                      }}
                    >
                      <AntDesign name="close" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <Text style={{ fontFamily: "Inter-Regular", color: "#2f2d51" }}>
              {item.prayer}
            </Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: 16,
              color: "#2f2d51",
            }}
          >
            {title}
          </Text>
        )}
      />

      <TouchableOpacity
        onPress={() => setIsShowingModal(true)}
        style={{
          position: "absolute",
          bottom: 20,
          left: 10,
          padding: 12,
          backgroundColor: "#2f2d51",
          borderRadius: 10,
        }}
      >
        <Text
          style={{ color: "white", fontFamily: "Inter-Bold", fontSize: 15 }}
        >
          Add Prayer
        </Text>
      </TouchableOpacity>
      <GroupPrayerModal
        supabase={supabase}
        currentUser={currentUser}
        currGroup={currGroup}
        theme={theme}
        isShowingModal={isShowingModal}
        setIsShowingModal={setIsShowingModal}
      />
    </View>
  );
};

export default GroupPrayerList;

const styles = StyleSheet.create({});
