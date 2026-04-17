import { useCallback, useEffect, useState } from "react";

export type Route =
  | { kind: "home" }
  | { kind: "section"; id: string }
  | { kind: "checklists" }
  | { kind: "sources" }
  | { kind: "source"; id: string };

const SECTION_PREFIX = "#/section/";
const SOURCE_PREFIX = "#/sources/";

function parseHash(): Route {
  const h = window.location.hash;
  if (!h || h === "#" || h === "#/" || h === "") return { kind: "home" };
  if (h.startsWith(SECTION_PREFIX)) {
    const id = h.slice(SECTION_PREFIX.length);
    if (id.length > 0) return { kind: "section", id };
    return { kind: "home" };
  }
  if (h === "#/checklists") return { kind: "checklists" };
  if (h === "#/sources") return { kind: "sources" };
  if (h.startsWith(SOURCE_PREFIX)) {
    const id = h.slice(SOURCE_PREFIX.length);
    if (id.length > 0) return { kind: "source", id };
    return { kind: "sources" };
  }
  return { kind: "home" };
}

function hashFor(route: Route): string {
  switch (route.kind) {
    case "home":
      return "#/";
    case "section":
      return `${SECTION_PREFIX}${route.id}`;
    case "checklists":
      return "#/checklists";
    case "sources":
      return "#/sources";
    case "source":
      return `${SOURCE_PREFIX}${route.id}`;
  }
}

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = useCallback((next: Route) => {
    const nextHash = hashFor(next);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      setRoute(next);
    }
  }, []);

  const navigateSection = useCallback((id: string) => go({ kind: "section", id }), [go]);

  return { route, go, navigateSection };
}
