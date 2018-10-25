import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import {
  addCustomToken,
  removeCustomToken,
  TAddCustomToken,
  TRemoveCustomToken
} from 'actions/customTokens';
import {
  scanWalletForTokens,
  TScanWalletForTokens,
  setWalletTokens,
  TSetWalletTokens,
  refreshTokenBalances,
  TRefreshTokenBalances
} from 'actions/wallet';
import { getAllTokens, getOffline } from 'selectors/config';
import { getTokenBalances, getWalletInst, getWalletConfig, TokenBalance } from 'selectors/wallet';
import translate from 'translations';
import Balances from './Balances';
import { Token } from 'types/network';
import './index.scss';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

interface StateProps {
  wallet: AppState['wallet']['inst'];
  walletConfig: AppState['wallet']['config'];
  tokens: Token[];
  tokenBalances: TokenBalance[];
  tokensError: AppState['wallet']['tokensError'];
  isTokensLoading: AppState['wallet']['isTokensLoading'];
  hasSavedWalletTokens: AppState['wallet']['hasSavedWalletTokens'];
  isOffline: AppState['config']['meta']['offline'];
}

interface DispatchProps {
  addCustomToken: TAddCustomToken;
  removeCustomToken: TRemoveCustomToken;
  scanWalletForTokens: TScanWalletForTokens;
  setWalletTokens: TSetWalletTokens;
  refreshTokenBalances: TRefreshTokenBalances;
}

const styles = (theme: Theme) =>
  createStyles({
    tokenBalanceGrid: {
      marginTop: theme.spacing.unit * 4
    },
    tryAgainButton: {
      padding: ['7px', '15px'].join(' ')
    },
    buttonIcon: {
      marginLeft: theme.spacing.unit
    },
    topMargin: {
      marginTop: theme.spacing.unit * 2
    }
  });

type Props = StateProps & DispatchProps & WithStyles<typeof styles>;

class TokenBalances extends React.Component<Props> {
  public render() {
    const {
      tokens,
      walletConfig,
      tokenBalances,
      hasSavedWalletTokens,
      isTokensLoading,
      tokensError,
      isOffline,
      classes
    } = this.props;

    const walletTokens = walletConfig ? walletConfig.tokens : [];
    let content;
    if (isOffline) {
      content = <Typography variant="caption">{translate('SCAN_TOKENS_OFFLINE')}</Typography>;
    } else if (tokensError) {
      content = (
        <Grid container={true} spacing={8}>
          <Grid item={true}>
            <Typography variant="caption" color="error">
              {tokensError} this will be an error displaying stuff
            </Typography>
          </Grid>
          <Grid item={true}>
            <Button
              variant="outlined"
              size="small"
              onClick={this.props.refreshTokenBalances}
              className={classes.tryAgainButton}
            >
              {translate('X_TRY_AGAIN')}
              <RefreshIcon className={classes.buttonIcon} fontSize="small" />
            </Button>
          </Grid>
        </Grid>
      );
    } else if (isTokensLoading) {
      content = (
        <Grid item={true} className={classes.topMargin}>
          <CircularProgress />
        </Grid>
      );
    } else if (!walletTokens) {
      content = (
        <Grid item={true} className={classes.topMargin}>
          <Button onClick={this.scanWalletForTokens} variant="raised" color="primary">
            {translate('SCAN_TOKENS')}
          </Button>
        </Grid>
      );
    } else {
      const shownBalances = tokenBalances.filter(t => walletTokens.includes(t.symbol));

      content = (
        <Balances
          allTokens={tokens}
          tokenBalances={shownBalances}
          hasSavedWalletTokens={hasSavedWalletTokens}
          scanWalletForTokens={this.scanWalletForTokens}
          setWalletTokens={this.props.setWalletTokens}
          onAddCustomToken={this.props.addCustomToken}
          onRemoveCustomToken={this.props.removeCustomToken}
        />
      );
    }

    return (
      <Grid
        item={true}
        container={true}
        direction="column"
        className={classes.tokenBalanceGrid}
        spacing={8}
      >
        <Grid item={true}>
          <Typography variant="display1">{translate('SIDEBAR_TOKENBAL')}</Typography>
        </Grid>
        <Grid item={true}>{content}</Grid>
      </Grid>
    );
  }

  private scanWalletForTokens = () => {
    if (this.props.wallet) {
      this.props.scanWalletForTokens(this.props.wallet);
      this.setState({ hasScanned: true });
    }
  };
}

function mapStateToProps(state: AppState): StateProps {
  return {
    wallet: getWalletInst(state),
    walletConfig: getWalletConfig(state),
    tokens: getAllTokens(state),
    tokenBalances: getTokenBalances(state),
    tokensError: state.wallet.tokensError,
    isTokensLoading: state.wallet.isTokensLoading,
    hasSavedWalletTokens: state.wallet.hasSavedWalletTokens,
    isOffline: getOffline(state)
  };
}

export default withStyles(styles)(
  connect(mapStateToProps, {
    addCustomToken,
    removeCustomToken,
    scanWalletForTokens,
    setWalletTokens,
    refreshTokenBalances
  })(TokenBalances)
) as React.ComponentClass<{}>;
