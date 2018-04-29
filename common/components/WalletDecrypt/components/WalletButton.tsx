import React from 'react';
import classnames from 'classnames';
import { NewTabLink, Tooltip } from 'components/ui';
import './WalletButton.scss';

import { WalletName } from 'config';
import { translateRaw } from 'translations';

interface OwnProps {
  name: string;
  description?: string;
  example?: string;
  icon?: string;
  helpLink: string;
  walletType: WalletName;
  isSecure?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  disableReason?: string;
  onClick(walletType: string): void;
}

interface StateProps {
  isFormatDisabled?: boolean;
}

interface Icon {
  icon: string;
  tooltip: string;
  href?: string;
  arialabel: string;
}

type Props = OwnProps & StateProps;

export class WalletButton extends React.PureComponent<Props> {
  public render() {
    const {
      name,
      description,
      example,
      icon,
      helpLink,
      isSecure,
      isReadOnly,
      isDisabled,
      disableReason
    } = this.props;

    const icons: Icon[] = [];
    if (isReadOnly) {
      icons.push({
        icon: 'eye',
        tooltip: translateRaw('TOOLTIP_READ_ONLY_WALLET'),
        arialabel: 'Read Only'
      });
    } else {
      if (isSecure) {
        icons.push({
          icon: 'shield',
          tooltip: translateRaw('TOOLTIP_SECURE_WALLET_TYPE'),
          arialabel: 'Secure wallet type'
        });
      } else {
        icons.push({
          icon: 'exclamation-triangle',
          tooltip: translateRaw('TOOLTIP_INSECURE_WALLET_TYPE'),
          arialabel: 'Insecure wallet type'
        });
      }
    }
    if (helpLink) {
      icons.push({
        icon: 'question-circle',
        tooltip: translateRaw('TOOLTIP_MORE_INFO'),
        href: helpLink,
        arialabel: 'More info'
      });
    }

    return (
      <div className="WalletType col-md-6">
        <div
          className="WalletType-select"
          onClick={this.handleClick}
          tabIndex={isDisabled ? -1 : 0}
          aria-disabled={isDisabled}
        >
          <a className="WalletType-select-btn btn btn-primary btn-block">
            <span>{name}</span>
          </a>
        </div>
      </div>
    );
  }

  private handleClick = () => {
    if (this.props.isDisabled || this.props.isFormatDisabled) {
      return;
    }

    this.props.onClick(this.props.walletType);
  };

  private stopPropogation = (ev: React.FormEvent<HTMLAnchorElement | HTMLSpanElement>) => {
    ev.stopPropagation();
  };
}
