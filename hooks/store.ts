import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  isShowingProModal: boolean;
}

const useCart = create(
  persist<UserStore>(
    (set, get) => ({
      isShowingProModal: false,
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useCart;
