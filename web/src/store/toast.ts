import { StateCreator } from "zustand";

type Type = "error" | "success" | "info";

interface Toast {
  show: boolean;
  message?: string;
  type?: Type;
  count?: number;
}

export interface ToastStore {
  toast: Toast;
  setToast: (payload: Toast) => void;
}

export const toast: StateCreator<ToastStore> = (set) => ({
  toast: {
    show: false,
    count: 1,
  },
  setToast: (payload) => {
    set((state) => {
      if (!payload.count) {
        let currentCount = state.toast?.count ?? 0;
        //added "error" type validation to show errors message longer
        const count = payload.type === "error" ? 9999 : currentCount++;
        return { toast: { ...payload, count } };
      }
      return { toast: { ...payload } };
    });
  },
});
