import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Footer, Header } from 'components';
import { AppState } from 'reducers';
import Notifications from './Notifications';
import OfflineTab from './OfflineTab';
import { getOffline, getLatestBlock } from 'selectors/config';
import { Query } from 'components/renderCbs';
import './WebTemplate.scss';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8964DC'
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
      fontSize: 26,
      marginBottom: 3,
      letterSpacing: 4.6
    },
    button: {
      fontSize: '1rem',
      letterSpacing: '1px'
    }
  }
});

interface StateProps {
  isOffline: AppState['config']['meta']['offline'];
  latestBlock: AppState['config']['meta']['latestBlock'];
}

interface OwnProps {
  isUnavailableOffline?: boolean;
  children: string | React.ReactElement<string> | React.ReactElement<string>[];
}

type Props = OwnProps & StateProps;

class WebTemplate extends Component<Props, {}> {
  public render() {
    const { isUnavailableOffline, children, isOffline, latestBlock } = this.props;

    return (
      <React.Fragment>
        <div className="WebTemplate">
          <CssBaseline />
          <MuiThemeProvider theme={theme}>
            <Query
              params={['network']}
              withQuery={({ network }) => (
                <Header networkParam={network && `${network.toLowerCase()}_auto`} />
              )}
            />
            {/*<div className="Tab container">*/}
            {/*{isUnavailableOffline && isOffline ? <OfflineTab /> : children}*/}
            {/*</div>*/}
            {/*<div className="WebTemplate-spacer" />*/}
            {/*<Footer latestBlock={latestBlock} /> <Notifications />*/}
          </MuiThemeProvider>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    isOffline: getOffline(state),
    latestBlock: getLatestBlock(state)
  };
}

export default connect(mapStateToProps, {})(WebTemplate);
