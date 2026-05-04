/**
 * TechConstellation — interactive orbital tech stack visualisation.
 *
 * This is a React island (hydrated client:visible from the Astro wrapper)
 * because the interaction — hover to light up connections + subtle scroll
 * wobble of the nodes — benefits from real state and a scroll listener
 * scoped to the component.
 *
 * Design: three concentric orbital rings. Core languages sit on the inner
 * ring, frontend/infra/practices on the middle ring, specialisations on the
 * outer ring. Each ring rotates at a slightly different rate driven by
 * page scroll, so the layout "breathes" as the user scrolls past.
 *
 * Interaction: hovering a node dims unrelated nodes, brightens the
 * connected subgraph, and draws the edges between hovered node and its
 * connections at full opacity.
 *
 * Layout: the constellation lives inside an `aspect-square` sub-container
 * with a viewBox-based percentage coordinate system, so it scales fluidly
 * without a JS resize observer. The outer wrapper adds 36px of vertical
 * padding (matching the original `h = w + 72` buffer) so outer-ring icons
 * and labels are not clipped by the parent section's overflow-hidden.
 *
 * Respects prefers-reduced-motion by freezing the scroll-driven wobble
 * and ring rotation (nodes remain at their base angle).
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { t } from '@/i18n/utils';

type Group = 'backend' | 'frontend' | 'infra' | 'practice' | 'ai';

interface TechNode {
  id: string;
  label: string;
  group: Group;
  angle: number;
  ring: 1 | 2 | 3;
  color: string;
  size: number;
}

const TECH_NODES: TechNode[] = [
  // Ring 1 — languages (backend + frontend), 7 nodes at ~51.4° spacing
  { id: 'ts', label: 'TypeScript', group: 'frontend', angle: 0, ring: 1, color: '#3178c6', size: 44 },
  { id: 'react', label: 'React', group: 'frontend', angle: 51, ring: 1, color: '#61dafb', size: 42 },
  { id: 'next', label: 'Next.js', group: 'frontend', angle: 103, ring: 1, color: '#e2e8f0', size: 40 },
  { id: 'java', label: 'Java', group: 'backend', angle: 154, ring: 1, color: '#f89820', size: 38 },
  { id: 'csharp', label: 'C#', group: 'backend', angle: 206, ring: 1, color: '#9a67b3', size: 38 },
  { id: 'node', label: 'Node.js', group: 'backend', angle: 257, ring: 1, color: '#68a063', size: 36 },


  // Ring 2 — frontend / infra / practices / ai
  { id: 'astro', label: 'Astro', group: 'frontend', angle: 30, ring: 2, color: '#ff5d01', size: 32 },
  { id: 'tailwind', label: 'Tailwind', group: 'frontend', angle: 90, ring: 2, color: '#38bdf8', size: 30 },
  { id: 'docker', label: 'Docker', group: 'infra', angle: 150, ring: 2, color: '#2496ed', size: 30 },
  { id: 'ghactions', label: 'GH Actions', group: 'infra', angle: 210, ring: 2, color: '#2088ff', size: 28 },
  { id: 'tdd', label: 'TDD', group: 'practice', angle: 270, ring: 2, color: '#a78bfa', size: 34 },
  { id: 'claude', label: 'Claude Code', group: 'ai', angle: 330, ring: 2, color: '#d4a574', size: 32 },

  // Ring 3 — specialisations
  { id: 'hexarch', label: 'Hexagonal', group: 'practice', angle: 15, ring: 3, color: '#a78bfa', size: 26 },
  { id: 'solid', label: 'SOLID', group: 'practice', angle: 75, ring: 3, color: '#c084fc', size: 24 },
  { id: 'dotnet', label: '.NET', group: 'backend', angle: 135, ring: 3, color: '#7c3aed', size: 26 },
  { id: 'copilot', label: 'Copilot', group: 'ai', angle: 195, ring: 3, color: '#d4a574', size: 24 },
  { id: 'gemini', label: 'Gemini', group: 'ai', angle: 309, ring: 1, color: '#d4a574', size: 36 },
  { id: 'gcloud', label: 'Google Cloud', group: 'infra', angle: 255, ring: 3, color: '#4285f4', size: 26 },
  { id: 'do', label: 'DigitalOcean', group: 'infra', angle: 315, ring: 3, color: '#0080ff', size: 24 },
];

const CONNECTIONS: Array<[string, string]> = (() => {
  const result: Array<[string, string]> = [];
  const groups = new Map<string, TechNode[]>();
  TECH_NODES.forEach((n) => {
    if (!groups.has(n.group)) groups.set(n.group, []);
    groups.get(n.group)!.push(n);
  });
  groups.forEach((nodes) => {
    const sorted = [...nodes].sort((a, b) => a.angle - b.angle);
    for (let i = 0; i < sorted.length - 1; i++) {
      result.push([sorted[i].id, sorted[i + 1].id]);
    }
  });
  return result;
})();

const GROUP_LABELS: Record<Group, { es: string; en: string }> = {
  backend: { es: 'Backend', en: 'Backend' },
  frontend: { es: 'Frontend', en: 'Frontend' },
  infra: { es: 'Infraestructura', en: 'Infrastructure' },
  practice: { es: 'Prácticas', en: 'Practices' },
  ai: { es: 'IA', en: 'AI' },
};

interface Props {
  lang?: 'es' | 'en';
}

/**
 * Scroll-driven time value used to animate the orbital rotation + wobble.
 * Returns 0 when prefers-reduced-motion is enabled, so consumers can use a
 * truthy check to skip animation math.
 */
