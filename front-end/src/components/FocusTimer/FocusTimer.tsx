import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pause, Play, RotateCcw, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onClose: () => void;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const formatTime = (total: number) => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const FocusTimer = ({
  isOpen,
  secondsLeft,
  totalSeconds,
  isRunning,
  onPause,
  onResume,
  onReset,
  onClose,
}: Props) => {
  const STORAGE_KEY = "focus_timer_pos_v1";

  const defaultPos = useMemo(() => ({ x: 24, y: 24 }), []);
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultPos;
      return JSON.parse(raw);
    } catch {
      return defaultPos;
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const x = Math.max(24, window.innerWidth - 320);
        const y = Math.max(24, window.innerHeight - 220);
        setPos({ x, y });
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dragRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const offset = useRef({ dx: 0, dy: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;

      const w = dragRef.current?.offsetWidth ?? 280;
      const h = dragRef.current?.offsetHeight ?? 140;

      const x = clamp(
        e.clientX - offset.current.dx,
        12,
        window.innerWidth - w - 12,
      );
      const y = clamp(
        e.clientY - offset.current.dy,
        12,
        window.innerHeight - h - 12,
      );

      setPos({ x, y });
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
      } catch {}
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isOpen, pos]);

  useEffect(() => {
    if (!isOpen) return;

    const onResize = () => {
      const w = dragRef.current?.offsetWidth ?? 280;
      const h = dragRef.current?.offsetHeight ?? 140;
      setPos((p) => ({
        x: clamp(p.x, 12, window.innerWidth - w - 12),
        y: clamp(p.y, 12, window.innerHeight - h - 12),
      }));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  if (!isOpen) return null;

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div
      ref={dragRef}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      className={cn(
        "fixed left-0 top-0 z-50 w-[260px] select-none rounded-2xl border p-3 shadow-lg backdrop-blur",
        isRunning &&
          "shadow-[0_0_24px_rgba(99,102,241,0.25)]",
      )}
    >
      <div
        onPointerDown={(e) => {
          dragging.current = true;
          const rect = dragRef.current?.getBoundingClientRect();
          offset.current = {
            dx: e.clientX - (rect?.left ?? 0),
            dy: e.clientY - (rect?.top ?? 0),
          };
        }}
        className="flex cursor-grab items-center justify-between gap-2 rounded-xl active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 cursor-pointer text-xs text-muted-foreground hover:bg-muted"
          type="button"
        >
          <X />
        </button>
      </div>

      <div className=" flex justify-center px-2">
        <div className="text-4xl font-semibold tabular-nums">
          {formatTime(secondsLeft)}
        </div>
        {/* <div className="text-xs text-muted-foreground">
          {secondsLeft === 0 ? "Time’s up" : isRunning ? "Running" : "Paused"}
        </div> */}
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-300 bg-black"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {isRunning ? (
          <Button size="sm" variant="outline" className="rounded-full cursor-pointer" onClick={onPause}>
            <Pause />
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="rounded-full cursor-pointer" onClick={onResume}>
            <Play />
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          className="rounded-full cursor-pointer"
          onClick={onReset}
        >
          <RotateCcw />
        </Button>

        {/* <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={onClose}
        >
          Hide
        </Button> */}
      </div>
    </div>
  );
};
