import { useCallback, useEffect, useMemo, useState } from "react";
import { ALL_SECTIONS, DOC_TITLE, PARTS, findSection } from "./content";
import { useHashRoute, type Route } from "./hooks/useHashRoute";
import { getLastSection, setLastSection, useProgress } from "./hooks/useProgress";
import { ProgressHeader } from "./components/ProgressHeader";
import { Sidebar } from "./components/Sidebar";
import { SectionView } from "./components/SectionView";
import { KeyboardNav } from "./components/KeyboardNav";
import { Home } from "./components/Home";
import { SourcesView } from "./components/SourcesView";
import { ChecklistsView } from "./components/ChecklistsView";

export function App() {
  const { route, go, navigateSection } = useHashRoute();
  const progress = useProgress(ALL_SECTIONS.length);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const navigateAndClose = useCallback(
    (next: Route) => {
      go(next);
      setDrawerOpen(false);
    },
    [go],
  );

  const activeSection = useMemo(() => {
    if (route.kind !== "section") return null;
    return findSection(route.id);
  }, [route]);

  useEffect(() => {
    if (route.kind === "section" && activeSection) {
      setLastSection(activeSection.id);
    }
  }, [route, activeSection]);

  useEffect(() => {
    const el = document.querySelector(".main-scroll");
    if (el) el.scrollTop = 0;
  }, [route]);

  const onResume = useCallback(() => {
    const last = getLastSection();
    if (last && findSection(last)) {
      go({ kind: "section", id: last });
    } else if (ALL_SECTIONS[0]) {
      go({ kind: "section", id: ALL_SECTIONS[0].id });
    }
  }, [go]);

  const onGoHome = useCallback(() => go({ kind: "home" }), [go]);

  const lastSectionId = typeof window !== "undefined" ? getLastSection() : null;
  const resumeSection = lastSectionId ? findSection(lastSectionId) : null;

  const showHomeInHeader = route.kind !== "home";

  return (
    <div className={`layout${drawerOpen ? " drawer-open" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-head">
          <button
            type="button"
            className="doc-title doc-title-btn"
            onClick={() => navigateAndClose({ kind: "home" })}
          >
            {DOC_TITLE}
          </button>
        </div>
        <Sidebar
          parts={PARTS}
          route={route}
          isDone={progress.isDone}
          onToggle={progress.toggle}
          onNavigate={navigateAndClose}
        />
      </aside>
      <div
        className="drawer-scrim"
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <main className="main">
        <ProgressHeader
          parts={PARTS}
          stats={progress.stats}
          isDone={progress.isDone}
          onResume={onResume}
          onGoHome={onGoHome}
          onOpenDrawer={() => setDrawerOpen(true)}
          showHome={showHomeInHeader}
        />
        <div className="main-scroll">
          {route.kind === "home" ? (
            <Home
              parts={PARTS}
              isDone={progress.isDone}
              onOpenSection={navigateSection}
              onOpenChecklists={() => go({ kind: "checklists" })}
              onOpenSources={() => go({ kind: "sources" })}
              resumeSectionId={resumeSection?.id ?? null}
              resumeSectionTitle={resumeSection?.title ?? null}
              onResume={onResume}
            />
          ) : route.kind === "checklists" ? (
            <ChecklistsView />
          ) : route.kind === "sources" || route.kind === "source" ? (
            <SourcesView
              focusId={route.kind === "source" ? route.id : null}
              onOpenSection={navigateSection}
            />
          ) : activeSection ? (
            <SectionView
              section={activeSection}
              isDone={progress.isDone(activeSection.id)}
              onToggle={() => progress.toggle(activeSection.id)}
              onMarkAndNext={() => {
                progress.markDone(activeSection.id);
                const idx = ALL_SECTIONS.findIndex((s) => s.id === activeSection.id);
                const next = ALL_SECTIONS[idx + 1];
                if (next) navigateSection(next.id);
              }}
              hasNext={ALL_SECTIONS.findIndex((s) => s.id === activeSection.id) < ALL_SECTIONS.length - 1}
            />
          ) : (
            <div className="empty">
              <p>Section not found.</p>
              <button type="button" className="btn-primary" onClick={onGoHome}>Back to home</button>
            </div>
          )}
        </div>
      </main>
      <KeyboardNav
        route={route}
        onNavigate={go}
        onToggle={(id) => progress.toggle(id)}
      />
    </div>
  );
}