function useOrbitalTime() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setTime(window.scrollY * 0.0009);
      });
    };

    const isReduceMotion = (): boolean =>
      motionQuery.matches ||
      document.documentElement.hasAttribute('data-motion-reduce');

    const sync = (reduce: boolean) => {
      if (reduce) {
        window.removeEventListener('scroll', onScroll);
        setTime(0);
      } else {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }
    };

    sync(isReduceMotion());

    const onMotionChange = () => sync(isReduceMotion());
    motionQuery.addEventListener('change', onMotionChange);

    // Also react when data-motion-reduce is toggled on <html> at runtime
    const observer = new MutationObserver(() => sync(isReduceMotion()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion-reduce'] });

    return () => {
      window.removeEventListener('scroll', onScroll);
      motionQuery.removeEventListener('change', onMotionChange);
      observer.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return time;
}

export default function TechConstellation({ lang = 'es' }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const time = useOrbitalTime();

  // Percentage-based viewBox: cx/cy at 50, ringRadii as % of width.
  const cx = 50;
  const cy = 50;
  const ringRadii = useMemo(() => [0, 22, 35, 46], []);

  const getPos = useCallback(
    (node: TechNode) => {
      const r = ringRadii[node.ring];
      // 0.7% wobble ≈ 4px on a 600px container, matching the original feel.
      const wobble = time === 0 ? 0 : Math.sin(time + node.angle * 0.05) * 0.7;
      const ringSpeed: Record<number, number> = { 1: 8, 2: -5, 3: 3 };
      const a = ((node.angle + time * (ringSpeed[node.ring] || 0)) * Math.PI) / 180;
      return {
        x: cx + Math.cos(a) * (r + wobble),
        y: cy + Math.sin(a) * (r + wobble),
      };
    },
    [ringRadii, time]
  );

  const nodeMap = useMemo(() => {
    const map: Record<string, TechNode & { pos: { x: number; y: number } }> = {};
    TECH_NODES.forEach((n) => {
      map[n.id] = { ...n, pos: getPos(n) };
    });
    return map;
  }, [getPos]);

  const hoveredGroup = useMemo(
    () => (hovered ? TECH_NODES.find((n) => n.id === hovered)?.group ?? null : null),
    [hovered]
  );

  const isConnected = useCallback(
    (id: string) => {
      if (!hoveredGroup) return false;
      return TECH_NODES.find((n) => n.id === id)?.group === hoveredGroup;
    },
    [hoveredGroup]
  );

  return (
    <div
      className="relative mx-auto w-full max-w-2xl py-9"
      role="group"
      aria-label={t(lang, 'home.stack.ariaLabel')}
    >
      <div className="relative aspect-square w-full">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* Orbital rings */}
          {[1, 2, 3].map((ring) => (
            <circle
              key={`ring-${ring}`}
              cx={cx}
              cy={cy}
              r={ringRadii[ring]}
              fill="none"
              vectorEffect="non-scaling-stroke"
              className="stroke-[rgba(94,58,238,0.22)] dark:stroke-[rgba(96,165,250,0.28)]"
              strokeWidth={1}
              strokeDasharray="4 8"
            />
          ))}

          {/* Connection edges */}
          {CONNECTIONS.map(([a, b]) => {
            const na = nodeMap[a];
            const nb = nodeMap[b];
            if (!na || !nb) return null;
            const active = hoveredGroup !== null && na.group === hoveredGroup;
            return (
              <line
                key={`${a}-${b}`}
                x1={na.pos.x}
                y1={na.pos.y}
                x2={nb.pos.x}
                y2={nb.pos.y}
                vectorEffect="non-scaling-stroke"
                className={
                  active
                    ? 'stroke-[rgba(94,58,238,0.65)] dark:stroke-[rgba(96,165,250,0.65)] [transition:all_0.4s_ease]'
                    : 'stroke-[rgba(94,58,238,0.18)] dark:stroke-[rgba(96,165,250,0.22)] [transition:all_0.4s_ease]'
                }
                strokeWidth={active ? 1.8 : 0.8}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {TECH_NODES.map((node) => {
          const { pos } = nodeMap[node.id];
          const active = hovered === node.id;
          const connected = isConnected(node.id);
          const dimmed = hovered !== null && !active && !connected;
          return (
            <button
              type="button"
              key={node.id}
              className="absolute flex cursor-pointer flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-ink-900"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: active ? 20 : connected ? 10 : 1,
                transition: 'opacity 0.3s, filter 0.3s',
                opacity: dimmed ? 0.15 : 1,
                filter: active ? 'brightness(1.3)' : 'none',
                background: 'transparent',
                border: 0,
                padding: 0,
              }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered((h) => (h === node.id ? null : h))}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered((h) => (h === node.id ? null : h))}
              aria-label={`${node.label} — ${GROUP_LABELS[node.group][lang]}`}
            >
              {active && (
                <div
                  aria-hidden="true"
                  className="absolute rounded-full"
                  style={{
                    width: node.size * 2.2,
                    height: node.size * 2.2,
                    background: `radial-gradient(circle, ${node.color}33 0%, transparent 70%)`,
                  }}
                />
              )}
              <div
                className="flex items-center justify-center rounded-full border"
                style={{
                  width: node.size,
                  height: node.size,
                  backgroundColor: `${node.color}18`,
                  borderColor: active ? `${node.color}90` : `${node.color}40`,
                  transition: 'all 0.3s ease',
                  boxShadow: active ? `0 0 20px ${node.color}40` : 'none',
                }}
              >
                <span
                  className="font-mono font-bold"
                  style={{
                    fontSize: node.size * 0.28,
                    color: node.color,
                  }}
                >
                  {node.label.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span
                className="mt-1 whitespace-nowrap font-mono text-slate-600/75 dark:text-slate-400/70"
                style={{
                  fontSize: active ? 11 : 9,
                  color: active ? node.color : undefined,
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.3s',
                  textShadow: active ? `0 0 10px ${node.color}60` : 'none',
                }}
              >
                {node.label}
              </span>
              {active && (
                <span
                  className="mt-0.5 rounded-full px-2 py-0.5 text-center font-mono"
                  style={{
                    fontSize: 8,
                    backgroundColor: `${node.color}20`,
                    color: `${node.color}cc`,
                    border: `1px solid ${node.color}30`,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  {GROUP_LABELS[node.group][lang]}
                </span>
              )}
            </button>
          );
        })}

        {/* Core label */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <span
            className="font-display font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-500"
            style={{ fontSize: 14 }}
          >
            Stack
          </span>
        </div>
      </div>
    </div>
  );
}
