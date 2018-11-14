import { addReducer, setGlobal } from 'reactn';
import { IWallet } from './libs/wallet';

interface DialogState {
  title: string;
  body: string;
  open: boolean;
}

export interface SnackBarMsg {
  message: string;
  key: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

export type SnackBarState = SnackBarMsg[];

interface GlobalState {
  dialog: DialogState;
  wallet: IWallet | {};
  snackBar: SnackBarState;
}

const initialState: GlobalState = {
  dialog: {
    title: 'Initial Title',
    body: 'Initial text for the body',
    open: false
  },
  wallet: {},
  snackBar: []
};

setGlobal(initialState);

addReducer('snackBarPush', (state: GlobalState, snackBar: SnackBarMsg) => {
  const tmpSnackBar = state.snackBar;
  tmpSnackBar.push(snackBar);
  return { snackBar: tmpSnackBar };
});
addReducer('snackBarShift', (state: GlobalState) => {
  const tmpSnackBar = state.snackBar;
  tmpSnackBar.shift();
  return { snackBar: tmpSnackBar };
});

addReducer('dialogClose', (state: GlobalState) => ({
  dialog: { ...state.dialog, open: false }
}));

addReducer('dialogShow', (state: GlobalState, title: string, body: string) => ({
  dialog: { ...state.dialog, open: true, title, body }
}));

addReducer('setWallet', (state: GlobalState, wallet: IWallet) => ({
  wallet: {
    ...state.wallet,
    ...wallet,
    address: wallet.getAddressString(),
    publicKey: wallet.getPublicKeyString()
  }
}));

addReducer('unsetWallet', () => ({
  wallet: {}
}));
