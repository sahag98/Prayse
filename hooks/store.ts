import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEVO_LIST_SCREEN,
  PRAYER_ROOM_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "@routes";
import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  isShowingProModal: boolean;
  hasShownPrayerBadge: boolean;
  hasShownVerseBadge: boolean;
  hasShownPraiseBadge: boolean;
  handleBadgeShowing: (data: string) => void;
  resetBadgeShowing: () => void;
}

const useStore = create(
  persist<UserStore>(
    (set, get) => ({
      isShowingProModal: false,
      hasShownPrayerBadge: false,
      hasShownVerseBadge: false,
      hasShownPraiseBadge: false,
      resetBadgeShowing: () => {
        set({ hasShownPraiseBadge: false });
        set({ hasShownPrayerBadge: false });
        set({ hasShownVerseBadge: false });
      },
      handleBadgeShowing: (data: string) => {
        console.log("badge");
        if (data === PRAYER_ROOM_SCREEN) {
          console.log("here");
          set({ hasShownPrayerBadge: true });
        } else if (data === VERSE_OF_THE_DAY_SCREEN) {
          set({ hasShownVerseBadge: true });
        } else if (data === DEVO_LIST_SCREEN) {
          set({ hasShownPraiseBadge: true });
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useStore;
