import { Separator } from "@/components/ui/separator";

const SkeletonBlock = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-44 rounded bg-muted animate-pulse" />
        </div>
      </div>

      <Separator />

      <div className="rounded-2xl border bg-muted/10 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <div className="text-sm font-medium text-muted-foreground">
            Generating a plan…
          </div>
        </div>

        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-full rounded bg-muted animate-pulse" />
                  <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border bg-muted/30 p-4">
        <div className="h-4 w-56 rounded bg-muted animate-pulse" />
        <div className="mt-2 h-3 w-full rounded bg-muted animate-pulse" />
        <div className="mt-2 h-3 w-5/6 rounded bg-muted animate-pulse" />

        <div className="mt-4 flex gap-2">
          <div className="h-9 w-28 rounded-full bg-muted animate-pulse" />
          <div className="h-9 w-20 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonBlock;
