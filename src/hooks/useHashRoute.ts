import { useCallback, useEffect, useState } from "react";

const PREFIX = "#/section/";

function readHashId(): string | null {
  const h = window.location.hash;
  if (!h.startsWith(PREFIX)) return null;
  const id = h.slice(PREFIX.length);
  return id.length > 0 ? id : null;
}

export function useHashRoute() {
  const [activeId, setActiveId] = useState<string | null>(() => readHashId());

  useEffect(() => {
    const onHash = () => setActiveId(readHashId());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((id: string) => {
    const next = `${PREFIX}${id}`;
    if (window.location.hash !== next) {
      window.location.hash = next;
    } else {
      setActiveId(id);
    }
  }, []);

  return { activeId, navigate };
}
