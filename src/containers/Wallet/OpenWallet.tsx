import * as React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Button from '@material-ui/core/Button/Button';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import { helperRenderConsoleText } from '../../helpers/helpers';
import Template from '../Template';
import { WithSnackBarContext } from '../../context/SnackBarContext';
import { Wallet, withWalletContext, WithWalletContext } from '../../context/WalletContext';
import PrivateKeyDecrypt, { PrivateKeyValue } from './components/PrivateKeyDecrypt';
import Slide from '@material-ui/core/Slide/Slide';
import { KeystoreDecrypt, KeystoreValue } from './components/KeyStoreDecrypt';
import { MnemonicDecrypt } from './components/MnemonicDecrypt';

export enum WalletName {
  PRIVATE_KEY = 'privateKey',
  KEYSTORE_FILE = 'keystoreFile',
  MNEMONIC_PHRASE = 'mnemonicPhrase'
}

export interface WalletType {
  title: string;
  example: string;
  component: any;
  initialParams: PrivateKeyValue
}

export const walletTypes = {
  [WalletName.PRIVATE_KEY]: {
    title: 'Private Key',
    example: 'f1d0e0789c6d40f399ca90cc674b7858de4c719e0d5752a60d5d2f6baa45d4c9',
    component: PrivateKeyDecrypt,
    initialParams: {
      key: '',
      password: '',
      isValidPkey: false,
      isValidPassword: false,
      isPasswordRequired: false
    }
  },
  [WalletName.KEYSTORE_FILE]: {
    title: 'Keystore File',
    example: 'UTC--2017-12-15T17-35-22.547Z--6be6e49e82425a5aa56396db03512f2cc10e95e8',
    component: KeystoreDecrypt,
    initialParams: {
      file: '',
      password: ''
    }
  },
  [WalletName.MNEMONIC_PHRASE]: {
    title: 'Mnemonic',
    example: 'brain surround have swap horror cheese file distinct',
    component: MnemonicDecrypt,
    initialParams: {}
  }
};

type UnlockParams = {} | PrivateKeyValue;

interface OwnProps {
}

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

type Props = OwnProps & WithStyles<typeof styles> & WithSnackBarContext & WithWalletContext;

class OpenWallet extends React.Component<Props, State> {
  public state = {
    selectedWalletKey: null,
    value: {},
    loginSelectorValue: WalletName.PRIVATE_KEY,
    loginSelectorOpen: false
  };

  public render() {
    console.log(...helperRenderConsoleText('Render OpenWallet', 'lightGreen'));
    const { classes } = this.props;
    const { loginSelectorValue } = this.state;
    const selectedWallet = this.getSelectedWallet();
    const decryptionComponent = this.getDecryptionComponent();
    return (
      <Slide in={true} direction="left">
        <Template
          title={selectedWallet ? selectedWallet.title : 'Select a login method'}
          hideButton={!(selectedWallet && selectedWallet.title)}
          buttonAction={this.onBackButton}
        >
          <Grid container={true} item={true} alignItems="center" justify="center" direction="column">
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
                    // onClose={this.handleLoginSelectorClose}
                    // onOpen={this.handleLoginSelectorOpen}
                    value={loginSelectorValue}
                    onChange={this.handleLoginSelectorChange}
                    className={classes.loginSelector}
                  >
                    {Object.keys(walletTypes).map((walletType: WalletName) => {
                      const wallet = walletTypes[walletType];
                      return (
                        <MenuItem key={walletType} value={walletType}>
                          {wallet.title}
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
                    Continue
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Template>
      </Slide>
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
    return walletTypes[selectedWalletKey];
  }

  private onChange = (value: UnlockParams) => {
    this.setState({ value });
  };

  // private onMnemonicUnlock = () => {
  //   // receives mnemonic and optional password, returns array of addresses for selection
  //   console.log('onMnemonicUnlock called');
  // };

  private onUnlock = (payload: PrivateKeyValue | KeystoreValue) => {
    const { selectedWalletKey } = this.state;
    console.log(selectedWalletKey);
    console.log(payload);
    const wallet: Wallet = {
      _privKey: "Private key stuff here",
      address: '???'
    };
    if (wallet) {
      this.props.walletContext.setWallet(wallet)();
    }
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
          onUnlock={this.onUnlock}
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

export default (withStyles(styles)(withWalletContext(OpenWallet)) as unknown) as React.ComponentClass<OwnProps>;
