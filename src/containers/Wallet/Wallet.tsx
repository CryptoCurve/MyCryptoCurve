import * as React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button/Button';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import { customStyles } from '../../theme/theme';
import { WithWalletContext, withWalletContext } from '../../context/WalletContext';
import { ArrowForwardIcon } from '../../theme/icons';
import OpenWallet from './OpenWallet';
import SubMenu from './components/SubMenu';
import { helperRenderConsoleText } from '../../helpers/helpers';
import SendTransaction from './components/SendTransaction';
import Slide from '@material-ui/core/Slide/Slide';

interface OwnProps {
}

const styles = (theme: Theme) =>
  createStyles({
    ...customStyles,
    walletGridContainer: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6
    },
    walletGridSubMenu: {
      overflowWrap: 'break-word',
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

interface Props extends OwnProps, WithStyles<typeof styles>, WithWalletContext {
}

class Wallet extends React.Component<Props, State> {
  public state = {
    openTab: 0
  };

  public render() {
    console.log(...helperRenderConsoleText('Render Wallet', 'lightGreen'));
    const { classes, walletContext } = this.props;
    const { openTab } = this.state;
    const { wallet, setWallet } = walletContext;
    return (
      <React.Fragment>
        {!wallet.privateKey && <OpenWallet/>}
        {wallet.privateKey && (
          <Slide in={!!wallet.privateKey} direction="left">
            <React.Fragment>
              <Grid container className={classes.walletGridContainer}>
                <Grid xs={8} item/>
                <Grid item xs={4} className={classes.subNavBar}>
                  <Button variant="contained" className={classes.darkButton} onClick={setWallet(null)}>
                    Change Wallet <ArrowForwardIcon className={classes.buttonEndIconSpacing}/>
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
                      <Tab label="Send"/>
                      <Tab label="Tab Placeholder" disabled/>
                      <Tab label="Tab Placeholder" disabled/>
                    </Tabs>
                  </Grid>
                  <Grid container className={classes.tabContent} item>
                    <SendTransaction/>
                  </Grid>
                </Grid>
                <Grid item xs={4} className={classes.walletGridSubMenu}>
                  <SubMenu/>
                </Grid>
              </Grid>
            </React.Fragment>
          </Slide>
        )}
      </React.Fragment>
    );
  }

  private handleTabChange = ({}, value: number) => {
    console.log(value);
  };
}

export default withStyles(styles)(withWalletContext(Wallet)) as React.ComponentClass<OwnProps>;
