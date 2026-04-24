import { describe, it, expect } from 'vitest';
import { cvES, cvEN, getCvData, getPdfPath, getJsonPath, getAlternateLangUrl } from '@/data/cv';

describe('getCvData', () => {
  it('returns cvES for lang "es"', () => {
    expect(getCvData('es')).toBe(cvES);
  });

  it('returns cvEN for lang "en"', () => {
    expect(getCvData('en')).toBe(cvEN);
  });
});

describe('getPdfPath', () => {
  it('returns a path under /cv/ with .pdf extension for ES', () => {
    const path = getPdfPath('es');
    expect(path).toContain('/cv/');
    expect(path).toMatch(/\.pdf$/);
  });

  it('returns a path under /cv/ with .pdf extension for EN', () => {
    const path = getPdfPath('en');
    expect(path).toContain('/cv/');
    expect(path).toMatch(/\.pdf$/);
  });

  it('ES and EN paths are different', () => {
    expect(getPdfPath('es')).not.toBe(getPdfPath('en'));
  });
});

describe('getJsonPath', () => {
  it('returns /cv/resume.json for ES', () => {
    expect(getJsonPath('es')).toBe('/cv/resume.json');
  });

  it('returns /en/cv/resume.json for EN', () => {
    expect(getJsonPath('en')).toBe('/en/cv/resume.json');
  });
});

describe('getAlternateLangUrl', () => {
  it('returns /en/cv when current lang is es', () => {
    expect(getAlternateLangUrl('es')).toBe('/en/cv');
  });

  it('returns /cv when current lang is en', () => {
    expect(getAlternateLangUrl('en')).toBe('/cv');
  });
});
