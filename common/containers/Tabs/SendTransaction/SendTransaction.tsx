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
import SubTabs, { Tab } from 'components/SubTabs';
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
import Typography from '@material-ui/core/Typography/Typography';

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
      marginTop: theme.spacing.unit * 12
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
    }
  });

type Props = StateProps & DispatchProps & RouteComponentProps<{}> & WithStyles<typeof styles>;

class SendTransaction extends React.Component<Props> {
  public render() {
    const { wallet, match, location, history, dispatchResetWallet, classes } = this.props;
    const currentPath = match.url;
    const tabs: Tab[] = [
      {
        path: 'send',
        name: 'Send',
        disabled: !!wallet && !!wallet.isReadOnly
      }
    ];
    return (
      <React.Fragment>
        {!wallet && <UnlockHeader showGenerateLink={true} />}
        {wallet && (
          <React.Fragment>
            <Grid container={true} className={classes.walletGrid}>
              <Grid item={true} md={8}>
                <SubTabs tabs={tabs} match={match} location={location} history={history} />
              </Grid>
              <Grid item={true} md={4} className={classes.sideBarGrid}>
                <Button onClick={dispatchResetWallet} className={classes.changeWalletButton}>
                  {translateRaw('CHANGE_WALLET')}
                  <ArrowRightIcon className={classes.buttonIcon} />
                </Button>
              </Grid>
              <Grid item={true} md={8} />
              <Grid item={true} md={4} className={classes.sideBarGrid}>
                <SideBar />
              </Grid>
            </Grid>
            <div className="SubTabs row">
              <div className="col-sm-8" />
              <div className="col-sm-8">
                <Switch>
                  <Route
                    exact={true}
                    path={currentPath}
                    render={() => (
                      <RedirectWithQuery
                        from={`${currentPath}`}
                        to={`${wallet.isReadOnly ? `${currentPath}/info` : `${currentPath}/send`}`}
                      />
                    )}
                  />
                  <Route
                    exact={true}
                    path={`${currentPath}/send`}
                    render={() => {
                      return wallet.isReadOnly ? <Redirect to={`${currentPath}/info`} /> : <Send />;
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
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(
  connect(
    (state: AppState) => ({
      wallet: getWalletInst(state),
      requestDisabled: !isNetworkUnit(state, 'ETH')
    }),
    {
      dispatchResetWallet: resetWallet
    }
  )(SendTransaction)
) as React.ComponentClass<OwnProps>;
