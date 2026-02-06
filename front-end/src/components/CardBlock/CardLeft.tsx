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
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

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
  inputError: string | null;
  setInputError: (error: string | null) => void;
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
  inputError,
  setInputError,
}: CardLeftProps) => {
  const { t } = useTranslation();

  return (
    <Card className="rounded-2xl hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{t("leftCardTitle")}</CardTitle>
        <CardDescription>{t("leftCardDescription")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (inputError) setInputError(null);
          }}
          disabled={loading}
          placeholder={t("placeholderInput")}
          className={cn(
            "min-h-[160px] resize-none rounded-2xl transition-all duration-200",
            inputError &&
              "border-red-500 ring-2 ring-red-500/40 focus-visible:ring-red-500",
          )}
        />

        <div className="rounded-2xl border bg-muted/30 p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "fast" | "deep")}
              className="w-full sm:w-auto"
            >
              <TabsList className="rounded-full">
                <TabsTrigger
                  disabled={loading}
                  value="fast"
                  className="rounded-full"
                >
                  {t("fast")}
                </TabsTrigger>
                <TabsTrigger
                  disabled={loading}
                  value="deep"
                  className="rounded-full"
                >
                  {t("deep")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="fast" />
              <TabsContent value="deep" />
            </Tabs>

            <Tabs
              value={tone}
              onValueChange={(v) => setTone(v as "strict" | "soft")}
              className="w-full sm:w-auto"
            >
              <TabsList className="rounded-full">
                <TabsTrigger
                  disabled={loading}
                  value="strict"
                  className="rounded-full"
                >
                  {t("strict")}
                </TabsTrigger>
                <TabsTrigger
                  value="soft"
                  className="rounded-full"
                  disabled={loading}
                >
                  {t("soft")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Switch
                id="time"
                checked={includeTime}
                disabled={loading}
                onCheckedChange={(v) => setIncludeTime(Boolean(v))}
              />
              <Label htmlFor="time" className="text-sm text-muted-foreground">
                {t("timeEstimates")}
              </Label>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">{t("tipLeft")}</div>
            <Button
              onClick={onGenerate}
              disabled={loading || !input.trim()}
              className="rounded-full cursor-pointer"
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
