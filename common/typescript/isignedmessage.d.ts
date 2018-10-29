declare module 'isignedmessage' {
  export interface ISignedMessage {
    address: string;
    msg: string;
    sig: string;
    version: string;
  }
}
