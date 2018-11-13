import React from 'react';
import translate from 'translations';
import { TokenBalance } from 'selectors/wallet';
import AddCustomTokenForm from './AddCustomTokenForm';
import TokenRow from './TokenRow';
import { Token } from 'types/network';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';
import { Colors } from '../../../Root';
import Typography from '@material-ui/core/Typography/Typography';

interface Props {
  allTokens: Token[];
  tokenBalances: TokenBalance[];
  hasSavedWalletTokens: boolean;

  scanWalletForTokens(): any;

  setWalletTokens(tokens: string[]): any;

  onAddCustomToken(token: Token): any;

  onRemoveCustomToken(symbol: string): any;
}

interface TrackedTokens {
  [symbol: string]: boolean;
}

interface State {
  trackedTokens: { [symbol: string]: boolean };
  showCustomTokenForm: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    darkButtons: {
      backgroundColor: Colors.dark,
      color: Colors.white,
      '&:hover': {
        backgroundColor: Colors.darkHover
      }
    },
    topMargin: {
      marginTop: theme.spacing.unit
    },
    narrowButton: {
      minWidth: '100%'
    }
  });

export default withStyles(styles)(
  class TokenBalances extends React.PureComponent<Props & WithStyles<typeof styles>, State> {
    public state: State = {
      trackedTokens: {},
      showCustomTokenForm: false
    };

    public componentWillReceiveProps(nextProps: Props) {
      if (nextProps.tokenBalances !== this.props.tokenBalances) {
        const trackedTokens = nextProps.tokenBalances.reduce<TrackedTokens>((prev, t) => {
          prev[t.symbol] = !t.balance.isZero();
          return prev;
        }, {});
        this.setState({ trackedTokens });
      }
    }

    public render() {
      const { allTokens, tokenBalances, hasSavedWalletTokens, classes } = this.props;
      const { showCustomTokenForm, trackedTokens } = this.state;

      let bottom;
      let help;
      if (tokenBalances.length && !hasSavedWalletTokens) {
        help = 'Select which tokens you would like to keep track of';
        bottom = (
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <Button
                size="medium"
                className={classes.darkButtons}
                onClick={this.handleSetWalletTokens}
              >
                {translate('X_SAVE')}
              </Button>
            </Grid>
            <Grid>
              <Typography variant="body2" className={classes.topMargin}>
                {translate('PROMPT_ADD_CUSTOM_TKN')}
              </Typography>
            </Grid>
          </Grid>
        );
      } else if (showCustomTokenForm) {
        bottom = (
          <Grid item={true}>
            <AddCustomTokenForm
              allTokens={allTokens}
              onSave={this.addCustomToken}
              toggleForm={this.toggleShowCustomTokenForm}
            />
          </Grid>
        );
      } else {
        bottom = (
          <Grid container={true} spacing={8} className={classes.topMargin}>
            <Grid item={true} xs={6}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.narrowButton}
                onClick={this.toggleShowCustomTokenForm}
              >
                {translate('SEND_CUSTOM')}
              </Button>
            </Grid>
            <Grid item={true} xs={6}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.narrowButton}
                onClick={this.props.scanWalletForTokens}
              >
                {translate('SCAN_TOKENS')}
              </Button>
            </Grid>
          </Grid>
        );
      }

      return (
        <div>
          {help && <p className="TokenBalances-help">{help}</p>}

          {tokenBalances.length ? (
            <table className="TokenBalances-rows">
              <tbody>
                {tokenBalances.map(
                  token =>
                    token ? (
                      <TokenRow
                        key={token.symbol}
                        balance={token.balance}
                        symbol={token.symbol}
                        custom={token.custom}
                        decimal={token.decimal}
                        tracked={trackedTokens[token.symbol]}
                        toggleTracked={!hasSavedWalletTokens && this.toggleTrack}
                        onRemove={this.props.onRemoveCustomToken}
                      />
                    ) : null
                )}
              </tbody>
            </table>
          ) : (
            <div className="well well-sm text-center">
              {translate('SCAN_TOKENS_FAIL_NO_TOKENS')}
            </div>
          )}
          {bottom}
        </div>
      );
    }

    private toggleTrack = (symbol: string) => {
      this.setState({
        trackedTokens: {
          ...this.state.trackedTokens,
          [symbol]: !this.state.trackedTokens[symbol]
        }
      });
    };

    private toggleShowCustomTokenForm = () => {
      this.setState({
        showCustomTokenForm: !this.state.showCustomTokenForm
      });
    };

    private addCustomToken = (token: Token) => {
      this.props.onAddCustomToken(token);
      this.setState({ showCustomTokenForm: false });
    };

    private handleSetWalletTokens = () => {
      const { trackedTokens } = this.state;
      const desiredTokens = Object.keys(trackedTokens).filter(t => trackedTokens[t]);
      this.props.setWalletTokens(desiredTokens);
    };
  }
);
