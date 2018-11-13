import { addReducer, setGlobal } from 'reactn';
import { IWallet } from './libs/wallet';

interface DialogState {
  title: string;
  body: string;
  open: boolean;
}

interface GlobalState {
  dialog: DialogState;
  wallet: IWallet | {};
}

const initialState: GlobalState = {
  dialog: {
    title: 'Initial Title',
    body: 'Initial text for the body',
    open: false
  },
  wallet: {}
};

setGlobal(initialState);

addReducer('dialogClose', (state: GlobalState) => ({
  dialog: { ...state.dialog, open: false }
}));

addReducer('dialogShow', (state: GlobalState, title: string, body: string) => ({
  dialog: { ...state.dialog, open: true, title, body }
}));

addReducer('setWallet', (state: GlobalState, wallet: IWallet) => ({
  wallet: { ...state.wallet, ...wallet }
}));

addReducer('unsetWallet', () => ({
  wallet: {}
}));
