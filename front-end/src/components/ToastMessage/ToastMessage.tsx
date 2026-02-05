import { X } from "lucide-react";

type ToastProps = {
  toast: {
    open: boolean;
    kind: "success" | "warning" | "error";
    title: string;
    description?: string;
  };
  onClose: () => void;
};

export const ToastMessage = ({ toast, onClose }: ToastProps) => {
  return (
    <div
      className={[
        "fixed right-4 top-4 z-[60] w-[320px] rounded-2xl bg-[#121D2F] border p-3 shadow-lg backdrop-blur",
        "transition-all duration-200 ease-out",
        toast.open
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className={[
              "text-sm font-semibold",
              toast.kind === "success"
                ? "text-emerald-600"
                : toast.kind === "error"
                  ? "text-red-500"
                  : "text-amber-600",
            ].join(" ")}
          >
            {toast.title}
          </div>

          {toast.description && (
            <div className="mt-1 text-sm text-muted-foreground text-white">
              {toast.description}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 text-white py-1 text-xs text-muted-foreground cursor-pointer"
        >
          <X />
        </button>
      </div>
    </div>
  );
};
