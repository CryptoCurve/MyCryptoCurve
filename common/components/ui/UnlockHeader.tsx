import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import translate from 'translations';
import WalletDecrypt, { DisabledWallets } from 'components/WalletDecrypt';
import { IWallet } from 'libs/wallet/IWallet';
import closeIcon from 'assets/images/close.svg';
import './UnlockHeader.scss';
import { RouteComponentProps, withRouter } from 'react-router';

interface Props {
  title?: string;
  wallet: IWallet;
  disabledWallets?: DisabledWallets;
  showGenerateLink?: boolean;
}

interface State {
  isExpanded: boolean;
}

export class UnlockHeader extends React.Component<Props & RouteComponentProps<{}>, State> {
  public state = {
    isExpanded: !this.props.wallet
  };

  public componentDidUpdate(prevProps: Props) {
    if (this.props.wallet !== prevProps.wallet) {
      this.setState({ isExpanded: !this.props.wallet });
    }
  }

  public render() {
    const { title, wallet, disabledWallets, showGenerateLink, match } = this.props;
    const { isExpanded } = this.state;
    console.log(this.props);
    return (
      <React.Fragment>
        <WalletDecrypt
          hidden={!this.state.isExpanded}
          disabledWallets={disabledWallets}
          showGenerateLink={showGenerateLink}
        />
        {false && (
          <article className="UnlockHeader">
            {title && <h1 className="UnlockHeader-title">{title}</h1>}
            {wallet &&
              !isExpanded && (
                <button
                  className="UnlockHeader-open btn btn-default btn-smr"
                  onClick={this.toggleisExpanded}
                >
                  <span>
                    <span className="hidden-xs UnlockHeader-open-text">
                      {translate('CHANGE_WALLET')}
                    </span>
                    <i className="fa fa-refresh" />
                  </span>
                </button>
              )}
            {wallet &&
              isExpanded && (
                <button className="UnlockHeader-close" onClick={this.toggleisExpanded}>
                  <img src={closeIcon} alt="close" />
                </button>
              )}
            <WalletDecrypt
              hidden={!this.state.isExpanded}
              disabledWallets={disabledWallets}
              showGenerateLink={showGenerateLink}
            />
          </article>
        )}
      </React.Fragment>
    );
  }

  public toggleisExpanded = (_: React.FormEvent<HTMLButtonElement>) => {
    this.setState(state => {
      return { isExpanded: !state.isExpanded };
    });
  };
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst
  };
}

export default withRouter(connect(mapStateToProps)(UnlockHeader));
