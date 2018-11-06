import { addReducer, setGlobal } from 'reactn';
import { IWallet } from './libs/wallet';

interface DialogState {
  title: string;
  open: boolean;
}

interface GlobalState {
  dialog: DialogState;
  wallet: IWallet | {};
}

const initialState: GlobalState = {
  dialog: {
    title: 'Initial Title',
    open: false
  },
  wallet: {}
};

setGlobal(initialState);

addReducer('dialogToggleOpen', (state: GlobalState) => ({
  dialog: { ...state.dialog, open: !state.dialog.open }
}));

addReducer('setWallet', (state: GlobalState, wallet: IWallet) => ({
  wallet: { ...state.wallet, ...wallet }
}));
