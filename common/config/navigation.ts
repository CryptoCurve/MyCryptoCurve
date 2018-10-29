// import { knowledgeBaseURL } from './data';

export interface NavigationLink {
  name: string;
  to: string;
  external?: boolean;
  disabled?: boolean;
}
/* List of all possible links */
const openWallet: NavigationLink = {
  name: 'NAV_VIEW',
  to: '/account'
};

const newWallet: NavigationLink = {
  name: 'NAV_GENERATEWALLET',
  to: '/generate'
};

const viewAddress: NavigationLink = {
  name: 'VIEW_ADDR',
  to: '/account/view'
};

const learnMore: NavigationLink = {
  name: 'NAV_LEARN',
  to: '/faq'
};

/* Collections of navigation links */
export const navigationLinks: NavigationLink[] = [openWallet, newWallet, viewAddress].filter(
  (link: NavigationLink) => !link.disabled
);

export const navigationLinksLandingPage: NavigationLink[] = [openWallet, learnMore];
