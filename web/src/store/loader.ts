import { StateCreator } from 'zustand';

export interface LoaderStore {
  loader: {
    show: boolean;
  };
  setLoader: (status: boolean) => void;
}

export const loader: StateCreator<LoaderStore> = (set) => ({
  loader: {
    show: false,
  },
  setLoader: (status) => {
    set({ loader: { show: status } });
  },
});
