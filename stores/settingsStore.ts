import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type ThemeType = "light" | "dark" | "system"

type SettingsState = {
	theme: ThemeType
	setTheme: (theme: ThemeType) => void
}

export const useSettingsStore = create(
	persist<SettingsState>(
		(set) => ({
			theme: "light",
			setTheme: (theme) => set({ theme }),
		}),
		{
			name: "settings-storage",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				theme: state.theme,
				setTheme: state.setTheme,
			}),
		}
	)
)
