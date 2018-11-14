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

import {
  getKeystoreWallet,
  getPrivKeyWallet,
  getMnemonicWallet
} from '../../../libs/wallet/non-deterministic';

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
  public selectedWalletKey: string | null;
  public value: any;
  public state = {
    selectedWalletKey: this.selectedWalletKey,
    value: this.value,
    // loginSelectorValue: WalletName.PRIVATE_KEY
    loginSelectorValue: WalletName.KEYSTORE_FILE
  };

  public render() {
    console.log('Render OpenWallet');
    const { classes } = this.props;
    const { loginSelectorValue } = this.state;
    const selectedWallet = this.getSelectedWallet();
    const decryptionComponent = this.getDecryptionComponent();
    console.log(selectedWallet, decryptionComponent);
    return (
      <Template
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
                  variant="contained"
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

  private onMnemonicUnlock = () => {
    // receives mnemonic and optional password, returns array of addresses for selection
    console.log('onMnemonicUnlock called');
  };

  private onUnlock = (payload: any) => {
    const { value, selectedWalletKey } = this.state;
    this.global.unsetWallet();
    var wallet = null;

    console.log(payload);

    // keystore:
    // {
    //    file: "{"version":3,"id":"21b880d2-b450-45a7-a14c-9880408…512087c0a92540bdf5f617dabfe703a32b220aebec2c31"}}",
    //    password: "79e6c763d48b1f4581937ea5b82955260c182d49a34ca67e988932f069f7f4f4",
    //    valid: 64,
    //    filename: "UTC--2018-08-14T01-29-10.758Z--674118a4b7121fab8c811c15722e8188959eb62f"
    // }
    // private key:
    // {
    //    key: "aa628d568082ee43d2aa946f9dc2d233748b70d5b02de9160783ba940555682b",
    //    password: "",
    //    valid: true
    // }
    // console.log(value);

    // keystore: keystoreFile
    // private key: privateKey
    // console.log(selectedWalletKey);

    switch (selectedWalletKey) {
      case 'mnemonic':
        try {
          // TODO find address part for claude
          wallet = getMnemonicWallet(value.phrase, value.password, value.path, value.address);
          // TODO action on successful wallet change
        } catch (err) {
          console.log('show translated ERROR_14 (wallet not found)');
          // TODO action on unlock failure
        }
        break;
      case 'privateKey':
        try {
          wallet = getPrivKeyWallet(value.key, value.password);
        } catch (e) {
          console.log('ERROR ' + e.message);
        }
        break;
      case 'keystoreFile':
        try {
          wallet = getKeystoreWallet(value.file, value.password);
        } catch (e) {
          if (
            value.password === '' &&
            e.message === 'Private key does not satisfy the curve requirements (ie. it is invalid)'
          ) {
            // yield put(setPasswordPrompt());
            console.log('show password prompt');
          } else {
            console.log(value, selectedWalletKey);
            // check whether a password was provided
            if (value.password) {
              const { dialogShow } = this.global;
              dialogShow('Invalid Password', 'Invalid password provided');
              // yield put(showNotification('danger', translate('ERROR_6')));
              console.log('show translated ERROR_6 (invalid password)');
            }
          }
        }
        break;
    }

    if (wallet) {
      this.global.setWallet(wallet);
    }
    //console.log(this.global.wallet);
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
