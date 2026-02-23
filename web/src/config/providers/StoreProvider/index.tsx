"use client";

import Loader from "@/components/ui/Loader";
import Notification from "@/components/ui/Toast";
import { useAppStore } from "@/store";

const StoreProvider: React.FC = () => {
  const { toast, loader } = useAppStore();

  return (
    <>
      {toast.show ? <Notification /> : null}
      {loader.show ? <Loader type="page" /> : null}
    </>
  );
};

export default StoreProvider;
