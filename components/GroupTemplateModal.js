import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  resolveAssetSource,
} from "react-native";
import React, { useState } from "react";
import { ModalContainer } from "../styles/appStyles";
import biblestudy from "../assets/templates/biblestudy.png";
import classmates from "../assets/templates/classmates.png";
import general from "../assets/templates/general.png";
import teens from "../assets/templates/teens.png";
import couples from "../assets/templates/couples.png";
import kids from "../assets/templates/kids.png";
import work from "../assets/templates/work.png";
import ya from "../assets/templates/ya.png";

const GroupTemplateModal = ({
  theme,
  setImgUrl,
  group,
  setGroupImage,
  supabase,
  isShowingGroupTemplates,
  setIsShowingGroupTemplates,
}) => {
  const [selectedImg, setSelectedImg] = useState(biblestudy);
  const [selectedItem, setSelectedItem] = useState(null);
  const templates = [
    {
      id: 1,
      title: "Bible Study",
      image: biblestudy,
    },
    {
      id: 2,
      title: "Work",
      image: work,
    },
    {
      id: 3,
      title: "Classmates",
      image: classmates,
    },
    {
      id: 4,
      title: "General",
      image: general,
    },
    {
      id: 5,
      title: "Kids",
      image: kids,
    },
    {
      id: 6,
      title: "Teens",
      image: teens,
    },
    {
      id: 7,
      title: "Young Adults",
      image: ya,
    },
    {
      id: 8,
      title: "Couples",
      image: couples,
    },
  ];

  const selectImage = async () => {
    const filePath = `${selectedItem.title}_${Date.now()}.png`;
    const fileName = selectedItem.title;
    const exampleImageUri = Image.resolveAssetSource(selectedImg).uri;

    setGroupImage(exampleImageUri);
    const formData = new FormData();
    formData.append("files", {
      uri: exampleImageUri,
      name: fileName,
      type: `image/png`,
    });

    try {
      const { data, error } = await supabase.storage
        .from("group")
        .upload(filePath, formData);

      if (error) {
        console.log("error uploading image: ", error.message);
      } else {
        console.log("Image uploaded successfully: ", data);
      }
    } catch (error) {
      console.log("error: ", error.message);
    }
    setIsShowingGroupTemplates(false);
    // let { error: uploadError } = await supabase.storage
    //   .from("group")
    //   .upload(filePath, formData);

    // if (uploadError) {
    //   throw uploadError;
    // }

    const { data: imageData, error: getUrlError } = await supabase.storage
      .from("group")
      .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry
    setImgUrl(imageData.signedUrl);
    if (getUrlError) {
      throw getUrlError;
    }

    const { data, error } = await supabase
      .from("groups")
      .update({
        group_img: imageData.signedUrl,
      })
      .eq("id", group.group_id);

    console.log("error: ", error);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isShowingGroupTemplates}
      onRequestClose={() => setIsShowingGroupTemplates(false)}
      statusBarTranslucent={true}
    >
      <ModalContainer
        style={
          theme == "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
        }
      >
        <View
          style={
            theme == "dark"
              ? {
                  borderRadius: 10,
                  position: "relative",
                  padding: 15,
                  width: "100%",
                  justifyContent: "center",
                  gap: 10,
                  backgroundColor: "#212121",
                }
              : {
                  borderRadius: 10,
                  position: "relative",
                  padding: 15,
                  width: "100%",
                  justifyContent: "center",

                  gap: 10,
                  backgroundColor: "#deebff",
                }
          }
        >
          <FlatList
            data={templates}
            numColumns={2}
            keyExtractor={(e, i) => i.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedImg(item.image);
                  setSelectedItem(item);
                }}
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: theme == "dark" ? "#121212" : "white",
                  borderWidth: 2,
                  borderColor:
                    theme == "dark"
                      ? selectedImg === item.image
                        ? "#a5c9ff"
                        : "#121212"
                      : selectedImg === item.image
                      ? "#2f2d51"
                      : "white",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  margin: 8,
                }}
              >
                <Image
                  style={{ width: 80, height: 80, objectFit: "contain" }}
                  source={item.image}
                />
                <Text
                  style={{
                    color: theme == "dark" ? "white" : "#2f2d51",
                    fontFamily: "Inter-Medium",
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsShowingGroupTemplates(false);
              }}
              style={{
                width: "48%",
                backgroundColor: theme == "dark" ? "#121212" : "white",
                padding: 15,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme == "dark" ? "white" : "#2f2d51",
                  fontFamily: "Inter-Bold",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={selectImage}
              style={{
                width: "48%",
                backgroundColor: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                padding: 15,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme == "dark" ? "#212121" : "white",
                  fontFamily: "Inter-Bold",
                }}
              >
                Select
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default GroupTemplateModal;

const styles = StyleSheet.create({});
