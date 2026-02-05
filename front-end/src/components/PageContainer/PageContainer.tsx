import { useCallback, useState } from "react";

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

type Plan = {
  title: string;
  steps: { title: string; details?: string; eta?: string }[];
  firstAction: string;
};

const PageContainer = () => {
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

  const normalize = (v: string) => v.trim();

  const canSubmit = normalize(input).length >= 5 && !loading;

  const remaining = 3;

  const onResetTimer = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(10 * 60);
    setIsFirstActionDone(false);
  }, []);

  const onGenerate = async () => {
    setPlan(null);
    setLoading(true);
    onResetTimer();
    setTimerOpen(false);
    const planRes = await fetch("http://localhost:5001/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, mode, tone, includeTime }),
    });
    setMessageChanged(input);

    if (!planRes.ok) {
      const errText = await planRes.text();
      const err = await planRes.json().catch(() => ({}));
      setLoading(false);

      if (planRes.status === 400) {
        setInputError(err.message ?? "Invalid input");
        showToast({
          kind: "error",
          title: "Invalid input",
          description: "Please add more detail.",
        });
        return;
      }

      showToast({
        kind: "error",
        title: "Something went wrong",
        description:
          "The server is temporarily unavailable. Please try again in a moment.",
      });
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
              <div className="text-sm font-semibold">Focus Plan</div>
              <div className="text-xs text-muted-foreground">
                One thought → one actionable plan
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              {remaining} free left
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
                    Billing coming soon. You’re on free plan (3/day).
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-2">
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
      </div>

      <Footer />
    </div>
  );
};

export default PageContainer;
