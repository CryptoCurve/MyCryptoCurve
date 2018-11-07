import * as Reactn from 'reactn';
import * as React from 'react';
import Template from '../../../containers/Tabs/GenerateWallet/components/Template';
import Grid from '@material-ui/core/Grid/Grid';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { translateRaw } from '../../../translations';
import Button from '@material-ui/core/Button/Button';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import { WalletName, WalletType, walletTypes } from '../../../ccConstants/walletTypes';
import { PrivateKeyValue } from '../../../components/WalletDecrypt/components';
import { InsecureWalletName } from '../../../config';

type UnlockParams = {} | PrivateKeyValue;

interface OwnProps {}

interface State {}

const styles = (theme: Theme) => createStyles({});

type Props = OwnProps & WithStyles<typeof styles>;

class OpenedWallet extends Reactn.Component<Props, State> {
  public state = {};

  public render() {
    console.log('Render OpenedWallet');
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Template version={2} hideButton={true}>
          Template Body
        </Template>
      </React.Fragment>
    );
  }
}

// @ts-ignore
export default (withStyles(styles)(OpenedWallet) as unknown) as React.ComponentClass<OwnProps>;
