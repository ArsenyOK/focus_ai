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
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import SkeletonBlock from "../SkeletonBlock/SkeletonBlock";
import { FocusTimer } from "../FocusTimer/FocusTimer";
import { useToastMessage } from "@/hooks/useToastMessage";
import { ToastMessage } from "../ToastMessage/ToastMessage";

interface CardRightProps {
  plan: {
    title: string;
    steps: { title: string; details?: string; eta?: string }[];
    firstAction: string;
  } | null;
  onGenerate: () => void;
  loading: boolean;
  includeTime: boolean;
}

const CardRight = ({
  plan,
  onGenerate,
  loading,
  includeTime,
}: CardRightProps) => {
  const FOCUS_SECONDS = 10 * 1;

  const [copy, setCopy] = useState<boolean>(false);
  const { toast, showToast, hideToast } = useToastMessage();

  const [isFirstActionDone, setIsFirstActionDone] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);

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

  const formatTime = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
  const onReset = () => {
    setIsRunning(false);
    setSecondsLeft(FOCUS_SECONDS);
  };
  const onCloseTimer = () => setTimerOpen(false);

  const onDone = () => {
    setIsRunning(false);
    setIsFirstActionDone(true);
    setTimerOpen(false);

    showToast({
      kind: "success",
      title: "Отлично! ✅",
      description: "Первое действие выполнено.",
    });
  };

  useEffect(() => {
    if (!isRunning) return;

    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setIsRunning(false);

          showToast({
            kind: "warning",
            title: "Время вышло ⏳",
            description: "Закрой задачу или перезапусти 10 минут.",
          });
          onCloseTimer();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    setIsFirstActionDone(false);
    setIsRunning(false);
    setSecondsLeft(FOCUS_SECONDS);
  }, [plan?.firstAction]);

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
        <CardTitle className="text-lg">Твой план</CardTitle>
        <CardDescription>
          Чёткие шаги. Без философии. Сразу к делу.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!plan ? (
          loading ? (
            <SkeletonBlock />
          ) : (
            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              Нажми{" "}
              <span className="font-medium text-foreground">Generate plan</span>{" "}
              — тут появится результат.
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
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="rounded-full cursor-pointer"
                  onClick={onGenerate}
                  disabled={loading}
                >
                  Regenerate
                </Button>

                <Button className="rounded-full cursor-pointer" disabled>
                  Save
                </Button>

                <Button className="rounded-full cursor-pointer" disabled>
                  Clear
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
                  Первое действие (10 минут)
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {plan.firstAction}
                </div>

                <div className="mt-3 flex gap-2">
                  <Button
                    className="rounded-full cursor-pointer"
                    onClick={onStart}
                  >
                    Start 10 min
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full cursor-pointer"
                    onClick={onDone}
                  >
                    I did it
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
