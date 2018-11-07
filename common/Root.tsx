import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { withRouter, Switch, HashRouter, Route, BrowserRouter } from 'react-router-dom';
// Components
import Contracts from 'containers/Tabs/Contracts';
import ENS from 'containers/Tabs/ENS';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
// import SendTransaction from 'containers/Tabs/SendTransaction';
import Swap from 'containers/Tabs/Swap';
import SignAndVerifyMessage from 'containers/Tabs/SignAndVerifyMessage';
import BroadcastTx from 'containers/Tabs/BroadcastTx';
import CheckTransaction from 'containers/Tabs/CheckTransaction';
import LandingPage from 'containers/Tabs/LandingPage';
import Whitelist from 'containers/Tabs/Whitelist';
import SupportPage from 'containers/Tabs/SupportPage';
import ErrorScreen from 'components/ErrorScreen';
import PageNotFound from 'components/PageNotFound';
import LogOutPrompt from 'components/LogOutPrompt';
import QrSignerModal from 'containers/QrSignerModal';
import NewAppReleaseModal from 'components/NewAppReleaseModal';
import { TitleBar } from 'components/ui';
import { Store } from 'redux';
import { pollOfflineStatus, TPollOfflineStatus } from 'actions/config';
import { AppState } from 'reducers';
import { RouteNotFound } from 'components/RouteNotFound';
import { RedirectWithQuery } from 'components/RedirectWithQuery';
import 'what-input';
import { setUnitMeta, TSetUnitMeta } from 'actions/transaction';
import { getNetworkUnit } from 'selectors/config';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import WebTemplate from './containers/TabSection/WebTemplate';
import AppDialog from './ccComponents/AppDialog';
import './state';
import Wallet from 'ccContainers/Tabs/Wallet';

