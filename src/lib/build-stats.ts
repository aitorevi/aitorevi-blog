import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

function run(cmd: string, fallback: number): number {
  try {
    const raw = execSync(cmd, { encoding: 'utf8', shell: true }).trim();
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
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

export function fetchBuildStats(root: string) {
  return {
    commits:      run('git rev-list --count HEAD', 416),
    prs:          run('gh pr list --state all --limit 1000 --json number --jq length', 47),
    tests:        run("grep -rE '^\\s*(it|test)\\(' tests/ --include='*.ts' | wc -l | tr -d ' '", 135),
    workflows:    run('ls .github/workflows/*.yml 2>/dev/null | wc -l | tr -d " "', 2),
    legalPages:   countLegalPages(root),
  };
}
