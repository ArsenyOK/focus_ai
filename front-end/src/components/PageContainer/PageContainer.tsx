import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Footer from "../Footer/Footer";
import CardRight from "../CardBlock/CardRight";
import CardLeft from "../CardBlock/CardLeft";

type Plan = {
  title: string;
  steps: { title: string; details?: string; eta?: string }[];
  firstAction: string;
};

const PageContainer = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);

  const [mode, setMode] = useState<"fast" | "deep">("fast");
  const [tone, setTone] = useState<"strict" | "soft">("strict");
  const [includeTime, setIncludeTime] = useState(true);

  const remaining = 3;

  const onGenerate = async () => {
    setLoading(true);
    const planRes = await fetch("http://localhost:5001/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, mode, tone, includeTime }),
    });

    if (!planRes.ok) {
      const errText = await planRes.text();
      setLoading(false);
      throw new Error(`Plan error: ${planRes.status} ${errText}`);
    }

    const plan = await planRes.json();

    if (plan?.title) {
      setPlan(plan);
      setLoading(false);
    }

    return { plan };
  };

  return (
    <div className="min-h-screen bg-background">
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
        />

        <CardRight
          plan={plan}
          onGenerate={onGenerate}
          loading={loading}
          includeTime={includeTime}
        />
      </div>

      <Footer />
    </div>
  );
};

export default PageContainer;
