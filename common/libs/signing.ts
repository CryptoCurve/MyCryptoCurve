import EthTx from 'ethereumjs-tx';
import {
  addHexPrefix,
  ecsign,
  ecrecover,
  sha3,
  hashPersonalMessage,
  toBuffer,
  pubToAddress,
  bufferToInt,
  rlphash
} from 'ethereumjs-util';
import { stripHexPrefixAndLower } from 'libs/values';
import rlp from 'rlp';

const wanUtil = require('wanchain-util');
const WanTx = wanUtil.wanchainTx;

export function signRawTxWithPrivKey(privKey: Buffer, t: EthTx): Buffer {
  t.sign(privKey);
  return t.serialize();
}
/**
 * Computes a sha3-256 hash of the serialized tx
 * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
 * @return {Buffer}
 */
function hash(t) {
  var includeSignature = false;

  // EIP155 spec:
  // when computing the hash of a transaction for purposes of signing or recovering,
  // instead of hashing only the first six elements (ie. nonce, gasprice, startgas, to, value, data),
  // hash nine elements, with v replaced by CHAIN_ID, r = 0 and s = 0

  let items;
  if (includeSignature) {
    items = t.raw;
  } else {
    if (t._chainId > 0) {
      const raw = t.raw.slice();
      t.v = t._chainId;
      t.r = 0;
      t.s = 0;
      items = t.raw;
      t.raw = raw;
    } else {
      items = t.raw.slice(0, 6);
    }
  }
  items.unshift(new Buffer([1]));
  console.log(items);

  return rlphash(items);
}
/**
 * sign a transaction with a given a private key
 * @param {Buffer} privateKey
 */
function sign(t, privateKey) {
  const msgHash = hash(t);
  const sig = ecsign(msgHash, privateKey);
  if (t._chainId > 0) {
    sig.v += t._chainId * 2 + 8;
  }
  return sig;
}

export function wanSignRawTxWithPrivKey(privKey: Buffer, t: Tx): Buffer {
  let rawTx = {
    Txtype: 0x01,
    nonce: bufferToInt(t.nonce),
    gasPrice: 200000000000, //bufferToInt(t.gasPrice),
    gasLimit: 47000, //bufferToInt(t.gasLimit),
    to: wanUtil.toChecksumAddress('0x' + t.to.toString('hex')), //contract address
    value: bufferToInt(t.value),
    data: '0x' + t.data.toString('hex'),
    chainId: t._chainId
  };
  console.log(rawTx);
  let tx = new WanTx(rawTx);
  tx.sign(privKey);
  return tx.serialize();
}

// adapted from:
// https://github.com/kvhnuke/etherwallet/blob/2a5bc0db1c65906b14d8c33ce9101788c70d3774/app/scripts/controllers/signMsgCtrl.js#L95
export function signMessageWithPrivKeyV2(privKey: Buffer, msg: string): string {
  const hash = hashPersonalMessage(toBuffer(msg));
  const signed = ecsign(hash, privKey);
  console.log(signed);
  const combined = Buffer.concat([
    Buffer.from(signed.r),
    Buffer.from(signed.s),
    Buffer.from([signed.v])
  ]);
  const combinedHex = combined.toString('hex');

  return addHexPrefix(combinedHex);
}

export interface ISignedMessage {
  address: string;
  msg: string;
  sig: string;
  version: string;
}

// adapted from:
// https://github.com/kvhnuke/etherwallet/blob/2a5bc0db1c65906b14d8c33ce9101788c70d3774/app/scripts/controllers/signMsgCtrl.js#L118
export function verifySignedMessage({ address, msg, sig, version }: ISignedMessage) {
  const sigb = new Buffer(stripHexPrefixAndLower(sig), 'hex');
  if (sigb.length !== 65) {
    return false;
  }
  //TODO: explain what's going on here
  sigb[64] = sigb[64] === 0 || sigb[64] === 1 ? sigb[64] + 27 : sigb[64];
  const hash = version === '2' ? hashPersonalMessage(toBuffer(msg)) : sha3(msg);
  const pubKey = ecrecover(hash, sigb[64], sigb.slice(0, 32), sigb.slice(32, 64));

  return stripHexPrefixAndLower(address) === pubToAddress(pubKey).toString('hex');
}
