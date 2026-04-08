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
 * Respects prefers-reduced-motion by freezing the scroll-driven wobble
 * and ring rotation (nodes remain at their base angle).
 */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

type Group = 'core' | 'frontend' | 'infra' | 'practice' | 'ai';

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
  // Ring 1 — core languages
  { id: 'ts', label: 'TypeScript', group: 'core', angle: 0, ring: 1, color: '#3178c6', size: 44 },
  { id: 'react', label: 'React', group: 'core', angle: 60, ring: 1, color: '#61dafb', size: 42 },
  { id: 'next', label: 'Next.js', group: 'core', angle: 120, ring: 1, color: '#e2e8f0', size: 40 },
  { id: 'java', label: 'Java', group: 'core', angle: 180, ring: 1, color: '#f89820', size: 38 },
  { id: 'csharp', label: 'C#', group: 'core', angle: 240, ring: 1, color: '#9a67b3', size: 38 },
  { id: 'node', label: 'Node.js', group: 'core', angle: 300, ring: 1, color: '#68a063', size: 36 },

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
  { id: 'dotnet', label: '.NET', group: 'core', angle: 135, ring: 3, color: '#7c3aed', size: 26 },
  { id: 'copilot', label: 'Copilot', group: 'ai', angle: 195, ring: 3, color: '#d4a574', size: 24 },
  { id: 'gcloud', label: 'Google Cloud', group: 'infra', angle: 255, ring: 3, color: '#4285f4', size: 26 },
  { id: 'do', label: 'DigitalOcean', group: 'infra', angle: 315, ring: 3, color: '#0080ff', size: 24 },
];

const CONNECTIONS: Array<[string, string]> = [
  ['ts', 'react'],
  ['ts', 'next'],
  ['ts', 'node'],
  ['ts', 'astro'],
  ['react', 'next'],
  ['react', 'tailwind'],
  ['next', 'tailwind'],
  ['next', 'docker'],
  ['java', 'tdd'],
  ['java', 'hexarch'],
  ['csharp', 'dotnet'],
  ['csharp', 'solid'],
  ['node', 'docker'],
  ['docker', 'ghactions'],
  ['tdd', 'hexarch'],
  ['tdd', 'solid'],
  ['claude', 'copilot'],
  ['ghactions', 'gcloud'],
  ['ghactions', 'do'],
  ['astro', 'tailwind'],
];

const GROUP_LABELS: Record<Group, { es: string; en: string }> = {
  core: { es: 'Lenguajes', en: 'Languages' },
  frontend: { es: 'Frontend', en: 'Frontend' },
  infra: { es: 'Infraestructura', en: 'Infrastructure' },
  practice: { es: 'Prácticas', en: 'Practices' },
  ai: { es: 'IA', en: 'AI' },
};

interface Props {
  lang?: 'es' | 'en';
}

export default function TechConstellation({ lang = 'es' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ w: 600, h: 600 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Track the site-wide dark class on <html> so ring / edge / idle label
  // colours adapt to the current theme (accent-blue at 0.08 alpha is
  // invisible over slate-50 and too strong over ink-900).
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setIsDark(html.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Measure container on mount and resize.
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.max(320, Math.min(640, rect.width));
      setDims({ w, h: w });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Scroll listener — only while component is mounted; kept global on window.
  useEffect(() => {
    if (reduceMotion) return;
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const base = Math.min(dims.w, dims.h);
  const ringRadii = useMemo(
    () => [0, base * 0.22, base * 0.35, base * 0.46],
    [base]
  );
  const time = reduceMotion ? 0 : scrollY * 0.0009;

  const getPos = useCallback(
    (node: TechNode) => {
      const r = ringRadii[node.ring];
      const wobble = reduceMotion ? 0 : Math.sin(time + node.angle * 0.05) * 4;
      const ringSpeed: Record<number, number> = { 1: 8, 2: -5, 3: 3 };
      const a = ((node.angle + time * (ringSpeed[node.ring] || 0)) * Math.PI) / 180;
      return { x: cx + Math.cos(a) * (r + wobble), y: cy + Math.sin(a) * (r + wobble) };
    },
    [cx, cy, ringRadii, time, reduceMotion]
  );

  // Positions map — recompute when dimensions or time changes
  const nodeMap = useMemo(() => {
    const map: Record<string, TechNode & { pos: { x: number; y: number } }> = {};
    TECH_NODES.forEach((n) => {
      map[n.id] = { ...n, pos: getPos(n) };
    });
    return map;
  }, [getPos]);

  const isConnected = useCallback(
    (id: string) => {
      if (!hovered) return false;
      return CONNECTIONS.some(
        ([a, b]) => (a === hovered && b === id) || (b === hovered && a === id)
      );
    },
    [hovered]
  );

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-2xl"
      style={{ height: dims.h }}
      role="figure"
      aria-label="Tech stack constellation"
    >
      <svg
        width={dims.w}
        height={dims.h}
        className="absolute inset-0"
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
            stroke={isDark ? 'rgba(96,165,250,0.28)' : 'rgba(94,58,238,0.22)'}
            strokeWidth={isDark ? 1.2 : 1}
            strokeDasharray="4 8"
          />
        ))}

        {/* Connection edges */}
        {CONNECTIONS.map(([a, b]) => {
          const na = nodeMap[a];
          const nb = nodeMap[b];
          if (!na || !nb) return null;
          const active = hovered === a || hovered === b;
          const idleStroke = isDark ? 'rgba(96,165,250,0.22)' : 'rgba(94,58,238,0.18)';
          const activeStroke = isDark ? 'rgba(96,165,250,0.65)' : 'rgba(94,58,238,0.65)';
          return (
            <line
              key={`${a}-${b}`}
              x1={na.pos.x}
              y1={na.pos.y}
              x2={nb.pos.x}
              y2={nb.pos.y}
              stroke={active ? activeStroke : idleStroke}
              strokeWidth={active ? 1.8 : isDark ? 0.8 : 0.6}
              style={{ transition: 'all 0.4s ease' }}
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
              left: pos.x,
              top: pos.y,
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
              className="mt-1 whitespace-nowrap font-mono"
              style={{
                fontSize: active ? 11 : 9,
                color: active
                  ? node.color
                  : isDark
                    ? 'rgba(148,163,184,0.7)'
                    : 'rgba(71,85,105,0.75)',
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
      <div
        className="pointer-events-none absolute flex flex-col items-center"
        style={{
          left: cx,
          top: cy,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <span
          className="font-display font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-500"
          style={{ fontSize: 14 }}
        >
          Stack
        </span>
      </div>
    </div>
  );
}
