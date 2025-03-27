import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEVO_LIST_SCREEN,
  PRAYER_ROOM_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "@routes";
import { create } from "zustand";

import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

interface PrayerTrackingEntry {
  date: string;
  count: number;
}

interface VODTrackingEntry {
  date: string;
  count: number;
}

interface UserStore {
  isShowingNewBadge: boolean;
  isShowingAmenButton: boolean;
  isShowingProModal: boolean;
  hasShownPrayerBadge: boolean;
  hasShownVerseBadge: boolean;
  hasShownPraiseBadge: boolean;
  handleBadgeShowing: (data: string) => void;
  handleShowNewBadge: () => void;
  handleAmenButton: (data: any) => void;
  resetBadgeShowing: () => void;
  handleShowUpdate: () => void;
  prayers: PrayerTrackingEntry[]; // Changed to array
  addPrayerTracking: () => void;
  deletePrayerTracking: () => void;

  verseoftheday: VODTrackingEntry[]; // Changed to array
  addVODTracking: () => void;
  deleteVODTracking: () => void;
  isShowingNewUpdate: boolean;
}

const useStore = create(
  persist<UserStore>(
    (set, get) => ({
      isShowingNewUpdate: true,
      isShowingNewBadge: true,
      isShowingAmenButton: true,
      isShowingProModal: false,
      hasShownPrayerBadge: false,
      hasShownVerseBadge: false,
      hasShownPraiseBadge: false,
      prayers: [],
      verseoftheday: [],
      handleAmenButton: () => {
        set({ isShowingAmenButton: false });
      },
      handleShowNewBadge: () => {
        set({ isShowingNewBadge: false });
      },

      deletePrayerTracking: () => {
        set({ prayers: [] });
      },
      deleteVODTracking: () => {
        set({ verseoftheday: [] });
      },
      handleShowUpdate: () => {
        set({ isShowingNewUpdate: false });
      },
      resetBadgeShowing: () => {
        set({ hasShownPraiseBadge: false });
        set({ hasShownPrayerBadge: false });
        set({ hasShownVerseBadge: false });
      },
      addPrayerTracking: () => {
        console.log("add prayer tracking");
        set((state) => {
          const today = new Date().toISOString().split("T")[0];
          console.log("today: ", today);
          console.log("curr tracking: ", state.prayers);
          // ✅ Avoid duplicates by checking if today is already recorded

          const dateIndex = state.prayers.findIndex(
            (prayer) => prayer.date === today,
          );

          if (dateIndex < 0) {
            return { prayers: [...state.prayers, { date: today, count: 1 }] };
          }
          // state.prayers.map((prayer)=>{
          //   console.log('hereeeee')
          //   if (!prayer.date.includes(today)){
          //     console.log('hereee')
          //     return { prayers: [...state.prayers, {date: today, count: 1}] };
          //   }
          // })
          // if (!state.prayers.includes(today)) {
          //   return { prayers: [...state.prayers, {date: today, count: 1}] };
          // }
          return state;
        });
      },
      addVODTracking: () => {
        console.log("add prayer tracking");
        set((state) => {
          const today = new Date().toISOString().split("T")[0];
          console.log("today: ", today);
          console.log("curr tracking: ", state.verseoftheday);
          // ✅ Avoid duplicates by checking if today is already recorded

          const dateIndex = state.verseoftheday.findIndex(
            (verse) => verse.date === today,
          );

          if (dateIndex < 0) {
            return {
              verseoftheday: [
                ...state.verseoftheday,
                { date: today, count: 1 },
              ],
            };
          }
          // state.prayers.map((prayer)=>{
          //   console.log('hereeeee')
          //   if (!prayer.date.includes(today)){
          //     console.log('hereee')
          //     return { prayers: [...state.prayers, {date: today, count: 1}] };
          //   }
          // })
          // if (!state.prayers.includes(today)) {
          //   return { prayers: [...state.prayers, {date: today, count: 1}] };
          // }
          return state;
        });
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
