import { useEffect } from "react";

type Params = {
  enabled?: boolean;

  // actions
  onGenerate: () => void;
  onEsc?: () => void;

  // state flags
  loading?: boolean;
  canGenerate?: boolean;

  // optional: ignore when user is typing in inputs
  allowWhenTyping?: boolean;
};

const isTypingTarget = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
};

export const useKeyboardActions = ({
  enabled = true,
  onGenerate,
  onEsc,
  loading = false,
  canGenerate = true,
  allowWhenTyping = true,
}: Params) => {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      // Esc
      if (e.key === "Escape") {
        onEsc?.();
        return;
      }

      // Ctrl/Cmd + Enter -> Generate
      const isEnter = e.key === "Enter";
      const withMod = e.ctrlKey || e.metaKey;

      if (isEnter && withMod) {
        if (!allowWhenTyping && isTypingTarget(e.target)) return;

        if (loading || !canGenerate) return;

        e.preventDefault();
        onGenerate();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onGenerate, onEsc, loading, canGenerate, allowWhenTyping]);
};
