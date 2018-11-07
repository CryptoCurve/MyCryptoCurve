import * as Reactn from 'reactn';
import * as React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';

interface OwnProps {}

interface State {}

const styles = (theme: Theme) =>
  createStyles({
    walletGridContainer: {
      backgroundColor: 'light-blue',
      margin: theme.spacing.unit * 4
    },
    walletGridSubMenu: {}
  });

type Props = OwnProps & WithStyles<typeof styles>;

class SubMenu extends Reactn.Component<Props, State> {
  public state = {};

  public render() {
    console.log('Render SubMenu');
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div>Change Wallet Button</div>
        <Typography variant="title">Token Balances</Typography>
        <div>Scan for Tokens Button</div>
        <Typography variant="title">
          Account Address<Typography variant="caption">Check copy: Wallet Address?</Typography>
        </Typography>
        <div>Address text</div>
        <Typography variant="title">Account Balance</Typography>
        <div>Balance</div>
      </React.Fragment>
    );
  }
}

// @ts-ignore
export default (withStyles(styles)(SubMenu) as unknown) as React.ComponentClass<OwnProps>;
