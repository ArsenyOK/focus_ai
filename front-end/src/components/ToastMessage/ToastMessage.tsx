type ToastProps = {
  toast: {
    open: boolean;
    kind: "success" | "warning";
    title: string;
    description?: string;
  };
  onClose: () => void;
};

export const ToastMessage = ({ toast, onClose }: ToastProps) => {
  return (
    <div
      className={[
        "fixed right-4 top-4 z-[60] w-[320px] rounded-2xl border bg-background/90 p-3 shadow-lg backdrop-blur",
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
              toast.kind === "success" ? "text-emerald-600" : "text-amber-600",
            ].join(" ")}
          >
            {toast.title}
          </div>

          {toast.description && (
            <div className="mt-1 text-sm text-muted-foreground">
              {toast.description}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
