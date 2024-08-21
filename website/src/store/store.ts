import { create } from "zustand";
import { createJSONStorage,persist } from "zustand/middleware";

interface Store {
    accessToken: string | null;
    isLoggedIn: boolean;
    setAccessToken: (accessToken: string | null) => void;
}
const omittedProperties: Array<keyof Store> = ["accessToken"];

export const useStore = create<Store>()(
    persist(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (set, _get) => ({
            accessToken: null,
            isLoggedIn: false,
            setAccessToken: (accessToken) => {
                set({ accessToken, isLoggedIn: Boolean(accessToken) });
            },
        }),
        {
            name: "tauschboerse-storage", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(
                        ([key]) =>
                            !(omittedProperties as string[]).includes(key)
                    )
                ),
        }
    )
);
