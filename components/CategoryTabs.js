import { getPrimaryBackgroundColorStyle } from "@lib/customStyles";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CategoryTabs = ({
  actualTheme,
  theme,
  prayerList,
  status,
  setStatus,
  selected,
}) => {
  return (
    <>
      {prayerList.length !== 0 && (
        <View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={styles.tab}
          >
            {selected.map((selected, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setStatus(selected)}
                style={[
                  actualTheme && actualTheme.Primary
                    ? [
                        styles.btnTab,
                        status === selected && {
                          backgroundColor: actualTheme.Primary,
                        },
                      ]
                    : theme === "dark"
                      ? [
                          styles.btnTabDark,
                          status === selected && styles.btnActiveDark,
                        ]
                      : [
                          styles.btnTab,
                          status === selected && styles.btnActive,
                        ],
                ]}
              >
                <Text
                  style={
                    actualTheme && actualTheme.PrimaryTxt
                      ? [
                          styles.textTab,
                          status === selected && {
                            color: actualTheme.PrimaryTxt,
                          },
                        ]
                      : theme === "dark"
                        ? [
                            styles.textTabDark,
                            status === selected && styles.textTabActiveDark,
                          ]
                        : [
                            styles.textTab,
                            status === selected && styles.textTabActive,
                          ]
                  }
                >
                  {selected}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  tab: {
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnTab: {
    backgroundColor: "white",
    padding: 7,
    shadowColor: "#bdbdbd",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginHorizontal: 5,
  },

  btnTabDark: {
    backgroundColor: "#212121",
    padding: 7,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginHorizontal: 5,
  },

  textTab: {
    color: "black",
    fontSize: 13,
  },

  textTabDark: {
    color: "white",
    fontSize: 13,
  },

  textTabActive: {
    color: "white",
  },

  textTabActiveDark: {
    color: "black",
  },

  btnActive: {
    backgroundColor: "#2F2D51",
  },

  btnActiveDark: {
    backgroundColor: "white",
  },
});

export default CategoryTabs;
