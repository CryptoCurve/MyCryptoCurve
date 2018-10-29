import ledger from 'ledgerco';
import EthTx, { TxObj } from 'ethereumjs-tx';
import { DeterministicWallet } from './deterministic';
import { getTransactionFields } from 'libs/transaction';
import { IFullWallet } from '../IWallet';
import { translateRaw } from 'translations';

const sdk = require('cryptocurve-sdk');

export class LedgerWallet extends DeterministicWallet implements IFullWallet {
  private ethApp: ledger.eth;

  constructor(address: string, dPath: string, index: number) {
    super(address, dPath, index);
    ledger.comm_u2f.create_async().then((comm: any) => {
      this.ethApp = new ledger.eth(comm);
    });
  }

  // modeled after
  // https://github.com/kvhnuke/etherwallet/blob/3f7ff809e5d02d7ea47db559adaca1c930025e24/app/scripts/uiFuncs.js#L58
  public signRawTransaction(t: EthTx): Promise<Buffer> {
    t.v = Buffer.from([t._chainId]);
    t.r = sdk.utils.eth.toBuffer(0);
    t.s = sdk.utils.eth.toBuffer(0);

    return new Promise((resolve, reject) => {
      this.ethApp
        .signTransaction_async(this.getPath(), t.serialize().toString('hex'))
        .then(result => {
          const strTx = getTransactionFields(t);
          const txToSerialize: TxObj = {
            ...strTx,
            v: sdk.utils.eth.addHexPrefix(result.v),
            r: sdk.utils.eth.addHexPrefix(result.r),
            s: sdk.utils.eth.addHexPrefix(result.s)
          };

          const serializedTx = new EthTx(txToSerialize).serialize();
          resolve(serializedTx);
        })
        .catch(err => {
          return reject(Error(err + '. Check to make sure contract data is on'));
        });
    });
  }

  // modeled after
  // https://github.com/kvhnuke/etherwallet/blob/3f7ff809e5d02d7ea47db559adaca1c930025e24/app/scripts/controllers/signMsgCtrl.js#L53
  public async signMessage(msg: string): Promise<string> {
    if (!msg) {
      throw Error('No message to sign');
    }
    const msgHex = Buffer.from(msg).toString('hex');

    const signed = await this.ethApp.signPersonalMessage_async(this.getPath(), msgHex);
    const combined = sdk.utils.eth.addHexPrefix(signed.r + signed.s + signed.v.toString(16));
    return combined;
  }

  public displayAddress = (
    dPath?: string,
    index?: number
  ): Promise<{
    publicKey: string;
    address: string;
    chainCode?: string;
  }> => {
    if (!dPath) {
      dPath = this.dPath;
    }
    if (!index) {
      index = this.index;
    }
    return this.ethApp.getAddress_async(dPath + '/' + index, true, false);
  };

  public getWalletType(): string {
    return translateRaw('X_LEDGER');
  }
}
