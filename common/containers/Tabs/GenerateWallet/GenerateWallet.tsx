import * as React from 'react';
import Keystore from './components/Keystore';
import Mnemonic from './components/Mnemonic';
import WalletTypes from './components/WalletTypes';
import CryptoWarning from './components/CryptoWarning';
import { RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { RouteNotFound } from 'components/RouteNotFound';

export enum WalletType {
  Keystore = 'keystore',
  Mnemonic = 'mnemonic'
}

const GenerateWallet = (props: RouteComponentProps<{}>) => {
  const { match } = props;
  const currentPath = match.url;
  return (
    <React.Fragment>
      {window.crypto ? (
        <Switch>
          <Route exact={true} path={currentPath} component={WalletTypes} />
          <Route exact={true} path={`${currentPath}/keystore`} component={Keystore} />
          <Route exact={true} path={`${currentPath}/mnemonic`} component={Mnemonic} />
          <RouteNotFound />
        </Switch>
      ) : (
        <CryptoWarning />
      )}
    </React.Fragment>
  );
};

export default GenerateWallet;
