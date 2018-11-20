interface IBaseWallet {
  isReadOnly?: boolean;
  getAddressString(): string;
  getPrivateKeyString?(): string;
}

export interface IReadOnlyWallet extends IBaseWallet {
  isReadOnly: true;
}

export interface IFullWallet extends IBaseWallet {
  isReadOnly?: false;
  // TODO: This any need to be properly typed by "ethereumjs-tx"
  signRawTransaction(tx: any): Promise<Buffer> | Buffer;
  signMessage(msg: string): Promise<string> | string;
}

export type IWallet = IReadOnlyWallet | IFullWallet;
