import * as React from 'react';
import { Theme } from '@material-ui/core';
import { Routes, withRouteContext, WithRouteContext } from '../context/RouteContext';
import { helperRenderConsoleText } from '../helpers/helpers';
import { RouteContextInterface } from '../context/RouteContext';
import createStyles from '@material-ui/core/es/styles/createStyles';
import { WithStyles, Menu } from '@material-ui/core/es';
import AppBar from '@material-ui/core/es/AppBar/AppBar';
import Grid from '@material-ui/core/es/Grid/Grid';
import Typography from '@material-ui/core/es/Typography/Typography';
import ButtonBase from '@material-ui/core/es/ButtonBase/ButtonBase';
import Tabs from '@material-ui/core/es/Tabs/Tabs';
import Tab from '@material-ui/core/es/Tab/Tab';
import withStyles from '@material-ui/core/es/styles/withStyles';
import { ArrowDropDownIcon } from 'src/theme/icons';
import MenuItem from '@material-ui/core/es/MenuItem/MenuItem';
import { Chain, WithWalletContext, withWalletContext } from '../context/WalletContext';
import { chainList } from '../config';

interface OwnProps {
}

const tabRoutes: Routes[] = ['', 'wallet'];

interface State {
  activeTab: number;
  anchorEl: {} | null,

}

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      transition: 'background-color 0.5s ease'
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    },
    headerGrid: {
      minHeight: 153,
      [theme.breakpoints.up('sm')]: {
        paddingRight: theme.spacing.unit * 2
      },
      [theme.breakpoints.up('md')]: {
        paddingRight: theme.spacing.unit * 10
      }
    },
    logoGrid: {
      paddingLeft: theme.spacing.unit * 10,
      paddingRight: theme.spacing.unit * 10,
      textAlign: 'center',
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
      }
    },
    tabsGrid: {
      [theme.breakpoints.only('xs')]: {
        width: '100%'
      }
    },
    chainDropDown: {
      paddingLeft: theme.spacing.unit * 2,
      [theme.breakpoints.only('xs')]: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }
    },
    button: {
      // width: 200
    },
    indicator: {
      backgroundColor: '#ffffff'
    },
    grow: {
      flexGrow: 1
    },
    logoText: {
      fontSize: 26,
      marginBottom: 3,
      letterSpacing: 4.6
    },
    logoButton: {
      paddingLeft: theme.spacing.unit / 2,
      paddingTop: theme.spacing.unit / 2
    },
    link: {
      color: '#ffffff',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.1)',
        color: '#ffffff'
      },
      '&:focus': {
        color: '#ffffff'
      }
    }
  });

type Props = OwnProps & WithStyles<typeof styles> & WithRouteContext & WithWalletContext;

class Header extends React.Component<Props, State> {
  public state = {
    activeTab: 0,
    anchorEl: null
  };

  public componentWillUpdate(nextProps: Readonly<Props>): void {
    const { routeContext } = nextProps;
    this.checkActiveTab(routeContext);
  }

  public componentWillMount(): void {
    const { routeContext } = this.props;
    this.checkActiveTab(routeContext);
  }

  public render() {
    console.log(...helperRenderConsoleText('Render Header', 'lightGreen'));
    const { classes, routeContext: {location,navigateTo},walletContext:{currentChain} } = this.props;
    const { activeTab, anchorEl } = this.state;
    return (
      <React.Fragment>
        <AppBar
          position="static"
          className={classes.appBar}
          style={
            location !== '' ? {} : { backgroundColor: 'transparent', boxShadow: 'none' }
          }
        >
          <Grid container={true} className={classes.headerGrid} alignItems="center">
            <Grid item={true} xs={12} sm={2} className={classes.logoGrid}>
              <ButtonBase className={classes.logoButton} onClick={navigateTo('')}>
                <Typography
                  variant="h3"
                  color="inherit"
                  className={classes.logoText}
                  align="center"
                >
                  MyCryptoCurve
                </Typography>
              </ButtonBase>
            </Grid>
            <Grid className={classes.grow}/>
            <Grid item={true} className={classes.tabsGrid}>
              <Tabs
                value={activeTab}
                onChange={this.handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                fullWidth={true}
                classes={{
                  indicator: classes.indicator
                }}
              >
                <Tab style={{ display: 'none' }}/>
                <Tab label="Open Wallet"/>
                <Tab label="New Wallet" disabled/>
              </Tabs>
            </Grid>
            <Grid item={true} className={classes.chainDropDown}>
              <ButtonBase
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenuClick}
              >
                <Typography variant="h5" color="inherit">{currentChain.name}</Typography>
                <ArrowDropDownIcon/>
              </ButtonBase>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
              >
                {chainList.map(chain =>
                  <MenuItem key={chain.name} onClick={this.handleMenuClose(chain)}>{chain.name}</MenuItem>
                )}
              </Menu>
            </Grid>
          </Grid>
        </AppBar>
      </React.Fragment>
    );
  }

  private handleMenuClick = (e: React.MouseEvent<{}>) => {
    this.setState({ anchorEl: e.currentTarget });
  };

  private handleMenuClose = (chain: Chain) => () => {
    const {walletContext:{setCurrentChain}} =this.props;
    setCurrentChain(chain);
    this.setState({ anchorEl: null });
  };

  private checkActiveTab = (routeContext: RouteContextInterface) => {
    const { location } = routeContext;
    const { activeTab } = this.state;
    if (tabRoutes.indexOf(location) !== activeTab) {
      this.setState({ activeTab: tabRoutes.indexOf(location) });
    }
  };

  private handleChange = ({}, value: number) => {
    const { routeContext } = this.props;
    const { location, navigateTo } = routeContext;
    if (value !== tabRoutes.indexOf(location)) {
      navigateTo(tabRoutes[value])();
    }
    this.setState({ activeTab: value });
  };
}

export default withStyles(styles)(withRouteContext(withWalletContext(Header))) as React.ComponentClass<OwnProps>;
