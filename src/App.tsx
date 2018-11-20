import * as React from 'react';
// Components
// import GenerateWallet from 'containers/Tabs/GenerateWallet';
// import LandingPage from 'containers/Tabs/LandingPage';
// import ErrorScreen from 'components/ErrorScreen';
// import PageNotFound from 'components/PageNotFound';
// import { pollOfflineStatus, TPollOfflineStatus } from 'actions/config';
// import { AppState } from 'reducers';
// import { RouteNotFound } from 'components/RouteNotFound';
// import 'what-input';
// import { setUnitMeta, TSetUnitMeta } from 'actions/transaction';
// import { getNetworkUnit } from 'selectors/config';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
// import WebTemplate from './containers/TabSection/WebTemplate';
// import AppDialog from './ccComponents/AppDialog';
import './state/state';
// import Wallet from 'ccContainers/Tabs/Wallet';
// import AppSnackBar from './ccComponents/AppSnackBar';
import CryptoCurveCss from './theme/CryptoCurveCss';
import ErrorScreen from './components/ErrorScreen';
import AppDialog from './components/AppDialog';
import AppSnackBar from './components/AppSnackBar';

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
    useNextVariants: true,
    fontFamily: ['Abel', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h5: {
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

interface OwnProps {}

type Props = OwnProps;

interface State {
  error: Error | null;
}

class App extends React.Component<Props, State> {
  public state = {
    error: null
  };

  public componentDidCatch(error: Error) {
    this.setState({ error });
  }

  public render() {
    const { error } = this.state;

    if (error) {
      return <ErrorScreen error={error} />;
    }

    // const routes: JSX.Element = (
          {/*<Route path="/account" exact={true} component={Wallet} />*/}
          {/*<Route path="/generate" component={GenerateWallet} />*/}
          {/*<Route path="/" component={LandingPage} />*/}
          {/*<Redirect exact={true} from="/" to="/account" />*/}
    // );

    return (
      <React.Fragment>
        <CssBaseline />
        <CryptoCurveCss />
        <MuiThemeProvider theme={theme}>
                {/*<WebTemplate routes={routes} />*/}
          <AppDialog />
          <AppSnackBar />
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
