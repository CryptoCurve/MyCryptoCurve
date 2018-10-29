import { IFullWallet, fromPrivateKey } from 'ethereumjs-wallet';
import Worker from 'worker-loader!./workers/fromV3.worker.ts';

const sdk = require('cryptocurve-sdk');

export default function fromV3(
  keystore: string,
  password: string,
  nonStrict: boolean
): Promise<IFullWallet> {
  return new Promise((resolve, reject) => {
    const worker = new Worker();
    worker.postMessage({ keystore, password, nonStrict });
    worker.onmessage = (ev: MessageEvent) => {
      const data = ev.data;
      try {
        const wallet = fromPrivateKey(sdk.utils.eth.toBuffer(data));
        resolve(wallet);
      } catch (e) {
        reject(e);
      }
    };
  });
}
