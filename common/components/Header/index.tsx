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
import logo from 'assets/images/cryptocurve-logo-white2.png';
import { OldDropDown, ColorDropdown } from 'components/ui';
import React, { Component } from 'react';
import classnames from 'classnames';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { TSetGasPriceField, setGasPriceField } from 'actions/transaction';
import {
  ANNOUNCEMENT_MESSAGE,
  ANNOUNCEMENT_TYPE,
  languages,
  navigationLinks,
  NavigationLink
} from 'config';
import Navigation from './components/Navigation';
import Node from './components/Node';
import NavigationLink from 'components/NavigationLink';
import OnlineStatus from './components/OnlineStatus';
import CustomNodeModal from 'components/CustomNodeModal';
import { getKeyByValue } from 'utils/helpers';
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
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import Logo from '../MyCryptoCurve/Logo';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import Hidden from '@material-ui/core/Hidden/Hidden';
import Grow from '@material-ui/core/Grow/Grow';

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

const styles = {
  root: {
    flexGrow: 1
  },
  appBar: {
    transition: 'background-color 0.5s ease'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolbar: {
    minHeight: 153,
    paddingLeft: 109,
    paddingRight: 84
  },
  button: {
    // width: 200
  },
  indicator: {
    backgroundColor: '#ffffff'
  },
  grow: {
    flexGrow: 1
  }
};

interface StyleProps {
  classes: {
    root: string;
    appBar: string;
    menuButton: string;
    toolbar: string;
    button: string;
    indicator: string;
    grow: string;
  };
}

type Props = OwnProps & StateProps & DispatchProps & StyleProps & RouteComponentProps<{}>;

class Header extends Component<Props, State> {
  public state = {
    isAddingCustomNode: false,
    activeTab: 0
  };

  public componentWillMount() {
    const { location } = this.props;
    this.setState({
      activeTab:
        navigationLinks.findIndex(
          value => value.to.replace('/', '') === location.pathname.split('/')[1]
        ) + 1
    });
  }

  public componentDidMount() {
    this.attemptSetNodeFromQueryParameter();
  }

  public handleChange = ({}, value: number) => {
    this.setState({ activeTab: value });
  };
  public handleClick = ({}, to: string) => {
    const { history } = this.props;
    history.push(to);
  };

  public render() {
    const {
      languageSelection,
      node,
      nodeSelection,
      isChangingNode,
      isOffline,
      nodeOptions,
      network,
      classes,
      history
    } = this.props;
    const { isAddingCustomNode, activeTab } = this.state;
    const selectedLanguage = languageSelection;
    const LanguageDropDown = OldDropDown as new () => OldDropDown<typeof selectedLanguage>;
    const options = nodeOptions.map(n => {
      if (n.isCustom) {
        const { label, isCustom, id, ...rest } = n;
        return {
          ...rest,
          name: (
            <span>
              {label.network} - {label.nodeName}
              <small>(custom)</small>
            </span>
          ),
          onRemove: () => this.props.removeCustomNode({ id })
        };
      } else {
        const { label, isCustom, ...rest } = n;
        return {
          ...rest,
          name: (
            <span>
              {label.network}
              <small>({label.service})</small>
            </span>
          )
        };
      }
    });
    return (
      <React.Fragment>
        <div className={classes.root}>
          <AppBar
            position="static"
            className={classes.appBar}
            style={
              location.pathname !== '/' ? {} : { backgroundColor: 'transparent', boxShadow: 'none' }
            }
          >
            <Toolbar className={classes.toolbar}>
              <Logo />
              <div className={classes.grow} />
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
                      label={translate(link.name)}
                      key={index}
                      onClick={(e: Event) => this.handleClick(e, link.to)}
                    />
                  );
                })}
              </Tabs>
            </Toolbar>
          </AppBar>
        </div>
        {/*<div className="Header">*/}
        {/*<section className="Header-branding">*/}
        {/*<section className="Header-branding-inner container">*/}
        {/*<Link to="/" className="Header-branding-title" aria-label="Go to homepage">*/}
        {/*<img*/}
        {/*className="Header-branding-title-logo"*/}
        {/*src={logo}*/}
        {/*height="64px"*/}
        {/*width="245px"*/}
        {/*alt="CryptoCurve logo"*/}
        {/*/>*/}
        {/*</Link>*/}
        {/*<div className="Header-branding-right" />*/}
        {/*</section>*/}
        {/*</section>*/}
        {/*<Navigation color={!network.isCustom && network.color} />*/}
        {/*</div>*/}
        <CustomNodeModal
          isOpen={isAddingCustomNode}
          addCustomNode={this.addCustomNode}
          handleClose={this.closeCustomNodeModal}
        />
      </React.Fragment>
    );
  }

  public changeNodeWan = (value: string) => {
    this.props.changeNodeIntent('wan_auto');
  };
  public changeNodeEth = (value: string) => {
    this.props.changeNodeIntent('eth_auto');
  };

  public changeLanguage = (value: string) => {
    const key = getKeyByValue(languages, value);
    if (key) {
      this.props.changeLanguage(key);
    }
  };

  private openCustomNodeModal = () => {
    this.setState({ isAddingCustomNode: true });
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
