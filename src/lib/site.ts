import { parse } from 'yaml';
import raw from '../data/site.yaml?raw';

export interface SiteSettings {
  name: string;
  handle: string;
  tagline: string;
  intro: string;
  location?: string;
  links: { label: string; url: string }[];
}

export const site: SiteSettings = parse(raw);

export const nav = [
  { href: '/posts/', label: 'Posts' },
  { href: '/projects/', label: 'Projects' },
  { href: '/publications/', label: 'Publications' },
  { href: '/teaching/', label: 'Teaching' },
  { href: '/notes/', label: 'Notes' },
  { href: '/challenges/', label: 'Challenge' },
  { href: '/about/', label: 'About' },
];

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 220));
