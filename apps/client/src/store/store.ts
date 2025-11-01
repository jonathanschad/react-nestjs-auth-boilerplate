import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface Store {
    accessToken: string | null;
    isLoggedIn: boolean;
    setAccessToken: (accessToken: string | null) => void;
    decodedAccessToken: () => DecodedAccessToken | null;
}

export enum UserState {
    UNVERIFIED = 'UNVERIFIED',
    VERIFIED = 'VERIFIED',
    COMPLETE = 'COMPLETE',
    INVALID = 'INVALID',
}
interface DecodedAccessToken {
    email: string;
    state: UserState;
    userId: string;
}

const omittedProperties: Array<keyof Store> = ['accessToken'];

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            accessToken: null,
            isLoggedIn: false,
            setAccessToken: (accessToken) => {
                set({ accessToken, isLoggedIn: Boolean(accessToken) });
            },
            decodedAccessToken: () => {
                const encodedToken = get().accessToken;
                if (!encodedToken) {
                    return null;
                }

                return jwtDecode<DecodedAccessToken>(encodedToken);
            },
        }),
        {
            name: 'react-nestjs-boilerplate-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) => !(omittedProperties as string[]).includes(key)),
                ),
        },
    ),
);
