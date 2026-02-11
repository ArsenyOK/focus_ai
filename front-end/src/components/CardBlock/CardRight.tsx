import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, CircleX, Copy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import SkeletonBlock from "../SkeletonBlock/SkeletonBlock";
import { FocusTimer } from "../FocusTimer/FocusTimer";
import { useToastMessage } from "@/hooks/useToastMessage";
import { ToastMessage } from "../ToastMessage/ToastMessage";
import { FOCUS_SECONDS } from "@/lib/consts";
import { useTranslation } from "react-i18next";

interface CardRightProps {
  plan: {
    title: string;
    steps: { title: string; details?: string; eta?: string }[];
    firstAction: string;
  } | null;
  onGenerate: () => void;
  loading: boolean;
  includeTime: boolean;
  clearAll: () => void;
  changeInput: boolean;
  input: string;
  onReset: () => void;
  isFirstActionDone: boolean;
  setIsFirstActionDone: (done: boolean) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  secondsLeft: number;
  setSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
  timerOpen: boolean;
  setTimerOpen: (open: boolean) => void;
}

const CardRight = ({
  plan,
  onGenerate,
  loading,
  includeTime,
  clearAll,
  changeInput,
  input,
  onReset,
  isFirstActionDone,
  setIsFirstActionDone,
  isRunning,
  setIsRunning,
  secondsLeft,
  setSecondsLeft,
  timerOpen,
  setTimerOpen,
}: CardRightProps) => {
  const { t } = useTranslation();

  const [copy, setCopy] = useState<boolean>(false);
  const { toast, showToast, hideToast } = useToastMessage();

  const onCopy = async () => {
    if (!plan) return;

    const text = [
      plan.title,
      "",
      ...plan.steps.map(
        (s, i) =>
          `${i + 1}. ${s.title}${s.details ? ` — ${s.details}` : ""}${
            includeTime && s.eta ? ` (${s.eta})` : ""
          }`,
      ),
      "",
      `Первое действие: ${plan.firstAction}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopy(true);

      setTimeout(() => {
        setCopy(false);
      }, 1800);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const onStart = () => {
    if (secondsLeft === 0) setSecondsLeft(FOCUS_SECONDS);
    setTimerOpen(true);
    setIsRunning(true);
  };

  const onPause = () => setIsRunning(false);
  const onResume = () => {
    if (secondsLeft === 0) setSecondsLeft(FOCUS_SECONDS);
    setIsRunning(true);
  };

  const onCloseTimer = useCallback(() => {
    setTimerOpen(false);
    onReset();
  }, [onReset, setTimerOpen]);

  const onDone = () => {
    setIsRunning(false);
    setIsFirstActionDone(true);
    setTimerOpen(false);

    showToast({
      kind: "success",
      title: t("toastSuccessMessage"),
      description: t("toastSuccessMessageDesc"),
    });
  };

  const handleClearPlan = () => {
    clearAll();
    onReset();
  };

  useEffect(() => {
    if (!isRunning) return;

    const id = window.setInterval(() => {
      setSecondsLeft((s: number) => {
        if (s <= 1) {
          window.clearInterval(id);
          setIsRunning(false);
          showToast({
            kind: "warning",
            title: t("toastTimeIsUpToast"),
            description: t("toastTimeIsUpDesc"),
          });
          onCloseTimer();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunning, onCloseTimer, showToast, setSecondsLeft, setIsRunning, t]);

  return (
    <Card
      className={cn(
        "rounded-2xl hover:shadow-lg transition-shadow transition-all duration-300",
        loading &&
          "ring-2 ring-indigo-500 animate-[neon_1.6s_ease-in-out_infinite]",
      )}
    >
      <ToastMessage toast={toast} onClose={hideToast} />
      <CardHeader>
        <CardTitle className="text-lg">{t("rightCardTitle")}</CardTitle>
        <CardDescription>{t("rightCardDescription")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!plan ? (
          loading ? (
            <SkeletonBlock />
          ) : (
            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              {t("click")}{" "}
              <span className="font-medium text-foreground">Generate plan</span>{" "}
              {t("clickPhrase")}
            </div>
          )
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge className="rounded-full">AI plan</Badge>
                <span className="text-sm font-medium">{plan.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  disabled={copy}
                  variant="outline"
                  size="sm"
                  onClick={onCopy}
                  className="rounded-full gap-2 transition-all duration-200 ease-out cursor-pointer"
                >
                  {copy ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="sm:block hidden">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="sm:block hidden">{t("copy")}</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="rounded-full cursor-pointer"
                  onClick={onGenerate}
                  disabled={loading || changeInput || !input}
                >
                  Regenerate
                </Button>

                {/* <Button className="rounded-full cursor-pointer" disabled>
                  {t("save")}
                </Button> */}

                <Button
                  onClick={handleClearPlan}
                  className="rounded-full cursor-pointer"
                >
                  <CircleX />
                  <span className="sm:block hidden">{t("clear")}</span>
                </Button>
              </div>
            </div>

            <Separator />

            <ScrollArea className="h-[280px] pr-2">
              <div className="space-y-3">
                {plan.steps.map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border p-4 hover:bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">
                          {idx + 1}. {s.title}
                        </div>

                        {s.details && (
                          <div className="mt-1 border-l-2 border-gray-200 pl-3">
                            <p className="text-sm text-gray-700">{s.details}</p>
                          </div>
                        )}
                      </div>

                      {includeTime && s.eta ? (
                        <Badge variant="secondary" className="rounded-full">
                          {s.eta}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {!isFirstActionDone && (
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="text-sm font-semibold">
                  {t("firstActionMin")}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {plan.firstAction}
                </div>

                <div className="mt-3 flex gap-2">
                  <Button
                    className="rounded-full cursor-pointer"
                    onClick={onStart}
                  >
                    {t("startButton")}
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full cursor-pointer"
                    onClick={onDone}
                  >
                    {t("buttonDone")}
                  </Button>
                </div>
              </div>
            )}

            <FocusTimer
              isOpen={timerOpen}
              secondsLeft={secondsLeft}
              totalSeconds={FOCUS_SECONDS}
              isRunning={isRunning}
              onPause={onPause}
              onResume={onResume}
              onReset={onReset}
              onClose={onCloseTimer}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CardRight;
