import React, { Component } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  setWallet,
  TSetWallet,
  TUnlockKeystore,
  TUnlockMnemonic,
  TUnlockPrivateKey,
  TUnlockWeb3,
  unlockKeystore,
  unlockMnemonic,
  unlockPrivateKey,
  unlockWeb3
} from 'actions/wallet';
import { resetTransactionRequested, TResetTransactionRequested } from 'actions/transaction';
import translate, { translateRaw } from 'translations';
import {
  KeystoreDecrypt,
  LedgerNanoSDecrypt,
  MnemonicDecrypt,
  ParitySignerDecrypt,
  PrivateKeyDecrypt,
  PrivateKeyValue,
  TrezorDecrypt,
  ViewOnlyDecrypt,
  WalletButton,
  Web3Decrypt
} from './components';
import { AppState } from 'reducers';
import { showNotification, TShowNotification } from 'actions/notifications';
import { getDisabledWallets } from 'selectors/wallet';
import { DisabledWallets } from './disables';
import {
  donationAddressMap,
  InsecureWalletName,
  knowledgeBaseURL,
  MiscWalletName,
  SecureWalletName,
  WalletName
} from 'config';
import { isWeb3NodeAvailable } from 'libs/nodes/web3';
import CipherIcon from 'assets/images/wallets/cipher.svg';
import LedgerIcon from 'assets/images/wallets/ledger.svg';
import MetamaskIcon from 'assets/images/wallets/metamask.svg';
import MistIcon from 'assets/images/wallets/mist.svg';
import TrezorIcon from 'assets/images/wallets/trezor.svg';
import ParitySignerIcon from 'assets/images/wallets/parity-signer.svg';
import { wikiLink as paritySignerHelpLink } from 'libs/wallet/non-deterministic/parity';
import './WalletDecrypt.scss';
import { RouteComponentProps, withRouter } from 'react-router';
import { Errorable } from 'components';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Button from '@material-ui/core/Button/Button';
import Template from '../../containers/Tabs/GenerateWallet/components/Template';

interface OwnProps {
  hidden?: boolean;
  disabledWallets?: DisabledWallets;
  showGenerateLink?: boolean;
}

interface DispatchProps {
  unlockKeystore: TUnlockKeystore;
  unlockMnemonic: TUnlockMnemonic;
  unlockPrivateKey: TUnlockPrivateKey;
  unlockWeb3: TUnlockWeb3;
  setWallet: TSetWallet;
  resetTransactionRequested: TResetTransactionRequested;
  showNotification: TShowNotification;
}

interface StateProps {
  computedDisabledWallets: DisabledWallets;
  isWalletPending: AppState['wallet']['isWalletPending'];
  isPasswordPending: AppState['wallet']['isPasswordPending'];
}

type Props = OwnProps & StateProps & DispatchProps & RouteComponentProps<{}>;

type UnlockParams = {} | PrivateKeyValue;

interface State {
  selectedWalletKey: WalletName | null;
  value: UnlockParams | null;
  hasAcknowledgedInsecure: boolean;
  loginSelectorOpen: boolean;
  loginSelectorValue: InsecureWalletName;
}

interface BaseWalletInfo {
  lid: string;
  component: any;
  initialParams: object;
  unlock: any;
  helpLink: string;
  isReadOnly?: boolean;
  attemptUnlock?: boolean;
  redirect?: string;
}

export interface SecureWalletInfo extends BaseWalletInfo {
  icon?: string;
  description: string;
}

export interface InsecureWalletInfo extends BaseWalletInfo {
  example: string;
}

// tslint:disable-next-line:no-empty-interface
interface MiscWalletInfo extends InsecureWalletInfo {}

const WEB3_TYPES = {
  CipherProvider: {
    lid: 'X_CIPHER',
    icon: CipherIcon
  },
  MetamaskInpageProvider: {
    lid: 'X_METAMASK',
    icon: MetamaskIcon
  },
  EthereumProvider: {
    lid: 'X_MIST',
    icon: MistIcon
  }
};

type SecureWallets = { [key in SecureWalletName]: SecureWalletInfo };
type InsecureWallets = { [key in InsecureWalletName]: InsecureWalletInfo };
type MiscWallet = { [key in MiscWalletName]: MiscWalletInfo };
type Wallets = SecureWallets & InsecureWallets & MiscWallet;

