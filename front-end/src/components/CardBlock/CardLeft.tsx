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

interface CardLeftProps {
  input: string;
  mode: "fast" | "deep";
  setMode: (mode: "fast" | "deep") => void;
  setInput: (input: string) => void;
  tone: "strict" | "soft";
  setTone: (tone: "strict" | "soft") => void;
  includeTime: boolean;
  setIncludeTime: (includeTime: boolean) => void;
  onGenerate: () => void;
  loading: boolean;
}

const CardLeft = ({
  input,
  mode,
  setMode,
  setInput,
  tone,
  setTone,
  includeTime,
  setIncludeTime,
  onGenerate,
  loading,
}: CardLeftProps) => {
  return (
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
              <Label htmlFor="time" className="text-sm text-muted-foreground">
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
  );
};

export default CardLeft;
