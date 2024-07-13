import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';

interface FavouritesState {
  ids: number[]
  clear: () => void
  toggle: (id: number) => void
}

export const useFavouritesStore = create<FavouritesState>()(
  devtools(
    persist(
      (set) => ({
        ids: [],
        clear: () => set(() => ({ids: []})),
        toggle: (id) => set((state) => ({ids: state.ids.includes(id) ? state.ids.filter((i) => i !== id) : [...state.ids, id]})),
      }),
      {
        name: 'favourite-storage',
      },
    ),
  ),
)
