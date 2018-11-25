import { addReducer, setGlobal } from 'reactn';
import { IWallet } from '../libs/wallet/IWallet';


interface GlobalState {
  wallet: IWallet | {};
}

const initialState: GlobalState = {
  wallet: {},
};

setGlobal(initialState);

addReducer('setWallet', (state: GlobalState, wallet: IWallet) => ({
  wallet: {
    ...state.wallet,
    ...wallet,
    address: wallet.getAddressString()
    // Removed this field as there are no such function on the wallet type
    // publicKey: wallet.getPublicKeyString()
  }
}));

addReducer('unsetWallet', () => ({
  wallet: {}
}));
