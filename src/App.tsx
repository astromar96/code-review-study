import { useEffect, useMemo } from "react";
import { ALL_SECTIONS, DOC_INTRO, DOC_TITLE, PARTS, findSection } from "./data/guide";
import { useHashRoute } from "./hooks/useHashRoute";
import { getLastSection, setLastSection, useProgress } from "./hooks/useProgress";
import { ProgressHeader } from "./components/ProgressHeader";
import { Sidebar } from "./components/Sidebar";
import { SectionView } from "./components/SectionView";
import { KeyboardNav } from "./components/KeyboardNav";

export function App() {
  const { activeId, navigate } = useHashRoute();
  const progress = useProgress(ALL_SECTIONS.length);

  const resolvedId = useMemo(() => {
    if (activeId && findSection(activeId)) return activeId;
    return ALL_SECTIONS[0]?.id ?? null;
  }, [activeId]);

  useEffect(() => {
    if (activeId === null) {
      const last = getLastSection();
      if (last && findSection(last)) {
        navigate(last);
      } else if (ALL_SECTIONS[0]) {
        navigate(ALL_SECTIONS[0].id);
      }
    }
  }, [activeId, navigate]);

  useEffect(() => {
    if (resolvedId) setLastSection(resolvedId);
  }, [resolvedId]);

  useEffect(() => {
    const el = document.querySelector(".main-scroll");
    if (el) el.scrollTop = 0;
  }, [resolvedId]);

  const activeSection = resolvedId ? findSection(resolvedId) : null;

  const onResume = () => {
    const last = getLastSection();
    if (last && findSection(last)) navigate(last);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="doc-title">{DOC_TITLE}</div>
        </div>
        <Sidebar
          parts={PARTS}
          activeId={resolvedId}
          isDone={progress.isDone}
          onToggle={progress.toggle}
          onNavigate={navigate}
        />
      </aside>
      <main className="main">
        <ProgressHeader parts={PARTS} stats={progress.stats} isDone={progress.isDone} onResume={onResume} />
        <div className="main-scroll">
          {resolvedId === ALL_SECTIONS[0]?.id && DOC_INTRO.trim().length > 0 && (
            <div className="doc-intro">{DOC_INTRO}</div>
          )}
          {activeSection ? (
            <SectionView
              section={activeSection}
              isDone={progress.isDone(activeSection.id)}
              onToggle={() => progress.toggle(activeSection.id)}
              onMarkAndNext={() => {
                progress.markDone(activeSection.id);
                const idx = ALL_SECTIONS.findIndex((s) => s.id === activeSection.id);
                const next = ALL_SECTIONS[idx + 1];
                if (next) navigate(next.id);
              }}
              hasNext={ALL_SECTIONS.findIndex((s) => s.id === activeSection.id) < ALL_SECTIONS.length - 1}
            />
          ) : (
            <div className="empty">Select a section to begin.</div>
          )}
        </div>
      </main>
      <KeyboardNav
        activeId={resolvedId}
        onNavigate={navigate}
        onToggle={(id) => progress.toggle(id)}
      />
    </div>
  );
}
