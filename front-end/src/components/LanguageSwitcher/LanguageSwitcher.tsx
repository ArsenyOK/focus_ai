import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const langs = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "uk", label: "UA" },
] as const;

const LanguageSelect = () => {
  const { i18n } = useTranslation();

  const current = (["en", "ru", "uk"] as const).includes(
    i18n.language as "en" | "ru" | "uk",
  )
    ? i18n.language
    : (i18n.resolvedLanguage ?? "en");

  return (
    <Select value={current} onValueChange={(v) => i18n.changeLanguage(v)}>
      <SelectTrigger
        className="
          h-10
          w-[30px]
          border-0
          bg-transparent
          px-0
          text-sm
          font-semibold
          text-slate-800
          shadow-none
          hover:bg-transparent
          focus:ring-0
          focus:ring-offset-0
          [&>svg]:hidden
          outline-none
        "
      >
        <SelectValue className="outline-none" />
      </SelectTrigger>

      <SelectContent className="rounded-xl border-slate-200 shadow-lg">
        <SelectGroup>
          {langs.map((l) => (
            <SelectItem key={l.code} value={l.code} className="text-sm">
              {l.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export const LanguageSwitcher = ({ remaining }: { remaining: number }) => {
  const { t } = useTranslation();

  return (
    <div className="inline-flex h-10 items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-3">
        <LanguageSelect />
      </div>
      <div className="h-6 w-px bg-slate-200" />
      <div className="px-4 text-sm font-400 text-secondary-foreground">
        {remaining} {t("freeLeft")}
      </div>
    </div>
  );
};
