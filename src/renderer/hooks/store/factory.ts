import { create } from 'zustand';
import { createNavigationSlice, NavigationState } from './slices/nav';

export const createPageStore = (initialPage: string) => {
    return create<NavigationState>((...a) => ({
        ...createNavigationSlice(initialPage)(...a),
    }));
};
