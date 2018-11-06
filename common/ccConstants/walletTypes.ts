import {
  KeystoreDecrypt,
  MnemonicDecrypt,
  PrivateKeyDecrypt
} from '../components/WalletDecrypt/components';
import { knowledgeBaseURL } from '../config';

export enum WalletName {
  PRIVATE_KEY = 'privateKey',
  KEYSTORE_FILE = 'keystoreFile',
  MNEMONIC_PHRASE = 'mnemonicPhrase'
}

export interface WalletType {
  lid: string;
  example: string;
  component: any;
  initialParams: {
    key: string;
    password: string;
  };
  helpLink: string;
}

export const INSECURE_WALLETS = Object.values(WalletName);

export const walletTypes = {
  [WalletName.PRIVATE_KEY]: {
    lid: 'X_PRIVKEY2',
    example: 'f1d0e0789c6d40f399ca90cc674b7858de4c719e0d5752a60d5d2f6baa45d4c9',
    component: PrivateKeyDecrypt,
    initialParams: {
      key: '',
      password: ''
    },
    // unlock: this.props.unlockPrivateKey,
    helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
  },
  [WalletName.KEYSTORE_FILE]: {
    lid: 'X_KEYSTORE2',
    example: 'UTC--2017-12-15T17-35-22.547Z--6be6e49e82425a5aa56396db03512f2cc10e95e8',
    component: KeystoreDecrypt,
    initialParams: {
      file: '',
      password: ''
    },
    // unlock: this.props.unlockKeystore,
    helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
  },
  [WalletName.MNEMONIC_PHRASE]: {
    lid: 'X_MNEMONIC',
    example: 'brain surround have swap horror cheese file distinct',
    component: MnemonicDecrypt,
    initialParams: {},
    // unlock: this.props.unlockMnemonic,
    helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
  }
};
