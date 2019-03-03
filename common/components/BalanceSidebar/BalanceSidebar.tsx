import React from 'react';
import AccountInfo from './AccountInfo';
import Promos from './Promos';
import TokenBalances from './TokenBalances';
import { AppState } from 'reducers';
import { getWalletInst } from 'selectors/wallet';
import { connect } from 'react-redux';
import EquivalentValues from './EquivalentValues';
import { QRCode } from 'components/ui';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';

interface Block {
  name: string;
  content: React.ReactElement<any>;
  isFullWidth?: boolean;
}

interface StateProps {
  wallet: AppState['wallet']['inst'];
}

const styles = (theme: Theme) => createStyles({});

type Props = StateProps & WithStyles<typeof styles>;
export class BalanceSidebar extends React.Component<Props> {
  public render() {
    const { wallet } = this.props;

    if (!wallet) {
      return null;
    }

    const blocks: Block[] = [
      {
        name: 'Token Balances',
        content: <TokenBalances />
      },
      {
        name: 'Account Info',
        content: <AccountInfo wallet={wallet} />
      }
    ];

    return (
      <React.Fragment>
        {blocks.map(block => <React.Fragment key={block.name}>{block.content}</React.Fragment>)}
        {wallet.address ? (
          <div className="WalletInfo-qr well well-lg">
            <QRCode data={wallet.address} />
          </div>
        ) : (
          <div />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({ wallet: getWalletInst(state) });

export default withStyles(styles)(
  connect(mapStateToProps)(BalanceSidebar)
) as React.ComponentClass<{}>;
