import { IFullWallet } from 'ethereumjs-wallet';
import {
  EncryptedPrivateKeyWallet,
  MewV1Wallet,
  PresaleWallet,
  PrivKeyWallet,
  UtcWallet
} from './wallets';
import { MnemonicWallet } from '../deterministic/mnemonic';

// import typescript declaration
import EthTx from 'ethereumjs-tx';

const sdk = require('cryptocurve-sdk');

enum KeystoreTypes {
  presale = 'presale',
  utc = 'v2-v3-utc',
  v1Unencrypted = 'v1-unencrypted',
  v1Encrypted = 'v1-encrypted',
  v2Unencrypted = 'v2-unencrypted'
}

interface ISignWrapper {
  signRawTransaction(rawTx: EthTx): Buffer;
  wanSignRawTransaction(rawTx: EthTx): Buffer;
  signMessage(msg: string): string;
  unlock(): Promise<void>;
}

export type WrappedWallet = IFullWallet & ISignWrapper;

export const signWrapper = (walletToWrap: IFullWallet): WrappedWallet =>
  Object.assign(walletToWrap, {
    signRawTransaction: (t: EthTx) =>
      sdk.utils.eth.signRawTransaction(t, walletToWrap.getPrivateKey()),
    wanSignRawTransaction: (t: EthTx) =>
      sdk.utils.wan.signRawTransaction(t, walletToWrap.getPrivateKey()),
    signMessage: (msg: string) => sdk.utils.eth.signMessage(msg, walletToWrap.getPrivateKey()),
    unlock: () => Promise.resolve()
  });

function determineKeystoreType(file: string | ArrayBuffer): string {
  const parsed = JSON.parse(file.toString());

  for (var property in parsed) {
    switch (property.toLowerCase()) {
      case 'encseed':
        return KeystoreTypes.presale;
      case 'crypto':
        return KeystoreTypes.utc;
      case 'hash':
        if (parsed.locked === true) {
          return KeystoreTypes.v1Encrypted;
        }
        if (parsed.locked === false) {
          return KeystoreTypes.v1Unencrypted;
        }
        break;
      case 'publisher':
        if (parsed.publisher === 'MyEtherWallet') {
          return KeystoreTypes.v2Unencrypted;
        }
        break;
    }
  }

  throw new Error('Invalid keystore');
}

const isKeystorePassRequired = (file: string | ArrayBuffer): boolean => {
  const keystoreType = determineKeystoreType(file);
  return (
    keystoreType === KeystoreTypes.presale ||
    keystoreType === KeystoreTypes.v1Encrypted ||
    keystoreType === KeystoreTypes.utc
  );
};

const getPrivKeyWallet = (key: string, password: string) =>
  key.length === 64
    ? PrivKeyWallet(Buffer.from(key, 'hex'))
    : EncryptedPrivateKeyWallet(key, password);

const getMnemonicWallet = (phrase: string, password: string, path: string, address: string) =>
  MnemonicWallet(phrase, password, path, address);

const getKeystoreWallet = (file: string, password: string) => {
  const parsed = JSON.parse(file);

  switch (determineKeystoreType(file)) {
    case KeystoreTypes.presale:
      return PresaleWallet(file, password);

    case KeystoreTypes.v1Unencrypted:
      return PrivKeyWallet(Buffer.from(parsed.private, 'hex'));

    case KeystoreTypes.v1Encrypted:
      return MewV1Wallet(file, password);

    case KeystoreTypes.v2Unencrypted:
      return PrivKeyWallet(Buffer.from(parsed.privKey, 'hex'));

    case KeystoreTypes.utc:
      return UtcWallet(file, password);
    default:
      throw Error('Unknown wallet');
  }
};

export {
  isKeystorePassRequired,
  determineKeystoreType,
  getPrivKeyWallet,
  getKeystoreWallet,
  getMnemonicWallet,
  KeystoreTypes
};
