import type { APIRoute } from 'astro';
import { getCvData } from '../../../data/cv';
import { cvDataToJsonResume } from '../../../lib/cv-to-json-resume';

export const GET: APIRoute = () => {
  const data = getCvData('en');
  const jsonResume = cvDataToJsonResume(data, 'en');

  return new Response(JSON.stringify(jsonResume, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
