import * as Reactn from 'reactn';
import * as React from 'react';
import OpenWallet from './OpenWallet';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import SubMenu from './components/SubMenu';
import { customStyles, theme as mainTheme } from '../../../ccTheme/theme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { IconArrowForward } from '../../../ccTheme/icons';
import Button from '@material-ui/core/Button/Button';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import SendTransaction from './components/SendTransaction';

interface OwnProps {}

const styles = (theme: Theme) =>
  createStyles({
    walletGridContainer: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6
    },
    walletGridSubMenu: {
      padding: theme.spacing.unit * 2
    },
    subNavBar: {
      padding: theme.spacing.unit * 2
    },
    darkButton: {
      ...customStyles.darkButton,
      minWidth: 200
    },
    tabContent: {
      padding: theme.spacing.unit * 2,
      flex: 1
    }
  });

interface State {
  openTab: number;
}

type Props = OwnProps & WithStyles<typeof styles>;

class Wallet extends Reactn.Component<Props, State> {
  public state = {
    openTab: 0
  };

  public componentDidMount() {
    // this.global.setWallet("test");
  }

  public render() {
    const { classes } = this.props;
    const { openTab } = this.state;
    const { wallet, unsetWallet } = this.global;
    // const {wallet} = this.global;
    console.log(this.global);
    console.log(wallet);
    return (
      <React.Fragment>
        <MuiThemeProvider theme={mainTheme}>
          {!wallet._privKey && <OpenWallet />}
          {wallet._privKey && (
            <Grid container className={classes.walletGridContainer}>
              <Grid xs={8} item />
              <Grid item xs={4} className={classes.subNavBar}>
                <Button variant="contained" className={classes.darkButton} onClick={unsetWallet}>
                  Change Wallet <IconArrowForward className={classes.buttonEndIconSpacing} />
                </Button>
              </Grid>
              <Grid item container xs={8} direction="column">
                <Grid item>
                  <Tabs
                    value={openTab}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    fullWidth
                  >
                    <Tab label="Send" />
                    <Tab label="Tab Placeholder" />
                    <Tab label="Tab Placeholder" />
                  </Tabs>
                </Grid>
                <Grid container className={classes.tabContent} item>
                  <SendTransaction />
                </Grid>
              </Grid>
              <Grid item xs={4} className={classes.walletGridSubMenu}>
                <SubMenu />
              </Grid>
            </Grid>
          )}
        </MuiThemeProvider>
      </React.Fragment>
    );
  }

  private handleTabChange = ({}, value: number) => {
    console.log(value);
  };
}

// @ts-ignore
export default withStyles(styles)(Wallet) as React.ComponentClass<OwnProps>;
