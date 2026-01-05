import axios from "axios";
import { create } from "zustand";

interface SettingsState {
  open: boolean;
  setOpen: (open: boolean) => void;
  // get user profile
  getUserSettings: (userId: string) => Promise<void>;
  // update user profile
  updateUserSettings: (userId: string) => Promise<void>;
  gender: string;
  setGender: (gender: string) => void;

  language: string;
  setLanguage: (language: string) => void;

  loading: boolean;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
  gender: "female",
  setGender: (gender: string) => set({ gender }),

  loading: false,

  language: "en-US",
  setLanguage: (language: string) => set({ language }),

  getUserSettings: async (userId: string) => {
    try {
      const { data } = await axios.get(`/api/settings/?userId=${userId}`);
      console.log(data);

      return data;
    } catch (error) {
      console.error("Failed to fetch user settings:", error);
    }
  },

  updateUserSettings: async (userId: string) => {
    const { language, gender } = useSettingsStore.getState();
    set({ loading: true });
    try {
      await axios.patch(`/api/settings/?userId=${userId}`, {
        language,
        gender,
      });
      set({ loading: false });
    } catch (error) {
      console.error("Failed to update user settings:", error);
      set({ loading: false });
    }
  },
}));
