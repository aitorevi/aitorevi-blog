import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

function run(cmd: string, fallback: number): number {
  try {
    const raw = execSync(cmd, { encoding: 'utf8', shell: '/bin/sh' }).trim();
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  } catch {
    return fallback;
  }
}

async function githubCount(repo: string, path: string, fallback: number): Promise<number> {
  try {
    const resp = await fetch(
      `https://api.github.com/repos/${repo}/${path}?per_page=1`,
      { headers: { 'User-Agent': 'aitorevi-blog-build' } }
    );
    if (!resp.ok) return fallback;
    // Total count is in the Link header: rel="last" page=N
    const link = resp.headers.get('link') ?? '';
    const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
    if (match) return parseInt(match[1], 10);
    // Only one page of results — count items in body
    const data = await resp.json() as unknown[];
    return data.length > 0 ? data.length : fallback;
  } catch {
    return fallback;
  }
}

async function fetchPRCount(repo: string, fallback: number): Promise<number> {
  try {
    const resp = await fetch(
      `https://api.github.com/search/issues?q=repo:${repo}+type:pr&per_page=1`,
      { headers: { 'User-Agent': 'aitorevi-blog-build' } }
    );
    if (!resp.ok) return fallback;
    const data = await resp.json() as { total_count: number };
    return data.total_count > 0 ? data.total_count : fallback;
  } catch {
    return fallback;
  }
}

function countLegalPages(root: string): number {
  const legalSlugs = ['aviso-legal', 'privacidad', 'cookies', 'legal-notice', 'privacy'];
  let count = 0;
  for (const dir of [join(root, 'src/pages'), join(root, 'src/pages/en')]) {
    try {
      const files = readdirSync(dir);
      count += files.filter((f) => legalSlugs.some((s) => f.startsWith(s))).length;
    } catch { /* dir missing */ }
  }
  return count || 6;
}

export async function fetchBuildStats(root: string) {
  const [commits, prs] = await Promise.all([
    githubCount('aitorevi/aitorevi-blog', 'commits', 427),
    fetchPRCount('aitorevi/aitorevi-blog', 68),
  ]);

  return {
    commits,
    prs,
    unitTests:        run("grep -rE '^\\s*(it|test)\\(' tests/unit/ --include='*.ts' | wc -l | tr -d ' '", 135),
    integrationTests: run("grep -rE '^\\s*(it|test)\\(' tests/integration/ --include='*.ts' | wc -l | tr -d ' '", 24),
    e2eTests:         run("grep -rE '^\\s*test\\(' tests/e2e/ --include='*.ts' | wc -l | tr -d ' '", 10),
    workflows:        run('ls .github/workflows/*.yml 2>/dev/null | wc -l | tr -d " "', 2),
    legalPages:       countLegalPages(root),
  };
}
