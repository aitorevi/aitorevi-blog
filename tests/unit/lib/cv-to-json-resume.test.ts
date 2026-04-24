import { describe, it, expect } from 'vitest';
import { cvDataToJsonResume } from '@/lib/cv-to-json-resume';
import { cvES, cvEN } from '@/data/cv';

describe('cvDataToJsonResume — structure', () => {
  it('includes the JSON Resume schema URL', () => {
    const resume = cvDataToJsonResume(cvEN, 'en');
    expect(resume.$schema).toContain('jsonresume/resume-schema');
  });

  it('maps basics correctly from EN data', () => {
    const resume = cvDataToJsonResume(cvEN, 'en');
    expect(resume.basics.name).toBe('Aitor Reviriego Amor');
    expect(resume.basics.email).toBe('info@aitorevi.dev');
    expect(resume.basics.url).toBe('https://www.aitorevi.dev');
  });

  it('parses location into city and region', () => {
    const resume = cvDataToJsonResume(cvES, 'es');
    expect(resume.basics.location.city).toBeTruthy();
    expect(resume.basics.location.countryCode).toBe('ES');
  });

  it('extracts LinkedIn and GitHub profiles', () => {
    const resume = cvDataToJsonResume(cvEN, 'en');
    const networks = resume.basics.profiles.map((p) => p.network);
    expect(networks).toContain('LinkedIn');
    expect(networks).toContain('GitHub');
  });

  it('does not include mailto: in profiles', () => {
    const resume = cvDataToJsonResume(cvEN, 'en');
    const hasMailto = resume.basics.profiles.some((p) => p.url.startsWith('mailto:'));
    expect(hasMailto).toBe(false);
  });

  it('generates work entries from experience bullets', () => {
    const resume = cvDataToJsonResume(cvEN, 'en');
    expect(resume.work.length).toBeGreaterThan(0);
    const entry = resume.work[0];
    expect(entry.name).toBeTruthy();
    expect(entry.position).toBeTruthy();
    expect(entry.startDate).toBeTruthy();
  });

  it('generates education entries', () => {
    expect(cvDataToJsonResume(cvES, 'es').education.length).toBeGreaterThan(0);
  });

  it('generates certificates', () => {
    expect(cvDataToJsonResume(cvEN, 'en').certificates.length).toBeGreaterThan(0);
  });

  it('includes languages in Spanish for lang=es', () => {
    const langs = cvDataToJsonResume(cvES, 'es').languages.map((l) => l.language);
    expect(langs).toContain('Español');
    expect(langs).toContain('Inglés');
  });

  it('includes languages in English for lang=en', () => {
    const langs = cvDataToJsonResume(cvEN, 'en').languages.map((l) => l.language);
    expect(langs).toContain('Spanish');
    expect(langs).toContain('English');
  });
});

describe('cvDataToJsonResume — date parsing (periodToDate)', () => {
  it('parses "Mar 2023" as startDate 2023-03-01', () => {
    const resume = cvDataToJsonResume(cvEN, 'en');
    const entry = resume.work.find((w) => w.startDate === '2023-03-01');
    expect(entry).toBeDefined();
  });

  it('omits endDate for "Present" / "Presente"', () => {
    const resume = cvDataToJsonResume(cvEN, 'en');
    const openEntry = resume.work.find((w) => !w.endDate);
    expect(openEntry).toBeDefined();
  });

  it('parses year-only period with padded date format', () => {
    const resume = cvDataToJsonResume(cvES, 'es');
    const edu = resume.education[0];
    if (edu) expect(edu.startDate).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('parses "Jun 2021 - Feb 2024" → correct start/end dates', () => {
    const fixture = {
      ...cvEN,
      experience: [
        {
          company: 'Test Co',
          role: 'Dev',
          period: 'Jun 2021 - Feb 2024',
          bullets: [{ heading: 'Task', text: 'Did stuff', tags: [] }],
        },
      ],
    };
    const resume = cvDataToJsonResume(fixture, 'en');
    expect(resume.work[0].startDate).toBe('2021-06-01');
    expect(resume.work[0].endDate).toBe('2024-02-01');
  });

  it('parses "Ene 2024" (Spanish month abbrev) as 2024-01-01', () => {
    const fixture = {
      ...cvES,
      experience: [
        {
          company: 'Test',
          role: 'Dev',
          period: 'Ene 2024 - Presente',
          bullets: [{ heading: 'T', text: 'x', tags: [] }],
        },
      ],
    };
    const resume = cvDataToJsonResume(fixture, 'es');
    expect(resume.work[0].startDate).toBe('2024-01-01');
    expect(resume.work[0].endDate).toBeUndefined();
  });
});
