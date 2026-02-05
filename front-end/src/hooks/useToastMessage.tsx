import { useEffect, useRef, useState } from "react";

export type ToastKind = "success" | "warning" | "error";

export type ToastState = {
  open: boolean;
  kind: ToastKind;
  title: string;
  description?: string;
};

const INITIAL_STATE: ToastState = {
  open: false,
  kind: "success",
  title: "",
  description: "",
};

export const useToastMessage = () => {
  const [toast, setToast] = useState<ToastState>(INITIAL_STATE);
  const timerRef = useRef<number | null>(null);

  const showToast = (next: Omit<ToastState, "open">, duration = 5000) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setToast({ open: true, ...next });

    timerRef.current = window.setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
      timerRef.current = null;
    }, duration);
  };

  const hideToast = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast((t) => ({ ...t, open: false }));
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
