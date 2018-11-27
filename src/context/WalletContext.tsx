import * as React from 'react';

interface Wallet {
  _privKey: string;
}

interface WalletContextInterface {
  // TODO: Need to change the any to an actual wallet type
  wallet: Wallet;
  setWallet: (wallet: Wallet | any | null) => ()=>void;
}

const ctxt = React.createContext<WalletContextInterface | null>(null);

const WalletContextProvider = ctxt.Provider;

const WalletContextConsumer = ctxt.Consumer;

class WalletContext extends React.Component<{}, WalletContextInterface> {
  // noinspection JSUnusedGlobalSymbols
  public state = {
    wallet: {
      _privKey: ""
    },
    setWallet: (wallet: Wallet | any) => ()=>this.setState({ wallet })
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
