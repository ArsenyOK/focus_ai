import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import Footer from "../Footer/Footer";
import CardRight from "../CardBlock/CardRight";
import CardLeft from "../CardBlock/CardLeft";
import { useToastMessage } from "@/hooks/useToastMessage";
import { ToastMessage } from "../ToastMessage/ToastMessage";
import { useKeyboardActions } from "@/hooks/useKeyboardActions";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { FOCUS_SECONDS } from "@/lib/consts";
import { API_URL } from "@/lib/utils";

type Plan = {
  title: string;
  steps: { title: string; details?: string; eta?: string }[];
  firstAction: string;
};

const PageContainer = () => {
  const { t } = useTranslation();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  const [mode, setMode] = useState<"fast" | "deep">("fast");
  const [tone, setTone] = useState<"strict" | "soft">("strict");
  const [includeTime, setIncludeTime] = useState(true);
  const [messageChanged, setMessageChanged] = useState<string>("");
  const { toast, showToast, hideToast } = useToastMessage();
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isFirstActionDone, setIsFirstActionDone] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [isPlanFocused, setIsPlanFocused] = useState(false);

  const normalize = (v: string) => v.trim();

  const canSubmit = normalize(input).length >= 5 && !loading;

  const remaining = 3;

  const onResetTimer = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(FOCUS_SECONDS);
    setIsFirstActionDone(false);
  }, []);

  const onGenerate = async () => {
    setIsPlanFocused(true);
    setPlan(null);
    setLoading(true);
    onResetTimer();
    setTimerOpen(false);
    const planRes = await fetch(`${API_URL}/api/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, mode, tone, includeTime }),
    });
    setMessageChanged(input);

    if (!planRes.ok) {
      setIsPlanFocused(false);
      const errText = await planRes.text();
      const err = await planRes.json().catch(() => ({}));
      setLoading(false);

      if (planRes.status === 400) {
        setInputError(err.message ?? "Invalid input");
        showToast({
          kind: "error",
          title: t("toastInvalidInput"),
          description: t("toastInvalidInputDesc"),
        });
        return;
      }

      showToast({
        kind: "error",
        title: t("toastServerError"),
        description: t("toastServerErrorDesc"),
      });
      setPlan(null);
      throw new Error(`Plan error: ${planRes.status} ${errText}`);
    }

    const plan = await planRes.json();

    if (plan?.title) {
      setPlan(plan);
      setLoading(false);
    }

    return { plan };
  };

  const hasInputChanged =
    !!messageChanged && normalize(input) === normalize(messageChanged);

  const clearAll = () => {
    setInput("");
    setPlan(null);
    setLoading(false);
    setIsPlanFocused(false);
  };

  useKeyboardActions({
    onGenerate,
    loading,
    canGenerate: canSubmit,
  });

  return (
    <div className="min-h-screen bg-background">
      <ToastMessage toast={toast} onClose={hideToast} />
      <div className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border bg-muted" />
            <div className="leading-tight">
              <div className="text-sm font-semibold sm:block hidden">
                Focus Plan
              </div>
              <div className="text-xs text-muted-foreground sm:block hidden">
                {t("subtitle")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Badge variant="secondary" className="rounded-full sm:block hidden">
              {remaining} {t("freeLeft")}
            </Badge>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full cursor-pointer"
                >
                  Upgrade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogDescription>
                    {t("upgradeDescription")}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-2">
        <motion.div
          layout
          className={
            isPlanFocused ? "order-1 lg:order-2" : "order-2 lg:order-2"
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? "right-loading" : "right-has-plan"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <CardRight
                input={input}
                changeInput={hasInputChanged}
                plan={plan}
                onGenerate={onGenerate}
                loading={loading}
                includeTime={includeTime}
                clearAll={clearAll}
                onReset={onResetTimer}
                isFirstActionDone={isFirstActionDone}
                setIsFirstActionDone={setIsFirstActionDone}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                secondsLeft={secondsLeft}
                setSecondsLeft={setSecondsLeft}
                timerOpen={timerOpen}
                setTimerOpen={setTimerOpen}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          layout
          className={
            isPlanFocused ? "order-2 lg:order-1" : "order-1 lg:order-1"
          }
        >
          <CardLeft
            input={input}
            mode={mode}
            setMode={setMode}
            setInput={setInput}
            tone={tone}
            setTone={setTone}
            includeTime={includeTime}
            setIncludeTime={setIncludeTime}
            onGenerate={onGenerate}
            loading={loading}
            setInputError={setInputError}
            inputError={inputError}
          />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PageContainer;
