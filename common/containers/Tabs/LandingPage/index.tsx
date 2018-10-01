import React from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import TabSection from 'containers/TabSection';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import { RouteComponentProps } from 'react-router';
import { isNetworkUnit } from 'selectors/config/wallet';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import BackgroundImage from 'assets/images/background/mycryptocurveMain.jpg';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';
import { NavigationLink, navigationLinksLandingPage } from 'config/navigation';
import classnames from 'classnames';

interface StateProps {
  wallet: AppState['wallet']['inst'];
  requestDisabled: boolean;
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
      zIndex: -1
    },
    layout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    subHeading: {
      marginTop: theme.spacing.unit * 3
    },
    buttonRow: {
      marginTop: theme.spacing.unit * 2
    },
    button: {
      minWidth: 195.3,
      minHeight: 31.7,
      fontSize: 15,
      lineHeight: 1.33,
      letterSpacing: 1.5,
      border: ['solid', '2px', '#fff'].join(' '),
      color: '#fff',
      textTransform: 'uppercase'
    },
    whiteText: {
      color: '#fff'
    }
  });

type Props = StateProps & RouteComponentProps<{}>;

class LandingPage extends React.Component<Props & WithStyles<typeof styles>> {
  public handleClick = (to: string) => {
    const { history } = this.props;
    console.log(to);
    history.push(to);
  };

  public render() {
    const { classes } = this.props;

    return (
      <TabSection>
        <div className={classes.background} />
        <main className={classes.layout}>
          <Typography variant="headline" className={classes.whiteText}>
            {translate('LANDING_TITLE')}
          </Typography>
          <Typography
            variant="subheading"
            className={classnames([classes.subHeading, classes.whiteText])}
          >
            {translate('LANDING_SUBTITLE')}
          </Typography>
          <Grid
            className={classes.buttonRow}
            container={true}
            direction="row"
            justify="center"
            alignItems="center"
            spacing={24}
          >
            {navigationLinksLandingPage.map((link: NavigationLink, index: number) => (
              <React.Fragment key={index}>
                <Grid item={true}>
                  <Button
                    variant="outlined"
                    classes={{ outlined: classes.button }}
                    onClick={() => this.handleClick(link.to)}
                  >
                    {translate(link.name)}
                  </Button>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </main>
      </TabSection>
    );
  }
}

export default withStyles(styles)(
  connect((state: AppState) => ({
    wallet: getWalletInst(state),
    requestDisabled: !isNetworkUnit(state, 'ETH')
  }))(LandingPage)
);
