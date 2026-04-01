import type { CvData, Lang } from '../data/cv';

interface JsonResumeBasics {
  name: string;
  label: string;
  email: string;
  url: string;
  summary: string;
  location: { city: string; countryCode: string; region: string };
  profiles: { network: string; username: string; url: string }[];
}

interface JsonResumeWork {
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights: string[];
  keywords: string[];
}

interface JsonResumeEducation {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
}

interface JsonResumeCertificate {
  name: string;
  issuer: string;
}

interface JsonResumeSkill {
  name: string;
  keywords: string[];
}

export interface JsonResume {
  $schema: string;
  basics: JsonResumeBasics;
  work: JsonResumeWork[];
  education: JsonResumeEducation[];
  certificates: JsonResumeCertificate[];
  skills: JsonResumeSkill[];
  languages: { language: string; fluency: string }[];
  meta: { version: string; lastModified: string };
}

function parseEmail(links: CvData['contact']['links']): string {
  const mail = links.find((l) => l.url.startsWith('mailto:'));
  return mail ? mail.url.replace('mailto:', '') : '';
}

function parseProfiles(links: CvData['contact']['links']): JsonResumeBasics['profiles'] {
  return links
    .filter((l) => !l.url.startsWith('mailto:'))
    .map((l) => ({
      network: l.label,
      username: l.url.split('/').pop() || '',
      url: l.url,
    }));
}

function parseLocation(location: string, lang: Lang): JsonResumeBasics['location'] {
  const [city, region] = location.split(',').map((s) => s.trim());
  return { city, countryCode: 'ES', region: region || '' };
}

function periodToDate(period: string, type: 'start' | 'end'): string {
  if (!period) return '';

  const months: Record<string, string> = {
    Ene: '01', Feb: '02', Mar: '03', Abr: '04', May: '05', Jun: '06',
    Jul: '07', Ago: '08', Sep: '09', Oct: '10', Nov: '11', Dic: '12',
    Jan: '01', Apr: '04', Aug: '08', Dec: '12',
  };

  const parts = period.split(' - ');
  const part = type === 'start' ? parts[0].trim() : (parts[1] || '').trim();

  if (!part || part === 'Presente' || part === 'Present') return '';

  // "Mar 2023" or just "2023"
  const tokens = part.split(' ');
  if (tokens.length === 2) {
    const month = months[tokens[0]] || '01';
    return `${tokens[1]}-${month}-01`;
  }
  // Just a year like "1998"
  if (tokens.length === 1 && /^\d{4}$/.test(tokens[0])) {
    return type === 'start' ? `${tokens[0]}-01-01` : `${tokens[0]}-12-31`;
  }
  return '';
}

export function cvDataToJsonResume(data: CvData, lang: Lang): JsonResume {
  const basics: JsonResumeBasics = {
    name: data.contact.name,
    label: data.contact.title,
    email: parseEmail(data.contact.links),
    url: 'https://www.aitorevi.dev',
    summary: data.summary,
    location: parseLocation(data.contact.location, lang),
    profiles: parseProfiles(data.contact.links),
  };

  const work: JsonResumeWork[] = data.experience.flatMap((entry) =>
    entry.bullets.map((bullet) => {
      const period = bullet.period || entry.period || '';
      const startDate = periodToDate(period, 'start');
      const endDate = periodToDate(period, 'end');

      return {
        name: entry.company,
        position: `${entry.role} — ${bullet.heading}`,
        startDate,
        ...(endDate ? { endDate } : {}),
        summary: bullet.text,
        highlights: [bullet.text],
        keywords: bullet.tags || [],
      };
    })
  );

  const education: JsonResumeEducation[] = data.education.map((e) => ({
    institution: e.institution,
    area: e.degree,
    studyType: e.degree,
    startDate: periodToDate(e.period, 'start'),
    endDate: periodToDate(e.period, 'end'),
  }));

  const certificates: JsonResumeCertificate[] = data.certifications.map((c) => ({
    name: c.name,
    issuer: c.institution,
  }));

  const skills: JsonResumeSkill[] = data.skills.map((s) => ({
    name: s.name,
    keywords: s.skills,
  }));

  const languages = lang === 'es'
    ? [
        { language: 'Español', fluency: 'Nativo' },
        { language: 'Inglés', fluency: 'Profesional' },
      ]
    : [
        { language: 'Spanish', fluency: 'Native' },
        { language: 'English', fluency: 'Professional working proficiency' },
      ];

  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics,
    work,
    education,
    certificates,
    skills,
    languages,
    meta: {
      version: 'v1.0.0',
      lastModified: new Date().toISOString().split('T')[0],
    },
  };
}
