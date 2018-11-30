import * as React from 'react';

export interface Wallet {
  _privKey: string;
  address: string;
}

interface WalletContextInterface {
  // TODO: Need to change the any to an actual wallet type
  wallet: Wallet;
  setWallet: (wallet: Wallet | null) => ()=>void;
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
  public state = {
    wallet: InitialWallet,
    setWallet: (wallet: Wallet | null) => ()=> {
      return this.setState({wallet: wallet === null?InitialWallet:wallet});

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
