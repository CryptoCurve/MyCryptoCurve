import * as Reactn from 'reactn';
import * as React from 'react';
import Template from '../../../containers/Tabs/GenerateWallet/components/Template';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { theme as mainTheme } from '../../../ccTheme/theme';

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

class OpenedWallet extends Reactn.Component<Props, State> {
  public state = {};

  public render() {
    console.log('Render OpenedWallet');
    const { classes } = this.props;
    return (
      <React.Fragment>
        <MuiThemeProvider theme={mainTheme}>
          <Template version={2} hideButton={true}>
            <Grid container className={classes.walletGridContainer}>
              <Grid item xs={8} style={{ backgroundColor: 'green' }}>
                Item 1
              </Grid>
              <Grid item xs={4} className={classes.walletGridSubMenu}>
                <div>Change Wallet Button</div>
                <Typography variant="title">Token Balances</Typography>
                <div>Scan for Tokens Button</div>
                <Typography variant="title">
                  Account Address<Typography variant="caption">
                    Check copy: Wallet Address?
                  </Typography>
                </Typography>
                <div>Address text</div>
                <Typography variant="title">Account Balance</Typography>
                <div>Balance</div>
              </Grid>
            </Grid>
          </Template>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

// @ts-ignore
export default (withStyles(styles)(OpenedWallet) as unknown) as React.ComponentClass<OwnProps>;
