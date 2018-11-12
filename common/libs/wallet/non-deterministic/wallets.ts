import { fromV3, IFullWallet, fromPrivateKey, fromEthSale } from 'ethereumjs-wallet';
import { fromEtherWallet } from 'ethereumjs-wallet/thirdparty';
import { decryptPrivKey } from 'libs/decrypt';
import Web3Wallet from './web3';
import AddressOnlyWallet from './address';
import ParitySignerWallet from './parity';

const sdk = require('cryptocurve-sdk');

const EncryptedPrivateKeyWallet = (encryptedPrivateKey: string, password: string) =>
  fromPrivateKey(decryptPrivKey(encryptedPrivateKey, password));

const PresaleWallet = (keystore: string, password: string) => fromEthSale(keystore, password);

const MewV1Wallet = (keystore: string, password: string) => fromEtherWallet(keystore, password);

const PrivKeyWallet = (privkey: Buffer) => fromPrivateKey(privkey);

const UtcWallet = function(keystore: string, password: string) {
  const rawKeystore: IFullWallet = fromV3(keystore, password, true);
  var privateKey = rawKeystore.getPrivateKeyString();
  return fromPrivateKey(sdk.utils.eth.toBuffer(privateKey));
};

export {
  EncryptedPrivateKeyWallet,
  PresaleWallet,
  MewV1Wallet,
  PrivKeyWallet,
  UtcWallet,
  Web3Wallet,
  AddressOnlyWallet,
  ParitySignerWallet
};
