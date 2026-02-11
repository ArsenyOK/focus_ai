import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);

    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
};
