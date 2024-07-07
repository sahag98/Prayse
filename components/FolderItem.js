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

const FolderItem = ({ colorScheme, item, theme, navigation }) => {
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
    <TouchableOpacity onPress={() => handleOpen(item)} key={item.id}>
      <View
        style={
          colorScheme === "dark"
            ? [styles.containerDark, styles.elevationDark]
            : styles.container
        }
      >
        <View className="relative flex-1 justify-between">
          <View className="w-full flex-row justify-between items-center">
            <Text className="text-xl dark:text-white  text-[#2f2d51] my-1 max-w-[90%] font-inter font-bold">
              {item.name}
            </Text>
            <AntDesign name="folder1" size={28} color={"#e8bb4e"} />
          </View>
          {prayers?.length === 0 ? (
            <View>
              <Text className="font-inter text-sm dark:text-white text-[#2f2d51]">
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
                  <Text className="dark:text-[#d2d2d2] text-[#2f2d51] text-sm">
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
