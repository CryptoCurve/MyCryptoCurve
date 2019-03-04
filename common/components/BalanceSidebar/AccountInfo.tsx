import React from 'react';
import { connect } from 'react-redux';
import { toChecksumAddress } from 'ethereumjs-util';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { UnitDisplay, Address, NewTabLink, Modal } from 'components/ui';
import { IWallet, Balance, TrezorWallet, LedgerWallet } from 'libs/wallet';
import translate from 'translations';
import Spinner from 'components/ui/Spinner';
import { getNetworkConfig, getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { NetworkConfig } from 'types/network';
import { TRefreshAccountBalance, refreshAccountBalance } from 'actions/wallet';
import { etherChainExplorerInst } from 'config/data';
import './AccountInfo.scss';
import { IButton } from '../ui/Modal';

interface OwnProps {
  wallet: IWallet;
}

interface StateProps {
  balance: Balance;
  network: NetworkConfig;
  isOffline: boolean;
}

interface State {
  showLongBalance: boolean;
  address: string;
  confirmAddr: boolean;
  copied: boolean;
  copiedPrivate: boolean;
  openPrivateKeyModal: boolean;
  showPrivateKey: boolean;
  privateKey: string | null;
}

interface DispatchProps {
  refreshAccountBalance: TRefreshAccountBalance;
}

type Props = OwnProps & StateProps & DispatchProps;

class AccountInfo extends React.Component<Props, State> {
  public state: State = {
    showLongBalance: false,
    address: '',
    confirmAddr: false,
    copied: false,
    copiedPrivate: false,
    openPrivateKeyModal: false,
    showPrivateKey: false,
    privateKey: null
  };

  public setAddressFromWallet() {
    console.log(this.props.wallet);
    const address = this.props.wallet.getAddressString();
    if (address !== this.state.address) {
      this.setState({ address });
    }
  }

  public componentDidMount() {
    this.setAddressFromWallet();
  }

  public componentDidUpdate() {
    this.setAddressFromWallet();
  }

  public toggleConfirmAddr = () => {
    this.setState(state => {
      return { confirmAddr: !state.confirmAddr };
    });
  };

  public toggleShowLongBalance = (e: React.FormEvent<HTMLSpanElement>) => {
    e.preventDefault();
    this.setState(state => {
      return {
        showLongBalance: !state.showLongBalance
      };
    });
  };

  public onCopy = () => {
    this.setState(state => {
      return {
        copied: !state.copied
      };
    });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  };

  public onCopyPrivate = () => {
    this.setState(state => {
      return {
        copiedPrivate: !state.copiedPrivate
      };
    });
    setTimeout(() => {
      this.setState({ copiedPrivate: false });
    }, 2000);
  };

  public render() {
    const { network, balance, isOffline, wallet: { isReadOnly } } = this.props;
    const {
      address,
      showLongBalance,
      confirmAddr,
      openPrivateKeyModal,
      showPrivateKey,
      privateKey
    } = this.state;
    let blockExplorer;
    let tokenExplorer;
    if (!network.isCustom) {
      // this is kind of ugly but its the result of typeguards, maybe we can find a cleaner solution later on such as just dedicating it to a selector
      blockExplorer = network.blockExplorer;
      tokenExplorer = network.tokenExplorer;
    }

    const wallet = this.props.wallet as LedgerWallet | TrezorWallet;
    return (
      <div className="AccountInfo">
        <h5 className="AccountInfo-section-header">{translate('SIDEBAR_ACCOUNTADDR')}</h5>
        <div className="AccountInfo-section AccountInfo-address-section">
          <div className="AccountInfo-address-wrapper">
            <div className="AccountInfo-address-addr">
              <Address address={address} />
            </div>
            <CopyToClipboard onCopy={this.onCopy} text={toChecksumAddress(address)}>
              <div
                className={`AccountInfo-copy ${this.state.copied ? 'is-copied' : ''}`}
                title="Copy To clipboard"
              >
                <i className="fa fa-copy" />
                <span>{this.state.copied ? 'copied!' : 'copy address'}</span>
              </div>
            </CopyToClipboard>
          </div>
        </div>
        {!isReadOnly && (
          <div className="AccountInfo-section">
            <h5 className="AccountInfo-section-header">Private Key</h5>
            <div className="AccountInfo-section AccountInfo-address-section">
              {!showPrivateKey && (
                <button className="btn btn-default btn-block" onClick={this.onClickShowPrivateKey}>
                  Show Private Key
                </button>
              )}
              {showPrivateKey && (
                <div className="AccountInfo-address-wrapper">
                  <div className="AccountInfo-address-addr">{privateKey}</div>
                  <CopyToClipboard onCopy={this.onCopyPrivate} text={privateKey || ''}>
                    <div
                      className={`AccountInfo-copy ${this.state.copiedPrivate ? 'is-copied' : ''}`}
                      title="Copy To clipboard"
                    >
                      <i className="fa fa-copy" />
                      <span>{this.state.copiedPrivate ? 'copied!' : 'copy address'}</span>
                    </div>
                  </CopyToClipboard>
                </div>
              )}
            </div>
          </div>
        )}
        {typeof wallet.displayAddress === 'function' && (
          <div className="AccountInfo-section">
            <a
              className="AccountInfo-address-hw-addr"
              onClick={() => {
                this.toggleConfirmAddr();
                wallet
                  .displayAddress()
                  .then(() => this.toggleConfirmAddr())
                  .catch(e => {
                    this.toggleConfirmAddr();
                    throw new Error(e);
                  });
              }}
            >
              {confirmAddr
                ? null
                : translate('SIDEBAR_DISPLAY_ADDR', { $wallet: wallet.getWalletType() })}
            </a>
            {confirmAddr ? (
              <span className="AccountInfo-address-confirm">
                <Spinner /> Confirm address on {wallet.getWalletType()}
              </span>
            ) : null}
          </div>
        )}

        <div className="AccountInfo-section">
          <h5 className="AccountInfo-section-header">{translate('SIDEBAR_ACCOUNTBAL')}</h5>
          <ul className="AccountInfo-list">
            <li className="AccountInfo-list-item AccountInfo-balance">
              <span
                className="AccountInfo-list-item-clickable AccountInfo-balance-amount mono wrap"
                onClick={this.toggleShowLongBalance}
              >
                <UnitDisplay
                  value={balance.wei}
                  unit={'ether'}
                  displayShortBalance={!showLongBalance}
                  checkOffline={true}
                  symbol={balance.wei ? network.name : null}
                />
              </span>
              {balance.wei && (
                <React.Fragment>
                  {balance.isPending ? (
                    <Spinner />
                  ) : (
                    !isOffline && (
                      <button
                        className="AccountInfo-section-refresh"
                        onClick={this.props.refreshAccountBalance}
                      >
                        <i className="fa fa-refresh" />
                      </button>
                    )
                  )}
                </React.Fragment>
              )}
            </li>
          </ul>
        </div>

        {(!!blockExplorer || !!tokenExplorer) && (
          <div className="AccountInfo-section">
            <h5 className="AccountInfo-section-header">{translate('SIDEBAR_TRANSHISTORY')}</h5>
            <ul className="AccountInfo-list">
              {!!blockExplorer && (
                <li className="AccountInfo-list-item">
                  <NewTabLink href={blockExplorer.addressUrl(address)}>
                    {`${network.name} (${blockExplorer.origin})`}
                  </NewTabLink>
                </li>
              )}
              {network.name === 'ETH' && (
                <li className="AccountInfo-list-item">
                  <NewTabLink href={etherChainExplorerInst.addressUrl(address)}>
                    {`${network.name} (${etherChainExplorerInst.origin})`}
                  </NewTabLink>
                </li>
              )}
              {!!tokenExplorer && (
                <li className="AccountInfo-list-item">
                  <NewTabLink href={tokenExplorer.address(address)}>
                    {`Tokens (${tokenExplorer.name})`}
                  </NewTabLink>
                </li>
              )}
            </ul>
          </div>
        )}
        <ShowPrivateKeyModal
          closeFn={this.closeModal}
          confirmFn={this.confirmShowPrivateKey}
          open={openPrivateKeyModal}
        />
      </div>
    );
  }

  private onClickShowPrivateKey = () => {
    this.setState({ openPrivateKeyModal: true });
  };

  private closeModal = () => {
    this.setState({ openPrivateKeyModal: false });
  };

  private confirmShowPrivateKey = () => {
    console.log(this.props);
    console.log('Confirm showing private key');
    const privateKey =
      this.props.wallet.getPrivateKeyString && this.props.wallet.getPrivateKeyString();
    console.log(privateKey);
    this.setState({
      openPrivateKeyModal: false,
      showPrivateKey: true,
      privateKey: privateKey || null
    });
  };
}

function mapStateToProps(state: AppState): StateProps {
  return {
    balance: state.wallet.balance,
    network: getNetworkConfig(state),
    isOffline: getOffline(state)
  };
}

const mapDispatchToProps: DispatchProps = { refreshAccountBalance };
export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);

const ShowPrivateKeyModal = (props: { open: boolean; closeFn: any; confirmFn: any }) => {
  const { open, closeFn, confirmFn } = props;
  const buttons: IButton[] = [
    { text: 'Show', type: 'primary', onClick: confirmFn },
    { text: 'Cancel', type: 'default', onClick: closeFn }
  ];

  return (
    <Modal title="Show private key?" isOpen={open} handleClose={closeFn} buttons={buttons}>
      <p>You will be showing this key at your own risk</p>
    </Modal>
  );
};
