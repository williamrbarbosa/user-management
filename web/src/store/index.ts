import { create } from "zustand";

import { loader, LoaderStore } from "../store/loader";
import { toast, ToastStore } from "../store/toast";

type StoreState = ToastStore & LoaderStore;

export const useAppStore = create<StoreState>()((...a) => ({
  ...toast(...a),
  ...loader(...a),
}));
