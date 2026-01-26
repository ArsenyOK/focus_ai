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
  const onCopy = () => {
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
  };

  return (
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
            <span className="font-medium text-foreground">Generate plan</span> —
            тут появится результат.
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
  );
};

export default CardRight;
