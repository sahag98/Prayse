//@ts-nocheck

import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

import { PRAYER_SCREEN } from "../routes";

const FolderItem = ({ actualTheme, item, navigation }) => {
  const prayerList = useSelector((state) => state.prayer.prayer);
  const handleOpen = (item) => {
    navigation.navigate(PRAYER_SCREEN, {
      title: item.name,
      // prayers: item.prayers,
      id: item.id,
    });
  };

  const id = item.id;

  const prayers = prayerList
    ?.filter((item) => item.folderId === id)
    .filter((item) => item.status !== "Archived");

  return (
    <TouchableOpacity
      onPress={() => handleOpen(item)}
      key={item.id}
      className="bg-light-secondary w-1/2 aspect-square dark:bg-dark-secondary p-3  mb-4 rounded-lg"
      style={[
        { width: width / 2 - 8 },
        getSecondaryBackgroundColorStyle(actualTheme),
      ]}
    >
      <View className="relative flex-1 justify-between">
        <View className="w-full flex-row gap-2 justify-between items-center">
          <Text
            numberOfLines={1}
            style={getSecondaryTextColorStyle(actualTheme)}
            className="text-2xl flex-1 dark:text-dark-primary  text-light-primary my-1 max-w-[90%] font-inter-bold"
          >
            {item.name}
          </Text>
          <AntDesign
            name="folder1"
            size={25}
            color={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : "#e8bb4e"
            }
          />
        </View>
        {prayers?.length === 0 ? (
          <View>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-medium text-sm dark:text-dark-primary text-light-primary"
            >
              Click to add prayers
            </Text>
          </View>
        ) : (
          <FlatList
            data={prayers?.slice(0, 3)}
            keyExtractor={(item) => item.id}
            className="gap-1"
            renderItem={({ item }) => (
              <View className="flex-row items-center">
                <Text
                  numberOfLines={1}
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="dark:text-[#d2d2d2] font-inter-medium text-light-primary text-sm"
                >
                  {item.prayer}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default FolderItem;

const width = Dimensions.get("window").width - 30;
