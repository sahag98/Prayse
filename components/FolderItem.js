import { useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign } from "@expo/vector-icons";

import { editFolderName } from "../redux/folderReducer";
import { PRAYER_SCREEN } from "../routes";
import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const FolderItem = ({ colorScheme, actualTheme, item, theme, navigation }) => {
  const dispatch = useDispatch();
  const [openEdit, setOpenEdit] = useState(false);
  const [newFolderName, setNewFolderName] = useState(item.name);
  const prayerList = useSelector((state) => state.prayer.prayer);
  const handleOpen = (item) => {
    navigation.navigate(PRAYER_SCREEN, {
      title: item.name,
      prayers: item.prayers,
      id: item.id,
    });
  };

  function handleCloseEdit() {
    setOpenEdit(false);
  }

  function truncateWords(str) {
    const words = str.split(" ");
    if (words.length > 5) {
      return words.slice(0, 5).join(" ") + " ...";
    } else {
      return str;
    }
  }

  function editFolder(id) {
    dispatch(
      editFolderName({
        name: newFolderName,
        id,
      })
    );
    setOpenEdit(false);
  }

  const id = item.id;

  const prayers = prayerList?.filter((item) => item.folderId === id);

  return (
    <TouchableOpacity
      className="w-1/2"
      onPress={() => handleOpen(item)}
      key={item.id}
    >
      <View
        className="bg-light-secondary w-full aspect-square dark:bg-dark-secondary p-3  flex-1 mb-4 rounded-lg"
        style={[
          { width: width / 2 - 8 },
          getSecondaryBackgroundColorStyle(actualTheme),
        ]}
      >
        <View className="relative flex-1 justify-between">
          <View className="w-full flex-row justify-between items-center">
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="text-2xl dark:text-dark-primary  text-light-primary my-1 max-w-[90%] font-inter font-bold"
            >
              {item.name}
            </Text>
            <AntDesign
              name="folder1"
              size={28}
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
                className="font-inter text-sm dark:text-dark-primary text-light-primary"
              >
                No prayers yet.
              </Text>
            </View>
          ) : (
            <FlatList
              data={prayers?.slice(0, 2)}
              keyExtractor={(item) => item.id}
              className="gap-1"
              renderItem={({ item }) => (
                <View className="flex-row items-center">
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="dark:text-[#d2d2d2] text-light-primary text-sm"
                  >
                    {truncateWords(item.prayer)}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FolderItem;

const width = Dimensions.get("window").width - 30;

const styles = StyleSheet.create({
  elevation: {
    shadowColor: "#12111f",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  inputDark: {
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    backgroundColor: "#121212",
  },
  input: {
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontFamily: "Inter-Regular",
    backgroundColor: "#2F2D51",
  },
  elevationDark: {
    shadowColor: "#040404",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  elevationBlack: {
    shadowColor: "#040404",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  container: {
    backgroundColor: "#b7d3ff",
    padding: 8,
    width: width / 2 - 8,
    height: 135,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#bdbdbd",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 3,
  },

  containerDark: {
    backgroundColor: "#212121",
    padding: 10,
    width: width / 2 - 8,
    // aspectRatio: 1 / 1,
    minHeight: 135,
    // height: 135,
    marginBottom: 15,
    borderRadius: 10,
  },
  containerBlack: {
    backgroundColor: "black",
    padding: 8,
    width: width / 2 - 8,
    height: 135,
    marginBottom: 15,
    borderRadius: 10,
  },
  viewDark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    padding: 10,
    width: "100%",
    backgroundColor: "#2e2e2e",
    borderRadius: 5,
  },
  viewBlack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    padding: 9,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    padding: 10,
    width: "100%",
    backgroundColor: "#423f72",
    borderRadius: 10,
  },
});