export enum Colors {
  white = '#fff',
  purpley = '#8964DC',
  lavender = '#beaceb',
  lightLavender = '#e4d9ff',
  dark = '#272532',
  darkHover = '#52505b'
}
const theme = createMuiTheme({
  palette: {
    primary: {
      main: Colors.purpley
    },
    secondary: {
      main: '#40409A'
    },
    text: {
      // secondary: '#fff',
      primary: Colors.dark
    }
  },
  typography: {
    fontFamily: ['Abel', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    headline: {
      fontFamily: [
        'bebasneue_bold',
        'Abel',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
      textTransform: 'uppercase',
      fontSize: 40,
      letterSpacing: 5.3
    },
    title: {
      fontFamily: [
        'bebasneue_regular',
        'Abel',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
      textTransform: 'uppercase',
      fontSize: 35,
      letterSpacing: 7,
      lineHeight: '38px'
    },
    subheading: {
      fontFamily: ['Abel', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
      textTransform: 'uppercase',
      fontSize: 18
    },

    caption: {
      fontSize: 20,
      fontWeight: 100,
      letterSpacing: 2,
      lineHeight: 1.3
    },
    display1: {
      fontSize: 25,
      fontFamily: [
        'bebasneue_regular',
        'Abel',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(',')
    },
    button: {
      letterSpacing: '1px'
    }
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 50,
        minHeight: 60,
        textTransform: 'none',
        fontSize: 22,
        minWidth: 300
      },
      outlined: {
        borderWidth: ['2px', '!important'].join(' ')
      }
    },
    MuiInput: {
      input: {
        fontSize: 20,
        lineHeight: 1.3,
        letterSpacing: 2,
        padding: ['8px', 0, '7px'].join(' '),
        marginTop: 4
      }
    },
    MuiFormLabel: {
      root: {
        fontSize: 20,
        lineHeight: '26px',
        letterSpacing: 2
      }
    },
    MuiList: {
      root: {
        border: ['solid', '1px', Colors.lavender].join(' '),
        borderRadius: 8
      }
    },
    MuiPaper: {
      rounded: {
        borderRadius: 8
      }
    },
    MuiListItem: {
      selected: {
        backgroundColor: [Colors.lavender, '!important'].join(' '),
        color: [Colors.white, '!important'].join(' ')
      },
      button: {
        '&:hover': {
          backgroundColor: Colors.lightLavender
        }
      }
    }
  }
});

interface OwnProps {
  store: Store<AppState>;
}

interface StateProps {
  networkUnit: string;
}

interface DispatchProps {
  pollOfflineStatus: TPollOfflineStatus;
  setUnitMeta: TSetUnitMeta;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  error: Error | null;
}

class RootClass extends Component<Props, State> {
  private static addBodyClasses() {
    const classes = [];

    if (process.env.BUILD_ELECTRON) {
      classes.push('is-electron');

      if (navigator.appVersion.includes('Win')) {
        classes.push('is-windows');
      } else if (navigator.appVersion.includes('Mac')) {
        classes.push('is-osx');
      } else {
        classes.push('is-linux');
      }
    }

    document.body.className += ` ${classes.join(' ')}`;
  }

  public state = {
    error: null
  };

  public componentDidMount() {
    this.props.pollOfflineStatus();
    this.props.setUnitMeta(this.props.networkUnit);
    RootClass.addBodyClasses();
  }

  public componentDidCatch(error: Error) {
    this.setState({ error });
  }

  public render() {
    const { store } = this.props;
    const { error } = this.state;

    if (error) {
      return <ErrorScreen error={error} />;
    }

    const CaptureRouteNotFound = withRouter(({ children, location }) => {
      return location && location.state && location.state.error ? (
        <PageNotFound />
      ) : (
        (children as JSX.Element)
      );
    });

    const Router =
      process.env.BUILD_DOWNLOADABLE && process.env.NODE_ENV === 'production'
        ? HashRouter
        : BrowserRouter;

    const routes: React.ReactNode = (
      <CaptureRouteNotFound>
        <Switch>
          <Route path="/account" exact={true} component={Wallet} />
          {/*<Route path="/account" exact={true} component={SendTransaction} />*/}
          {/*<Route path="/account/:action?" component={SendTransaction} />*/}
          <Route path="/generate" component={GenerateWallet} />
          <Route path="/swap" component={Swap} />
          <Route path="/contracts" component={Contracts} />
          <Route path="/ens" component={ENS} exact={true} />
          <Route path="/sign-and-verify-message" component={SignAndVerifyMessage} />
          <Route path="/tx-status" component={CheckTransaction} exact={true} />
          <Route path="/pushTx" component={BroadcastTx} />
          <Route path="/support-us" component={SupportPage} exact={true} />
          <Route path="/whitelist" component={Whitelist} />
          <Route path="/" component={LandingPage} />
          {/*<Redirect exact={true} from="/" to="/account" />*/}
          <RouteNotFound />
        </Switch>
      </CaptureRouteNotFound>
    );

    // Creating new base to handle the new design
    // @ts-ignore
    return (
      <React.Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <Provider store={store} key={Math.random()}>
            {process.env.BUILD_ELECTRON ? (
              <Router>
                <React.Fragment>
                  {process.env.BUILD_ELECTRON && <TitleBar />}
                  {routes}
                  <LegacyRoutes />
                  <LogOutPrompt />
                  <QrSignerModal />
                  {process.env.BUILD_ELECTRON && <NewAppReleaseModal />}
                </React.Fragment>
              </Router>
            ) : (
              <React.Fragment>
                <BrowserRouter>
                  <WebTemplate routes={routes} />
                </BrowserRouter>
                {/*<Router key={Math.random()}>*/}
                {/*<React.Fragment>*/}
                {/*{routes}*/}
                {/*<LegacyRoutes />*/}
                {/*<LogOutPrompt />*/}
                {/*<QrSignerModal />*/}
                {/*</React.Fragment>*/}
                {/*</Router>*/}
              </React.Fragment>
            )}
          </Provider>
          <div id="ModalContainer" />
          <AppDialog />
        </MuiThemeProvider>
      </React.Fragment>
    );
    // return (
    //   <React.Fragment>
    //     <CssBaseline />
    //     <MuiThemeProvider theme={theme}>
    //       <Provider store={store} key={Math.random()}>
    //         <Router key={Math.random()}>
    //           <React.Fragment>
    //             {process.env.BUILD_ELECTRON && <TitleBar />}
    //             {routes}
    //             <LegacyRoutes />
    //             <LogOutPrompt />
    //             <QrSignerModal />
    //             {process.env.BUILD_ELECTRON && <NewAppReleaseModal />}
    //           </React.Fragment>
    //         </Router>
    //       </Provider>
    //       <div id="ModalContainer" />
    //     </MuiThemeProvider>
    //   </React.Fragment>
    // );
  }
}

const LegacyRoutes = withRouter(props => {
  const { history } = props;
  const { pathname } = props.location;
  let { hash } = props.location;

  if (pathname === '/') {
    hash = hash.split('?')[0];
    switch (hash) {
      case '#send-transaction':
      case '#offline-transaction':
        return <RedirectWithQuery from={pathname} to={'account/send'} />;
      case '#generate-wallet':
        history.push('/');
        break;
      case '#swap':
        history.push('/swap');
        break;
      case '#contracts':
        history.push('/contracts');
        break;
      case '#ens':
        history.push('/ens');
        break;
      case '#view-wallet-info':
        history.push('/account/info');
        break;
      case '#check-tx-status':
        return <RedirectWithQuery from={pathname} to={'/tx-status'} />;
    }
  }

  return (
    <Switch>
      <RedirectWithQuery from="/signmsg.html" to="/sign-and-verify-message" />
      <RedirectWithQuery from="/helpers.html" to="/helpers" />
      <RedirectWithQuery from="/send-transaction" to={'/account/send'} />
    </Switch>
  );
});

const mapStateToProps = (state: AppState) => {
  return {
    networkUnit: getNetworkUnit(state)
  };
};

export default connect(mapStateToProps, {
  pollOfflineStatus,
  setUnitMeta
})(RootClass);
