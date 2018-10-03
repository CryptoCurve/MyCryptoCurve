import * as React from 'react';
import Keystore from './components/Keystore';
import Mnemonic from './components/Mnemonic';
import WalletTypes from './components/WalletTypes';
import CryptoWarning from './components/CryptoWarning';
import { RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { RouteNotFound } from 'components/RouteNotFound';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme } from '@material-ui/core';

export enum WalletType {
  Keystore = 'keystore',
  Mnemonic = 'mnemonic'
}

const styles = (theme: Theme) =>
  createStyles({
    mainGrid: {
      marginTop: theme.spacing.unit * 10,
      marginBottom: theme.spacing.unit * 20
    }
  });

const GenerateWallet = (props: RouteComponentProps<{}> & WithStyles<typeof styles>) => {
  const { match, classes } = props;
  const currentPath = match.url;
  return (
    <React.Fragment>
      <Grid container={true} className={classes.mainGrid}>
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
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(GenerateWallet);
