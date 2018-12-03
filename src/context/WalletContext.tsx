import * as React from 'react';
import { chainList } from '../config';

export interface Wallet {
  _privKey: string;
  address: string;
}
export interface Chain {
  name: string;
}

interface WalletContextInterface {
  // TODO: Need to change the any to an actual wallet type
  wallet: Wallet;
  currentChain: Chain;
  setWallet: (wallet: Wallet | null) => ()=>void;
  setCurrentChain: (chain:Chain) => void;
}

const InitialWallet:Wallet = {
  _privKey: "",
  address: ""
};

const ctxt = React.createContext<WalletContextInterface | null>(null);

const WalletContextProvider = ctxt.Provider;

const WalletContextConsumer = ctxt.Consumer;

class WalletContext extends React.Component<{}, WalletContextInterface> {
  // noinspection JSUnusedGlobalSymbols
  public state:WalletContextInterface = {
    wallet: InitialWallet,
    currentChain: chainList[0],
    setWallet: (wallet: Wallet | null) => ()=> {
      return this.setState({wallet: wallet === null?InitialWallet:wallet});
    },
    setCurrentChain: (chain:Chain)=>{
      return this.setState({currentChain:chain});
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <WalletContextProvider value={this.state}>
        {children}
      </WalletContextProvider>
    );
  }

}

export interface WithWalletContext {
  walletContext: WalletContextInterface;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withWalletContext<P extends { walletContext?: WalletContextInterface },
  R = Omit<P, 'walletContext'>>(
  Component: React.ComponentClass<P> | React.StatelessComponent<P>
): React.SFC<R> {
  return function BoundComponent(props: R) {
    return (
      <WalletContextConsumer>
        {value => {
          return <Component {...props} walletContext={value}/>;
        }}
      </WalletContextConsumer>
    );
  };
}

export default WalletContext;
