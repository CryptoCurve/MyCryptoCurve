import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { withRouter, Switch, Route, BrowserRouter } from 'react-router-dom';
// Components
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import LandingPage from 'containers/Tabs/LandingPage';
import ErrorScreen from 'components/ErrorScreen';
import PageNotFound from 'components/PageNotFound';
import { Store } from 'redux';
import { pollOfflineStatus, TPollOfflineStatus } from 'actions/config';
import { AppState } from 'reducers';
import { RouteNotFound } from 'components/RouteNotFound';
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
  public state = {
    error: null
  };

  public componentDidMount() {
    this.props.pollOfflineStatus();
    this.props.setUnitMeta(this.props.networkUnit);
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

    const routes: JSX.Element = (
      <CaptureRouteNotFound>
        <Switch>
          <Route path="/account" exact={true} component={Wallet} />
          <Route path="/generate" component={GenerateWallet} />
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
            <React.Fragment>
              <BrowserRouter>
                <WebTemplate routes={routes} />
              </BrowserRouter>
            </React.Fragment>
          </Provider>
          <div id="ModalContainer" />
          <AppDialog />
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    networkUnit: getNetworkUnit(state)
  };
};

export default connect(mapStateToProps, {
  pollOfflineStatus,
  setUnitMeta
})(RootClass);
