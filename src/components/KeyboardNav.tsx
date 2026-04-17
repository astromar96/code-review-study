import { useEffect } from "react";
import { ALL_SECTIONS, neighborSections } from "../data/guide";

type Props = {
  activeId: string | null;
  onNavigate: (id: string) => void;
  onToggle: (id: string) => void;
};

export function KeyboardNav({ activeId, onNavigate, onToggle }: Props) {
  useEffect(() => {
    const isTyping = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };

    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;
      if (!activeId) return;

      const { prev, next } = neighborSections(activeId);

      switch (e.key) {
        case "j":
        case "ArrowRight":
          if (next) {
            e.preventDefault();
            onNavigate(next.id);
          }
          break;
        case "k":
        case "ArrowLeft":
          if (prev) {
            e.preventDefault();
            onNavigate(prev.id);
          }
          break;
        case "x":
          e.preventDefault();
          onToggle(activeId);
          break;
        case "g":
          if (ALL_SECTIONS[0]) {
            e.preventDefault();
            onNavigate(ALL_SECTIONS[0].id);
          }
          break;
        case "G":
          if (ALL_SECTIONS.length > 0) {
            e.preventDefault();
            onNavigate(ALL_SECTIONS[ALL_SECTIONS.length - 1].id);
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeId, onNavigate, onToggle]);

  return null;
}
