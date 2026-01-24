import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

type Plan = {
  title: string;
  steps: { title: string; details?: string; eta?: string }[];
  firstAction: string;
};

const demoPlan: Plan = {
  title: "3-дневный старт-план",
  steps: [
    {
      title: "Выбери 1 цель на 72 часа",
      details: "Например: обновить CV + 5 откликов + 2 тренировки",
      eta: "5 мин",
    },
    {
      title: "Разбей на 3 блока (Работа / Спорт / Проект)",
      details: "По 1–2 конкретных действия на блок",
      eta: "10 мин",
    },
    {
      title: "Сделай первый шаг за 10 минут",
      details: "Открой шаблон CV и заполни верхний блок",
      eta: "10 мин",
    },
    {
      title: "Поставь время на завтра",
      details: "2 слота по 45 минут — без отвлечений",
      eta: "2 мин",
    },
  ],
  firstAction: "Открой CV и заполни шапку + 3 буллета про опыт (10 минут).",
};

export default function OneScreenMvpUi() {
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [plan, setPlan] = React.useState<Plan | null>(null);

  const [mode, setMode] = React.useState<"fast" | "deep">("fast");
  const [tone, setTone] = React.useState<"strict" | "soft">("strict");
  const [includeTime, setIncludeTime] = React.useState(true);

  const remaining = 3; // MVP: фикс, потом из backend

  async function onGenerate() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      // TODO: replace with API call
      await new Promise((r) => setTimeout(r, 650));
      setPlan(demoPlan);
    } finally {
      setLoading(false);
    }
  }

  function onCopy() {
    if (!plan) return;
    const text = [
      plan.title,
      "",
      ...plan.steps.map(
        (s, i) =>
          `${i + 1}. ${s.title}${s.details ? ` — ${s.details}` : ""}${includeTime && s.eta ? ` (${s.eta})` : ""}`,
      ),
      "",
      `Первое действие: ${plan.firstAction}`,
    ].join("\n");
    navigator.clipboard?.writeText(text);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
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
            <Button variant="outline" className="rounded-full">
              Upgrade
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-2">
        {/* Left: Input */}
        <Card className="rounded-2xl hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">
              Что у тебя в голове прямо сейчас?
            </CardTitle>
            <CardDescription>
              Опиши хаос текстом. Мы превратим в чёткий план на 3–5 шагов.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Например: "Хочу найти работу, подтянуть английский и начать свой проект, но всё смешалось..."'
              className="min-h-[160px] resize-none rounded-2xl"
            />

            <div className="rounded-2xl border bg-muted/30 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Tabs
                  value={mode}
                  onValueChange={(v) => setMode(v as any)}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="rounded-full">
                    <TabsTrigger value="fast" className="rounded-full">
                      Fast
                    </TabsTrigger>
                    <TabsTrigger value="deep" className="rounded-full">
                      Deep
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="fast" />
                  <TabsContent value="deep" />
                </Tabs>

                <Tabs
                  value={tone}
                  onValueChange={(v) => setTone(v as any)}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="rounded-full">
                    <TabsTrigger value="strict" className="rounded-full">
                      Strict
                    </TabsTrigger>
                    <TabsTrigger value="soft" className="rounded-full">
                      Soft
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                  <Switch
                    id="time"
                    checked={includeTime}
                    onCheckedChange={(v) => setIncludeTime(Boolean(v))}
                  />
                  <Label
                    htmlFor="time"
                    className="text-sm text-muted-foreground"
                  >
                    Time estimates
                  </Label>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  Совет: чем честнее и проще текст, тем лучше план.
                </div>
                <Button
                  onClick={onGenerate}
                  disabled={loading || !input.trim()}
                  className="rounded-full"
                >
                  {loading ? "Generating..." : "Generate plan"}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full">
                No account needed
              </Badge>
              <Badge variant="outline" className="rounded-full">
                3–5 steps
              </Badge>
              <Badge variant="outline" className="rounded-full">
                First action in 10 min
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Right: Output */}
        <Card className="rounded-2xl hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Твой план</CardTitle>
            <CardDescription>
              Чёткие шаги. Без философии. Сразу к делу.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!plan ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                Нажми{" "}
                <span className="font-medium text-foreground">
                  Generate plan
                </span>{" "}
                — тут появится результат.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full">AI plan</Badge>
                    <span className="text-sm font-medium">{plan.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={onCopy}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={onGenerate}
                      disabled={loading}
                    >
                      Regenerate
                    </Button>
                    <Button className="rounded-full" disabled>
                      Save
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
                              <div className="text-sm text-muted-foreground">
                                {s.details}
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

                <div className="rounded-2xl border bg-muted/30 p-4">
                  <div className="text-sm font-semibold">
                    Первое действие (10 минут)
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {plan.firstAction}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button className="rounded-full">Start 10 min</Button>
                    <Button variant="outline" className="rounded-full">
                      I did it
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted-foreground">
        MVP: один экран. Дальше добавим историю планов и оплату.
      </div>
    </div>
  );
}
