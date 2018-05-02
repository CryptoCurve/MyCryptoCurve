import { knowledgeBaseURL } from './data';

export interface NavigationLink {
  name: string;
  to: string;
  external?: boolean;
  disabled?: boolean;
}

export const navigationLinks: NavigationLink[] = [
  {
    name: 'Whitelist',
    to: '/whitelist'
  },
  {
    name: 'NAV_GENERATEWALLET',
    to: '/generate'
  },
  {
    name: 'NAV_VIEW',
    to: '/account'
  }
].filter(link => !link.disabled);
