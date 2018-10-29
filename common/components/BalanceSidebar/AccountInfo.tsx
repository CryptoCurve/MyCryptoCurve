import React from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { UnitDisplay, Address, NewTabLink } from 'components/ui';
import { IWallet, Balance, TrezorWallet, LedgerWallet } from 'libs/wallet';
import translate from 'translations';
import Spinner from 'components/ui/Spinner';
import { getNetworkConfig, getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { NetworkConfig } from 'types/network';
import { TRefreshAccountBalance, refreshAccountBalance } from 'actions/wallet';
import { etherChainExplorerInst } from 'config/data';
import './AccountInfo.scss';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import IconButton from '@material-ui/core/IconButton/IconButton';
import CopyIcon from '@material-ui/icons/FilterNone';
import { green } from '@material-ui/core/colors';
import RefreshIcon from '@material-ui/icons/Refresh';
import Button from '@material-ui/core/Button/Button';
import { Colors } from '../../Root';

const sdk = require('cryptocurve-sdk');

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
}

interface DispatchProps {
  refreshAccountBalance: TRefreshAccountBalance;
}

const styles = (theme: Theme) =>
  createStyles({
    topMargin: {
      marginTop: theme.spacing.unit
    },
    flipIcon: {
      transform: 'scaleY(-1)'
    },
    success: {
      color: green['500']
    },
    addressText: {
      wordBreak: 'break-word'
    },
    balanceText: {
      ...theme.typography.caption,
      '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline'
      }
    },
    whiteText: {
      color: Colors.white,
      '&:hover': {
        color: Colors.white
      },
      '&:focus': {
        color: Colors.white
      }
    }
  });

type Props = OwnProps & StateProps & DispatchProps & WithStyles<typeof styles>;

class AccountInfo extends React.Component<Props, State> {
  public state = {
    showLongBalance: false,
    address: '',
    confirmAddr: false,
    copied: false
  };

  public setAddressFromWallet() {
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

  public render() {
    const { network, balance, isOffline, classes } = this.props;
    const { address, showLongBalance, confirmAddr, copied } = this.state;
    let blockExplorer;
    let tokenExplorer;
    if (!network.isCustom) {
      // this is kind of ugly but its the result of typeguards, maybe we can find a cleaner solution later on such as just dedicating it to a selector
      blockExplorer = network.blockExplorer;
      tokenExplorer = network.tokenExplorer;
    }
    const wallet = this.props.wallet as LedgerWallet | TrezorWallet;
    return (
      <React.Fragment>
        <Grid
          item={true}
          container={true}
          direction="column"
          className={classes.topMargin}
          spacing={8}
        >
          <Grid item={true}>
            <Typography variant="display1">{translate('SIDEBAR_ACCOUNTADDR')}</Typography>
          </Grid>
          <Grid container={true} item={true} direction="row" alignItems="center">
            <Typography variant="caption" className={classes.addressText}>
              <Address address={address} />
            </Typography>
            <CopyToClipboard onCopy={this.onCopy} text={sdk.utils.eth.toChecksumAddress(address)}>
              <IconButton className={copied ? classes.success : undefined}>
                <CopyIcon className={classes.flipIcon} />
              </IconButton>
            </CopyToClipboard>
          </Grid>
          <Grid item={true} className={classes.topMargin}>
            <Typography variant="display1">{translate('SIDEBAR_ACCOUNTBAL')}</Typography>
          </Grid>
          <Grid
            item={true}
            container={true}
            className={classes.topMargin}
            alignItems="center"
            direction="row"
          >
            <span onClick={this.toggleShowLongBalance} className={classes.balanceText}>
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
                    <IconButton onClick={this.props.refreshAccountBalance}>
                      <RefreshIcon />
                    </IconButton>
                  )
                )}
              </React.Fragment>
            )}
          </Grid>
          {(!!blockExplorer || !!tokenExplorer) && (
            <Grid
              container={true}
              spacing={8}
              item={true}
              className={classes.topMargin}
              direction="column"
            >
              <Grid item={true} className={classes.topMargin} />
              {/*<Typography variant="display1">{translate('SIDEBAR_TRANSHISTORY')}</Typography>*/}
              {!!blockExplorer && (
                <Grid item={true}>
                  <Button variant="raised" color="primary">
                    <NewTabLink
                      className={classes.whiteText}
                      href={blockExplorer.addressUrl(address)}
                    >
                      View Transaction History
                    </NewTabLink>
                  </Button>
                </Grid>
              )}
              {network.name === 'ETH' && (
                <Grid item={true}>
                  <Button variant="raised" color="primary">
                    <NewTabLink href={etherChainExplorerInst.addressUrl(address)}>
                      {`${network.name} (${etherChainExplorerInst.origin})`}
                    </NewTabLink>
                  </Button>
                </Grid>
              )}
              {!!tokenExplorer && (
                <Grid item={true}>
                  <Button variant="raised" color="primary">
                    <NewTabLink href={tokenExplorer.address(address)}>
                      {`Tokens (${tokenExplorer.name})`}
                    </NewTabLink>
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
        <div className="AccountInfo">
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
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    balance: state.wallet.balance,
    network: getNetworkConfig(state),
    isOffline: getOffline(state)
  };
}

const mapDispatchToProps: DispatchProps = { refreshAccountBalance };
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(AccountInfo)
) as React.ComponentClass<OwnProps>;
