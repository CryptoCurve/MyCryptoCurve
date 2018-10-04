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

type Props = StateProps & RouteComponentProps<{}>;

class SendTransaction extends React.Component<Props> {
  public render() {
    const { wallet, match, location, history } = this.props;
    const currentPath = match.url;
    const tabs: Tab[] = [
      {
        path: 'send',
        name: 'Send',
        disabled: !!wallet && !!wallet.isReadOnly
      }
    ];
    console.log(this.props);
    return (
      <React.Fragment>
        <UnlockHeader showGenerateLink={true} />
        {wallet && (
          <div className="SubTabs row">
            <div className="col-sm-8">
              <SubTabs tabs={tabs} match={match} location={location} history={history} />
            </div>
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
            <SideBar />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default connect((state: AppState) => ({
  wallet: getWalletInst(state),
  requestDisabled: !isNetworkUnit(state, 'ETH')
}))(SendTransaction);
