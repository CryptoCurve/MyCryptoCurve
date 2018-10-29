import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Footer, Header } from 'components';
import { AppState } from 'reducers';
import Notifications from './Notifications';
import OfflineTab from './OfflineTab';
import { getOffline, getLatestBlock } from 'selectors/config';
import { Query } from 'components/renderCbs';
import './WebTemplate.scss';
import { RouteComponentProps, withRouter } from 'react-router';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import BackgroundImage from 'assets/images/background/mycryptocurveMain.jpg';
import createStyles from '@material-ui/core/styles/createStyles';
import Fade from '@material-ui/core/Fade/Fade';
import { Theme } from '@material-ui/core';

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

interface StateProps {
  isOffline: AppState['config']['meta']['offline'];
  latestBlock: AppState['config']['meta']['latestBlock'];
}

interface OwnProps {
  isUnavailableOffline?: boolean;
  // children: string | React.ReactElement<string> | React.ReactElement<string>[];
  routes: React.ReactNode;
}

type Props = OwnProps & StateProps & RouteComponentProps<{}>;

class WebTemplate extends Component<Props & WithStyles<typeof styles>, {}> {
  public render() {
    const { routes, classes, isUnavailableOffline, isOffline, latestBlock, location } = this.props;
    return (
      <React.Fragment>
        <Fade in={location.pathname === '/'}>
          <div className={classes.background} />
        </Fade>
        <Query
          params={['network']}
          withQuery={({ network }) => (
            <Header networkParam={network && `${network.toLowerCase()}_auto`} />
          )}
        />
        {routes}
        {isUnavailableOffline && isOffline ? <OfflineTab /> : null}
        {location.pathname !== '/' && <Footer latestBlock={latestBlock} />}
        <Notifications />
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

export default withStyles(styles)(withRouter(connect(mapStateToProps, {})(WebTemplate)));
