import React from 'react';
import { connect } from 'react-redux';
import { UnlockHeader } from 'components/ui';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import { RouteComponentProps, Route, Switch, Redirect } from 'react-router';
import { RedirectWithQuery } from 'components/RedirectWithQuery';
import {
  WalletInfo,
  RequestPayment,
  RecentTransactions,
  Fields,
  UnavailableWallets,
  SideBar,
  Sets
} from './components';
import SubTabs from 'components/SubTabs';
import { RouteNotFound } from 'components/RouteNotFound';
import { isNetworkUnit } from 'selectors/config/wallet';
import { resetWallet } from '../../../actions/wallet';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import { translateRaw } from '../../../translations';
import ArrowRightIcon from '@material-ui/icons/ArrowRightAlt';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import { OwnProps } from '../../../components/ConfirmationModalTemplate';
import { Colors } from '../../../Root';
import { TabType } from '../../../components/SubTabs/SubTabs';
import Wallet from '../../../ccContainers/Tabs/Wallet/Wallet';

const Send = () => (
  <React.Fragment>
    <Fields />
    <UnavailableWallets />
  </React.Fragment>
);

interface StateProps {
  wallet: AppState['wallet']['inst'];
  requestDisabled: boolean;
}

interface DispatchProps {
  dispatchResetWallet: typeof resetWallet;
}

const styles = (theme: Theme) =>
  createStyles({
    sideBarGrid: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    },
    walletGrid: {
      marginTop: theme.spacing.unit * 12,
      marginBottom: theme.spacing.unit * 4
    },
    buttonIcon: {
      marginLeft: theme.spacing.unit
    },
    changeWalletButton: {
      backgroundColor: Colors.dark,
      color: Colors.white,
      '&:hover': {
        backgroundColor: Colors.darkHover
      },
      minWidth: 232,
      width: 232
    },
    topMargin: {
      marginTop: theme.spacing.unit
    }
  });

type Props = StateProps & DispatchProps & RouteComponentProps<{}> & WithStyles<typeof styles>;

class SendTransaction extends React.Component<Props> {
  public render() {
    const { wallet, match, location, history, dispatchResetWallet, classes } = this.props;
    console.log('WALLET', wallet);

    const currentPath = match.url;
    const tabs: TabType[] = [
      {
        path: 'send',
        name: 'Send',
        disabled: !!wallet && !!wallet.isReadOnly
      }
    ];
    return (
      <React.Fragment>
        <Wallet />
        {false && !wallet && <UnlockHeader showGenerateLink={true} />}
        {wallet && (
          <React.Fragment>
            <Grid container={true} className={classes.walletGrid}>
              <Grid item={true} md={6}>
                <SubTabs tabs={tabs} match={match} location={location} history={history} />
              </Grid>
              <Grid item={true} md={2} />
              <Grid item={true} md={4} className={classes.sideBarGrid}>
                <Button onClick={dispatchResetWallet} className={classes.changeWalletButton}>
                  {translateRaw('CHANGE_WALLET')}
                  <ArrowRightIcon className={classes.buttonIcon} />
                </Button>
              </Grid>
              <Grid item={true} md={6} className={classes.topMargin}>
                <Switch>
                  <Route
                    exact={true}
                    path={currentPath}
                    render={() => (
                      <RedirectWithQuery
                        from={`${currentPath}`}
                        to={`${
                          wallet !== null && wallet !== undefined && wallet.isReadOnly
                            ? `${currentPath}/info`
                            : `${currentPath}/send`
                        }`}
                      />
                    )}
                  />
                  <Route
                    exact={true}
                    path={`${currentPath}/send`}
                    render={() => {
                      return wallet !== null && wallet !== undefined && wallet.isReadOnly ? (
                        <Redirect to={`${currentPath}/info`} />
                      ) : (
                        <Send />
                      );
                    }}
                  />
                  <Route
                    path={`${currentPath}/info`}
                    exact={true}
                    render={() => <WalletInfo wallet={wallet} />}
                  />
                  <Route
                    path={`${currentPath}/sets`}
                    exact={true}
                    render={() => <Sets wallet={wallet} />}
                  />
                  <Route
                    path={`${currentPath}/request`}
                    exact={true}
                    render={() => <RequestPayment wallet={wallet} />}
                  />
                  <Route
                    path={`${currentPath}/recent-txs`}
                    exact={true}
                    render={() => <RecentTransactions wallet={wallet} />}
                  />
                  <RouteNotFound />
                </Switch>
              </Grid>
              <Grid item={true} md={2} />
              <Grid item={true} md={4} className={classes.sideBarGrid}>
                <SideBar />
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default (withStyles(styles)(
  connect(
    (state: AppState) => ({
      wallet: getWalletInst(state),
      requestDisabled: !isNetworkUnit(state, 'ETH')
    }),
    {
      dispatchResetWallet: resetWallet
    }
  )(SendTransaction)
) as unknown) as React.ComponentClass<OwnProps>;
