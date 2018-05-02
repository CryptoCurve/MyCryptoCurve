import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import TabSection from 'containers/TabSection';
import { AppState } from 'reducers';
import { isValidETHAddress, isValidWANAddress } from 'libs/validators';
import './index.scss';
import { Input, Identicon } from 'components/ui';
import translate, { translateRaw } from 'translations';

interface State {
  wanchainAddress: string;
  ethereumAddress: string;
  email: string;
}

type Props = StateProps & RouteComponentProps<{}>;

class Whitelist extends React.Component<Props, State> {
  public state: State = {
    wanchainAddress: '',
    ethereumAddress: '',
    email: ''
  };

  public render() {
    const { ethereumAddress, wanchainAddress, email } = this.state;
    const isEmailValid = true; //isValidETHAddress(ethereumAddress);
    const isETHValid = isValidETHAddress(ethereumAddress);
    const isWANValid = isValidWANAddress(wanchainAddress);
    return (
      <TabSection>
        <div className="ViewOnly">
          <div style={{ paddingTop: '0px', paddingBottom: '20px' }}>
            <h1>{translate('Whitelist')}</h1>
          </div>
          <form className="form-group" onSubmit={this.openWallet}>
            <Input
              className={`ViewOnly-input ${isEmailValid ? 'is-valid' : 'is-invalid'}`}
              value={email}
              onChange={this.changeEmail}
              style={{ marginBottom: '30px' }}
              placeholder={translateRaw('Enter your email address')}
            />
            <Input
              className={`ViewOnly-input ${isETHValid ? 'is-valid' : 'is-invalid'}`}
              value={ethereumAddress}
              onChange={this.changeEthAddress}
              style={{ marginBottom: '30px' }}
              placeholder={translateRaw('Enter an Ethereum address (e.g. 0x4bbeEB66eD09...)')}
            />
            <Input
              className={`ViewOnly-input ${isWANValid ? 'is-valid' : 'is-invalid'}`}
              value={wanchainAddress}
              onChange={this.changeWanchainAddress}
              style={{ marginBottom: '60px' }}
              placeholder={translateRaw('Enter a Wanchain address (e.g. 0x3BBee351De99...)')}
            />
            <button
              style={{ marginBottom: '80px' }}
              className="ViewOnly-submit btn btn-primary btn-block"
              disabled={!(isETHValid && isWANValid && isEmailValid)}
            >
              {translate('Whitelist')}
            </button>
          </form>
        </div>
      </TabSection>
    );
  }

  private changeEmail = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ email: ev.currentTarget.value });
  };
  private changeEthAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ ethereumAddress: ev.currentTarget.value });
  };
  private changeWanchainAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ wanchainAddress: ev.currentTarget.value });
  };
}

export default connect((state: AppState): StateProps => ({}))(Whitelist);
