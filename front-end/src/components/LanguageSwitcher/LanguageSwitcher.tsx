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

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const current = (["en", "ru", "uk"] as const).includes(i18n.language as any)
    ? i18n.language
    : (i18n.resolvedLanguage ?? "en");

  return (
    <Select value={current} onValueChange={(v) => i18n.changeLanguage(v)}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {langs.map((l) => (
            <SelectItem key={l.code} value={l.code}>
              {l.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
