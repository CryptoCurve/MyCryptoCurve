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

interface State {
  loginSelectorValue: WalletName;
  selectedWalletKey: WalletName | null;
  value: UnlockParams | null;
  loginSelectorOpen: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    loginSelectItem: {
      marginTop: theme.spacing.unit * 12,
      width: 350
    },
    decryptComponentGrid: {
      width: 350
    },
    loginSelector: {
      width: '100%'
    },
    buttonGrid: {
      display: 'flex',
      justifyContent: 'center'
    }
  });

type Props = OwnProps & WithStyles<typeof styles>;

class OpenWallet extends Reactn.Component<Props, State> {
  public state = {
    selectedWalletKey: null,
    value: null,
    loginSelectorValue: WalletName.PRIVATE_KEY
  };

  public render() {
    console.log('Render OpenWallet');
    const { classes } = this.props;
    const { loginSelectorValue } = this.state;
    const selectedWallet = this.getSelectedWallet();
    const decryptionComponent = this.getDecryptionComponent();
    console.log(selectedWallet, decryptionComponent);
    return (
      <React.Fragment>
        <Template
          version={2}
          title={selectedWallet ? selectedWallet.lid : 'OPEN_WALLET_SELECT'}
          hideButton={!(selectedWallet && selectedWallet.lid)}
          buttonAction={this.onBackButton}
        >
          <Grid container={true} item={true} alignItems="center" justify="center">
            {selectedWallet && decryptionComponent ? (
              <Grid
                item={true}
                container={true}
                className={classes.decryptComponentGrid}
                direction="column"
                spacing={40}
              >
                <Grid item={true}>{decryptionComponent}</Grid>
              </Grid>
            ) : (
              <Grid
                item={true}
                container={true}
                className={classes.loginSelectItem}
                direction="column"
                spacing={40}
              >
                <Grid item={true}>
                  <Select
                    // open={loginSelectorOpen}
                    onClose={this.handleLoginSelectorClose}
                    onOpen={this.handleLoginSelectorOpen}
                    value={loginSelectorValue}
                    onChange={this.handleLoginSelectorChange}
                    className={classes.loginSelector}
                  >
                    {Object.keys(walletTypes).map((walletType: WalletName) => {
                      const wallet = walletTypes[walletType];
                      return (
                        <MenuItem key={walletType} value={walletType}>
                          {translateRaw(wallet.lid)}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
                <Grid item={true} className={classes.buttonGrid}>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleWalletChoice.bind(this, loginSelectorValue)}
                  >
                    {translateRaw('ACTION_14')}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Template>
      </React.Fragment>
    );
  }

  private handleWalletChoice = async (walletType: WalletName) => {
    const wallet = walletTypes[walletType];

    if (!wallet) {
      return;
    }
    this.setState({
      selectedWalletKey: walletType,
      value: wallet.initialParams
    });
  };

  private getSelectedWallet(): WalletType | null {
    const { selectedWalletKey } = this.state;
    if (!selectedWalletKey) {
      return null;
    }
    // @ts-ignore
    return walletTypes[selectedWalletKey];
  }

  private onChange = (value: UnlockParams) => {
    this.setState({ value });
  };

  private onUnlock = (payload: any) => {
    const { value, selectedWalletKey } = this.state;

    console.log(payload);
    console.log(value);
    console.log(selectedWalletKey);
    console.log(this.global);
  };

  private getDecryptionComponent() {
    const { selectedWalletKey, value } = this.state;
    const selectedWallet = this.getSelectedWallet();

    if (!selectedWalletKey || !selectedWallet) {
      return null;
    }
    return (
      <Grid container={true}>
        <selectedWallet.component
          value={value}
          onChange={this.onChange}
          onUnlock={(unlockValue: any) => {
            this.onUnlock(unlockValue);
          }}
          showNotification={this.props.showNotification}
          isWalletPending={
            this.state.selectedWalletKey === InsecureWalletName.KEYSTORE_FILE
              ? this.props.isWalletPending
              : undefined
          }
          isPasswordPending={
            this.state.selectedWalletKey === InsecureWalletName.KEYSTORE_FILE
              ? this.props.isPasswordPending
              : undefined
          }
        />
      </Grid>
    );
  }

  private onBackButton = () => {
    this.setState({
      selectedWalletKey: null,
      value: null
    });
  };

  private handleLoginSelectorChange = (e: React.ChangeEvent<any>) => {
    this.setState({ loginSelectorValue: e.target.value });
  };
}

// @ts-ignore
export default (withStyles(styles)(OpenWallet) as unknown) as React.ComponentClass<OwnProps>;
