import React from 'react';
import translate, { translateRaw } from 'translations';
import { IWallet } from 'libs/wallet';
import { print } from 'components/PrintableWallet';
import { QRCode } from 'components/ui';
import { GenerateKeystoreModal, TogglablePassword, AddressField } from 'components';
import './Sets.scss';
import { Link } from 'react-router-dom';

const sdk = require('cryptocurve-sdk');

interface Props {
  wallet: IWallet;
}

interface State {
  address: string;
  privateKey: string;
  isPrivateKeyVisible: boolean;
  isKeystoreModalOpen: boolean;
}

export enum CoinType {
  Scaling = 'scaling',
  SupplyChain = 'supplychain',
  Top5 = 'top5'
}

export default class Sets extends React.PureComponent<Props, State> {
  public state = {
    address: '',
    privateKey: '',
    isPrivateKeyVisible: false,
    isKeystoreModalOpen: false
  };

  public componentDidMount() {
    this.setStateFromWallet(this.props.wallet);
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.wallet !== nextProps.wallet) {
      this.setStateFromWallet(nextProps.wallet);
    }
  }

  public render() {
    const { address, privateKey, isPrivateKeyVisible, isKeystoreModalOpen } = this.state;
    const typeInfo = {
      [CoinType.Scaling]: {
        name: 'Scaling Set',
        buy: 'Buy',
        bullets: ['OmiseGO (OMG)', 'Zilliqa (ZIL)', 'Loom Network (LOOM)'],
        address: '0xScalingSetContract'
      },
      [CoinType.Top5]: {
        name: 'Top 3 Set',
        buy: 'Buy',
        bullets: ['EOS (EOS)', 'TRON (TRX)', 'VeChain (VEN)'],
        address: '0xTop3SetContract'
      },
      [CoinType.SupplyChain]: {
        name: 'SupplyChain Set',
        buy: 'Buy',
        bullets: ['VeChain (VEN)', 'WaltonChain (WTC)', 'Wabi (WABI)'],
        address: '0xSupplyChainContract'
      }
    };

    return (
      <div className="WalletInfo">
        <div className="Tab-content-pane">
          <div className="WalletTypes-types row">
            {Object.keys(typeInfo).map((type: keyof typeof typeInfo) => (
              <div key={type} className="WalletType col-md-5">
                <h2 className="WalletType-title">{translate(typeInfo[type].name)}</h2>
                <ul className="WalletType-features">
                  {typeInfo[type].bullets.map(bullet => (
                    <li key={bullet} className="WalletType-features-feature">
                      {translate(bullet)}
                    </li>
                  ))}
                </ul>
                <div className="WalletType-select">
                  <Link
                    className="WalletType-select-btn btn btn-primary btn-block"
                    to={`/account/send/?to=${typeInfo[type].address}`}
                  >
                    {translate('GENERATE_THING', { $thing: translateRaw(typeInfo[type].buy) })}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  private setStateFromWallet(wallet: IWallet) {
    const address = sdk.utils.eth.toChecksumAddress(wallet.getAddressString());
    const privateKey = wallet.getPrivateKeyString ? wallet.getPrivateKeyString() : '';
    this.setState({ address, privateKey });
  }

  private togglePrivateKey = () => {
    this.setState({ isPrivateKeyVisible: !this.state.isPrivateKeyVisible });
  };

  private toggleKeystoreModal = () => {
    this.setState({ isKeystoreModalOpen: !this.state.isKeystoreModalOpen });
  };
}
