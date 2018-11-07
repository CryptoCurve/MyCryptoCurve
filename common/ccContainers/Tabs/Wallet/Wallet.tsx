import * as Reactn from 'reactn';
import * as React from 'react';
import OpenWallet from './OpenWallet';
import OpenedWallet from './OpenedWallet';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import SubMenu from './components/SubMenu';
import { theme as mainTheme } from '../../../ccTheme/theme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

interface OwnProps {}

const styles = (theme: Theme) =>
  createStyles({
    walletGridContainer: {
      // margin: theme.spacing.unit * 4
    },
    walletGridSubMenu: {
      backgroundColor: 'salmon',
      padding: theme.spacing.unit * 2
    }
  });

type Props = OwnProps & WithStyles<typeof styles>;

class Wallet extends Reactn.Component<Props> {
  public componentDidMount() {
    // this.global.setWallet("test");
  }

  public render() {
    const { classes } = this.props;
    // const {wallet} = this.global;
    console.log(this.global);
    return (
      <React.Fragment>
        <MuiThemeProvider theme={mainTheme}>
          {false && <OpenWallet />}
          <Grid container className={classes.walletGridContainer}>
            <Grid item xs={8} style={{ backgroundColor: 'green' }}>
              Item 1
            </Grid>
            <Grid item xs={4} className={classes.walletGridSubMenu}>
              <SubMenu />
            </Grid>
          </Grid>
          <OpenedWallet />
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

// @ts-ignore
export default withStyles(styles)(Wallet as unknown) as React.ComponentClass<OwnProps>;
