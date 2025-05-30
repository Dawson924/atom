import { JSX } from 'react';
import { StateCreator } from 'zustand';

interface NavigationState {
    currentPage: string | JSX.Element;
    cacheMap: Map<string, any>;
    goTo: (target: string | JSX.Element) => void;
}

const createNavigationSlice = (initialPage: string): StateCreator<NavigationState> => (set) => ({
    currentPage: initialPage,
    goTo: (target: string | JSX.Element) => set({ currentPage: target }),
    cacheMap: new Map<string, any>(),
});

export { createNavigationSlice };
export type { NavigationState };