const WEB3_TYPE: keyof typeof WEB3_TYPES | false =
  (window as any).web3 && (window as any).web3.currentProvider.constructor.name;

const SECURE_WALLETS = Object.values(SecureWalletName);
const INSECURE_WALLETS = Object.values(InsecureWalletName);

// const MISC_WALLETS = Object.values(MiscWalletName);
const styles = (theme: Theme) =>
  createStyles({
    loginSelectItem: {
      marginTop: theme.spacing.unit * 12
    },
    loginSelector: {
      width: '100%'
    }
  });

class WalletDecrypt extends Component<
  RouteComponentProps<{}> & Props & WithStyles<typeof styles>,
  State
> {
  // https://github.com/Microsoft/TypeScript/issues/13042
  // index signature should become [key: Wallets] (from config) once typescript bug is fixed
  public WALLETS: Wallets = {
    [SecureWalletName.WEB3]: {
      lid: WEB3_TYPE && WEB3_TYPES[WEB3_TYPE] ? WEB3_TYPES[WEB3_TYPE].lid : 'X_WEB3',
      icon: WEB3_TYPE && WEB3_TYPES[WEB3_TYPE] && WEB3_TYPES[WEB3_TYPE].icon,
      description: 'ADD_WEB3DESC',
      component: Web3Decrypt,
      initialParams: {},
      unlock: this.props.unlockWeb3,
      attemptUnlock: true,
      helpLink: `${knowledgeBaseURL}/migration/moving-from-private-key-to-metamask`
    },
    [SecureWalletName.LEDGER_NANO_S]: {
      lid: 'X_LEDGER',
      icon: LedgerIcon,
      description: 'ADD_HARDWAREDESC',
      component: LedgerNanoSDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink: 'https://support.ledgerwallet.com/hc/en-us/articles/115005200009'
    },
    [SecureWalletName.TREZOR]: {
      lid: 'X_TREZOR',
      icon: TrezorIcon,
      description: 'ADD_HARDWAREDESC',
      component: TrezorDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink:
        'https://support.mycrypto.com/accessing-your-wallet/how-to-use-your-trezor-with-mycrypto.html'
    },
    [SecureWalletName.PARITY_SIGNER]: {
      lid: 'X_PARITYSIGNER',
      icon: ParitySignerIcon,
      description: 'ADD_PARITY_DESC',
      component: ParitySignerDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink: paritySignerHelpLink
    },
    [InsecureWalletName.KEYSTORE_FILE]: {
      lid: 'X_KEYSTORE2',
      example: 'UTC--2017-12-15T17-35-22.547Z--6be6e49e82425a5aa56396db03512f2cc10e95e8',
      component: KeystoreDecrypt,
      initialParams: {
        file: '',
        password: ''
      },
      unlock: this.props.unlockKeystore,
      helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
    },
    [InsecureWalletName.MNEMONIC_PHRASE]: {
      lid: 'X_MNEMONIC',
      example: 'brain surround have swap horror cheese file distinct',
      component: MnemonicDecrypt,
      initialParams: {},
      unlock: this.props.unlockMnemonic,
      helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
    },
    [InsecureWalletName.PRIVATE_KEY]: {
      lid: 'X_PRIVKEY2',
      example: 'f1d0e0789c6d40f399ca90cc674b7858de4c719e0d5752a60d5d2f6baa45d4c9',
      component: PrivateKeyDecrypt,
      initialParams: {
        key: '',
        password: ''
      },
      unlock: this.props.unlockPrivateKey,
      helpLink: `${knowledgeBaseURL}/private-keys-passwords/difference-beween-private-key-and-keystore-file.html`
    },
    [MiscWalletName.VIEW_ONLY]: {
      lid: 'VIEW_ADDR',
      example: donationAddressMap.ETH,
      component: ViewOnlyDecrypt,
      initialParams: {},
      unlock: this.props.setWallet,
      helpLink: '',
      isReadOnly: true,
      redirect: '/account/info'
    }
  };

  public state: State = {
    selectedWalletKey: null,
    value: null,
    hasAcknowledgedInsecure: false,
    loginSelectorOpen: false,
    loginSelectorValue: InsecureWalletName.KEYSTORE_FILE
    // loginSelectorValue: InsecureWalletName.PRIVATE_KEY
  };

  public componentWillMount() {
    const { match } = this.props;
    const params: any = match.params;
    if (params.action === 'view') {
      this.setState({ selectedWalletKey: MiscWalletName.VIEW_ONLY });
    }
  }

  public componentDidMount() {
    // setTimeout(()=>this.handleWalletChoice(this.state.loginSelectorValue).then(),500);
  }

  public componentWillReceiveProps(nextProps: Props) {
    // Reset state when unlock is hidden / revealed
    let shouldIDoIt = false;
    let selectedWalletKey = null;
    if (nextProps.match.params !== this.props.match.params) {
      const thisParams: any = this.props.match.params;
      const nextParams: any = nextProps.match.params;
      if (thisParams.action === 'view' && nextParams.action !== 'view') {
        shouldIDoIt = true;
      } else {
        if (nextParams.action === 'view') {
          selectedWalletKey = MiscWalletName.VIEW_ONLY;
          shouldIDoIt = true;
        }
      }
      const { match } = nextProps;
      const params: any = match.params;
      if (params.action === 'view') {
        selectedWalletKey = MiscWalletName.VIEW_ONLY;
        shouldIDoIt = true;
      }
    }
    if (nextProps.hidden !== this.props.hidden) {
      shouldIDoIt = true;
    }
    if (shouldIDoIt) {
      this.setState({
        value: null,
        selectedWalletKey
      });
    }
  }

  public getSelectedWallet() {
    const { selectedWalletKey } = this.state;
    if (!selectedWalletKey) {
      return null;
    }
    // @ts-ignore
    return this.WALLETS[selectedWalletKey];
  }

  public getDecryptionComponent() {
    const { selectedWalletKey, hasAcknowledgedInsecure } = this.state;
    const selectedWallet = this.getSelectedWallet();

    if (!selectedWalletKey || !selectedWallet) {
      return null;
    }

    /*if (INSECURE_WALLETS.includes(selectedWalletKey) && !hasAcknowledgedInsecure) {
      return (
        <div className="WalletDecrypt-decrypt">
          <InsecureWalletWarning
            walletType={translateRaw(selectedWallet.lid)}
            onContinue={this.handleAcknowledgeInsecure}
            onCancel={this.clearWalletChoice}
          />
        </div>
      );
    }*/
    return (
      <Grid container={true}>
        {/*<button className="WalletDecrypt-decrypt-back" onClick={this.clearWalletChoice}>*/}
        {/*<i className="fa fa-arrow-left" /> {translate('CHANGE_WALLET')}*/}
        {/*</button>*/}
        {/*<h2 className="WalletDecrypt-decrypt-title">*/}
        {/*{!selectedWallet.isReadOnly} {translate(selectedWallet.lid)}*/}
        {/*</h2>*/}
        <Errorable
          errorMessage={`Oops, looks like ${translateRaw(
            selectedWallet.lid
          )} is not supported by your browser`}
          onError={this.clearWalletChoice}
        >
          <selectedWallet.component
            value={this.state.value}
            onChange={this.onChange}
            onUnlock={(value: any) => {
              if (selectedWallet.redirect) {
                this.props.history.push(selectedWallet.redirect);
              }
              this.onUnlock(value);
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
        </Errorable>
      </Grid>
    );
  }

  public handleAcknowledgeInsecure = () => {
    this.setState({ hasAcknowledgedInsecure: true });
  };

  public handleLoginSelectorClose = () => {
    this.setState({ loginSelectorOpen: false });
  };
  public handleLoginSelectorOpen = () => {
    this.setState({ loginSelectorOpen: true });
  };
  public handleLoginSelectorChange = (e: React.ChangeEvent<any>) => {
    this.setState({ loginSelectorValue: e.target.value });
  };

  public buildWalletOptions() {
    const { classes } = this.props;
    const { loginSelectorOpen, loginSelectorValue } = this.state;

    return (
      <Grid
        item={true}
        container={true}
        className={classes.loginSelectItem}
        direction="column"
        spacing={40}
      >
        <Grid item={true}>
          <Select
            open={loginSelectorOpen}
            onClose={this.handleLoginSelectorClose}
            onOpen={this.handleLoginSelectorOpen}
            value={loginSelectorValue}
            onChange={this.handleLoginSelectorChange}
            className={classes.loginSelector}
          >
            {/*{SECURE_WALLETS.map((walletType: SecureWalletName) => {*/}
            {/*const wallet = this.WALLETS[walletType];*/}
            {/*return (*/}
            {/*<MenuItem key={walletType} value={walletType}>{translateRaw(wallet.lid)}</MenuItem>*/}
            {/*);*/}
            {/*})}*/}
            {INSECURE_WALLETS.map((walletType: InsecureWalletName) => {
              const wallet = this.WALLETS[walletType];
              return (
                <MenuItem key={walletType} value={walletType}>
                  {translateRaw(wallet.lid)}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
        <Grid item={true}>
          <Button
            variant="raised"
            color="primary"
            onClick={this.handleWalletChoice.bind(this, loginSelectorValue)}
          >
            {translate('ACTION_14')}
          </Button>
        </Grid>
      </Grid>
    );
  }

  public handleWalletChoice = async (walletType: WalletName) => {
    const wallet = this.WALLETS[walletType];

    if (!wallet) {
      return;
    }

    let timeout = 0;
    if (wallet.attemptUnlock) {
      const web3Available = await isWeb3NodeAvailable();
      if (web3Available) {
        // timeout is only the maximum wait time before secondary view is shown
        // send view will be shown immediately on web3 resolve
        timeout = 1500;
        wallet.unlock();
      }
    }

    window.setTimeout(() => {
      this.setState({
        selectedWalletKey: walletType,
        value: wallet.initialParams,
        hasAcknowledgedInsecure: false
      });
    }, timeout);
  };

  public clearWalletChoice = () => {
    this.setState({
      selectedWalletKey: null,
      value: null,
      hasAcknowledgedInsecure: false
    });
  };

  public render() {
    const { hidden } = this.props;
    const selectedWallet = this.getSelectedWallet();
    const decryptionComponent = this.getDecryptionComponent();
    return (
      <Template
        version={2}
        title={selectedWallet ? selectedWallet.lid : 'OPEN_WALLET_SELECT'}
        hideButton={!(selectedWallet && selectedWallet.lid)}
      >
        <React.Fragment>
          {!hidden && (
            <Grid container={true} item={true} alignItems="center" justify="center">
              <TransitionGroup>
                {decryptionComponent && selectedWallet ? (
                  <CSSTransition classNames="DecryptContent" timeout={500} key="decrypt">
                    {decryptionComponent}
                  </CSSTransition>
                ) : (
                  <CSSTransition classNames="DecryptContent" timeout={500} key="wallets">
                    {this.buildWalletOptions()}
                  </CSSTransition>
                )}
              </TransitionGroup>
            </Grid>
          )}
        </React.Fragment>
      </Template>
    );
  }

  public onChange = (value: UnlockParams) => {
    this.setState({ value });
  };

  public onUnlock = (payload: any) => {
    const { value, selectedWalletKey } = this.state;
    if (!selectedWalletKey) {
      return;
    }

    // some components (TrezorDecrypt) don't take an onChange prop, and thus
    // this.state.value will remain unpopulated. in this case, we can expect
    // the payload to contain the unlocked wallet info.
    const unlockValue = value && !isEmpty(value) ? value : payload;
    this.WALLETS[selectedWalletKey].unlock(unlockValue);
    this.props.resetTransactionRequested();
  };

  private isWalletDisabled = (walletKey: WalletName) => {
    return this.props.computedDisabledWallets.wallets.indexOf(walletKey) !== -1;
  };
}

function mapStateToProps(state: AppState, ownProps: Props) {
  const { disabledWallets } = ownProps;
  let computedDisabledWallets = getDisabledWallets(state);

  if (disabledWallets) {
    computedDisabledWallets = {
      wallets: [...computedDisabledWallets.wallets, ...disabledWallets.wallets],
      reasons: {
        ...computedDisabledWallets.reasons,
        ...disabledWallets.reasons
      }
    };
  }

  return {
    computedDisabledWallets,
    isWalletPending: state.wallet.isWalletPending,
    isPasswordPending: state.wallet.isPasswordPending
  };
}

export default withStyles(styles)(
  withRouter(
    connect(mapStateToProps, {
      unlockKeystore,
      unlockMnemonic,
      unlockPrivateKey,
      unlockWeb3,
      setWallet,
      resetTransactionRequested,
      showNotification
    })(WalletDecrypt)
  )
) as React.ComponentClass<OwnProps>;
