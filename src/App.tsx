import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import CryptoCurveCss from './theme/CryptoCurveCss';
import ErrorScreen from './components/ErrorScreen';
import AppSnackBar from './components/AppSnackBar';
import AppDialog from './components/AppDialog';
import LandingPage from './containers/LandingPage/LandingPage';
import Fade from '@material-ui/core/Fade/Fade';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import BackgroundImage from './assets/images/mycryptocurveMain.jpg';
import { cryptoCurveMainTheme } from './theme/theme';
import Header from './components/Header';
import { WithRouteContext, withRouteContext } from './context/RouteContext';
import { helperRenderConsoleText } from './helpers/helpers';
import Wallet from './containers/Wallet/Wallet';
import Context from './context/Context';

interface OwnProps {
}

const styles = (theme: Theme) =>
  createStyles({
    background: {
      backgroundImage: `url(${BackgroundImage})`,
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#35286E',
      top: 0,
      position: 'absolute',
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      [theme.breakpoints.only('xl')]: {
        backgroundSize: 'cover'
      }
    }
  });

type Props = OwnProps & WithStyles<typeof styles>;

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
    console.log(...helperRenderConsoleText('Render App', 'lightGreen'));
    const { error } = this.state;
    if (error) {
      return <ErrorScreen error={error}/>;
    }

    return (
      <React.Fragment>
        <CssBaseline/>
        <CryptoCurveCss/>
        <MuiThemeProvider theme={cryptoCurveMainTheme}>
          <Context>
            {/*<WebTemplate routes={routes} />*/}
            <MainRouting/>
            <AppDialog/>
            <AppSnackBar/>
          </Context>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

const MainRouting = withStyles(styles)(withRouteContext((props: WithRouteContext & WithStyles<typeof styles>) => {
  console.log(props);
  const { routeContext, classes } = props;
  const { location } = routeContext;
  return (
    <React.Fragment>
      <Fade in={location === ''}>
        <div className={classes.background}/>
      </Fade>
      <Header/>
      {location === 'wallet' ? <Wallet/> :
        <LandingPage/>}
    </React.Fragment>
  );
}));
export default App as React.ComponentClass<{}>;
