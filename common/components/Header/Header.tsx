import {
  TChangeLanguage,
  TChangeNodeIntent,
  TChangeNodeIntentOneTime,
  TAddCustomNode,
  TRemoveCustomNode,
  TAddCustomNetwork,
  AddCustomNodeAction,
  changeLanguage,
  changeNodeIntent,
  changeNodeIntentOneTime,
  addCustomNode,
  removeCustomNode,
  addCustomNetwork
} from 'actions/config';
import React, { Component } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { TSetGasPriceField, setGasPriceField } from 'actions/transaction';
import { navigationLinks, NavigationLink } from 'config';
import CustomNodeModal from 'components/CustomNodeModal';
import { NodeConfig } from 'types/node';
import './index.scss';
import './components/Navigation.scss';
import { AppState } from 'reducers';
import {
  getOffline,
  isNodeChanging,
  getLanguageSelection,
  getNodeId,
  getNodeConfig,
  CustomNodeOption,
  NodeOption,
  getNodeOptions,
  getNetworkConfig,
  isStaticNodeId
} from 'selectors/config';
import { NetworkConfig } from 'types/network';
import { connect, MapStateToProps } from 'react-redux';
import translate from 'translations';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Typography from '@material-ui/core/Typography/Typography';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';

interface OwnProps {
  networkParam: string | null;
}

interface DispatchProps {
  changeLanguage: TChangeLanguage;
  changeNodeIntent: TChangeNodeIntent;
  changeNodeIntentOneTime: TChangeNodeIntentOneTime;
  setGasPriceField: TSetGasPriceField;
  addCustomNode: TAddCustomNode;
  removeCustomNode: TRemoveCustomNode;
  addCustomNetwork: TAddCustomNetwork;
}

interface StateProps {
  shouldSetNodeFromQS: boolean;
  network: NetworkConfig;
  languageSelection: AppState['config']['meta']['languageSelection'];
  node: NodeConfig;
  nodeSelection: AppState['config']['nodes']['selectedNode']['nodeId'];
  isChangingNode: AppState['config']['nodes']['selectedNode']['pending'];
  isOffline: AppState['config']['meta']['offline'];
  nodeOptions: (CustomNodeOption | NodeOption)[];
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (
  state,
  { networkParam }
): StateProps => ({
  shouldSetNodeFromQS: !!(networkParam && isStaticNodeId(state, networkParam)),
  isOffline: getOffline(state),
  isChangingNode: isNodeChanging(state),
  languageSelection: getLanguageSelection(state),
  nodeSelection: getNodeId(state),
  node: getNodeConfig(state),
  nodeOptions: getNodeOptions(state),
  network: getNetworkConfig(state)
});

const mapDispatchToProps: DispatchProps = {
  setGasPriceField,
  changeLanguage,
  changeNodeIntent,
  changeNodeIntentOneTime,
  addCustomNode,
  removeCustomNode,
  addCustomNetwork
};

interface State {
  isAddingCustomNode: boolean;
  activeTab: number;
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
      textAlign: 'center'
    },
    tabsGrid: {
      [theme.breakpoints.only('xs')]: {
        width: '100%'
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

type Props = OwnProps &
  StateProps &
  DispatchProps &
  RouteComponentProps<{}> &
  WithStyles<typeof styles>;

class Header extends Component<Props, State> {
  public state = {
    isAddingCustomNode: false,
    activeTab: 0
  };

  public componentWillMount() {
    const { location } = this.props;
    this.setState({
      activeTab: this.calculateActiveTab(location.pathname)
    });
  }

  public componentDidMount() {
    this.attemptSetNodeFromQueryParameter();
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        activeTab: this.calculateActiveTab(nextProps.location.pathname)
      });
    }
  }

  public render() {
    const { classes } = this.props;
    const { isAddingCustomNode, activeTab } = this.state;
    return (
      <React.Fragment>
        <AppBar
          position="static"
          className={classes.appBar}
          style={
            location.pathname !== '/' ? {} : { backgroundColor: 'transparent', boxShadow: 'none' }
          }
        >
          <Grid container={true} className={classes.headerGrid} alignItems="center">
            <Grid item={true} xs={12} sm={2} className={classes.logoGrid}>
              <Link to={'/'} className={classes.link} onClick={this.handleChange.bind(this, {}, 0)}>
                <Typography variant="headline" color="inherit" className={classes.logoText}>
                  MyCryptoCurve
                </Typography>
              </Link>
            </Grid>
            <Grid className={classes.grow} />
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
                <Tab style={{ display: 'none' }} />
                {navigationLinks.map((link: NavigationLink, index: number) => {
                  return (
                    <Tab
                      component={(props: any) => <Link to={link.to} {...props} />}
                      label={translate(link.name)}
                      key={index}
                      // onClick={(e: Event) => this.handleClick(e, link.to)}
                    />
                  );
                })}
              </Tabs>
            </Grid>
          </Grid>
        </AppBar>
        <CustomNodeModal
          isOpen={isAddingCustomNode}
          addCustomNode={this.addCustomNode}
          handleClose={this.closeCustomNodeModal}
        />
      </React.Fragment>
    );
  }

  private handleChange = ({}, value: number) => {
    this.setState({ activeTab: value });
  };

  private calculateActiveTab = (pathName: string) => {
    const splitPath = pathName.split('/');
    const initial =
      navigationLinks.findIndex(value => value.to.replace('/', '') === splitPath[1]) + 1;

    return initial === 1 && splitPath.length === 3 && splitPath[2] === 'view'
      ? initial + 2
      : initial;
  };

  private closeCustomNodeModal = () => {
    this.setState({ isAddingCustomNode: false });
  };

  private addCustomNode = (payload: AddCustomNodeAction['payload']) => {
    this.setState({ isAddingCustomNode: false });
    this.props.addCustomNode(payload);
  };

  private attemptSetNodeFromQueryParameter() {
    const { shouldSetNodeFromQS, networkParam } = this.props;
    if (shouldSetNodeFromQS) {
      this.props.changeNodeIntentOneTime(networkParam!);
    }
  }
}

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(Header)));
