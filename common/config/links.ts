import { translateRaw } from 'translations';
import {
  ledgerReferralURL,
  trezorReferralURL,
  ethercardReferralURL,
  keepkeyReferralURL,
  steelyReferralURL
} from './data';

interface Link {
  link: string;
  text: string;
}

export const DOWNLOAD_MYCRYPTO_LINK = 'https://download.mycrypto.com/';

export const socialMediaLinks: Link[] = [
  {
    link: 'https://twitter.com/crypto_curve',
    text: 'twitter'
  },
  {
    link: 'https://www.facebook.com/CryptoCurve/',
    text: 'facebook'
  },
  {
    link: 'https://medium.com/@Cryptocurve',
    text: 'medium'
  }
];

export const productLinks: Link[] = [
  {
    link:
      'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn',
    text: translateRaw('ETHER_ADDRESS_LOOKUP')
  },
  {
    link:
      'https://chrome.google.com/webstore/detail/ethersecuritylookup/bhhfhgpgmifehjdghlbbijjaimhmcgnf',
    text: translateRaw('ETHER_SECURITY_LOOKUP')
  },
  {
    link: 'https://etherscamdb.info/',
    text: translateRaw('ETHERSCAMDB')
  },
  {
    link: 'https://www.mycrypto.com/helpers.html',
    text: translateRaw('FOOTER_HELP_AND_DEBUGGING')
  }
];

export const affiliateLinks: Link[] = [
  {
    link: ledgerReferralURL,
    text: translateRaw('LEDGER_REFERRAL_1')
  },
  {
    link: trezorReferralURL,
    text: translateRaw('TREZOR_REFERAL')
  },
  {
    link: keepkeyReferralURL,
    text: translateRaw('KEEPKEY_REFERRAL')
  },
  {
    link: steelyReferralURL,
    text: translateRaw('STEELY_REFERRAL')
  },
  {
    link: ethercardReferralURL,
    text: translateRaw('ETHERCARD_REFERAL')
  }
];

export const partnerLinks: Link[] = [
  {
    link: 'https://metamask.io/',
    text: 'MetaMask'
  },
  {
    link: 'https://infura.io/',
    text: 'Infura'
  },
  {
    link: 'https://etherscan.io/',
    text: 'Etherscan'
  },
  {
    link: 'https://etherchain.org/',
    text: 'Etherchain'
  }
];
