import * as React from 'react';
// import { getWalletInst } from 'selectors/wallet';
// import { AppState } from 'reducers';
// import { RouteComponentProps } from 'react-router';
// import { isNetworkUnit } from 'selectors/config/wallet';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';
import classnames from 'classnames';
import Slide from '@material-ui/core/Slide/Slide';
import { Colors } from '../../theme/theme';
import NewTabLink from '../../components/NewTabLink';
// import { Colors } from '../../../Root';
// import { NewTabLink } from '../../../components/ui';

interface OwnProps {}

const styles = (theme: Theme) =>
  createStyles({
    layout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'center',
      marginTop: theme.spacing.unit * 15,
      [theme.breakpoints.only('xs')]: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
      }
    },
    subText: {
      marginTop: theme.spacing.unit * 3,
      fontSize: 17
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
      color: Colors.white,
      textAlign: 'center'
    },
    newTabLink: {
      color: Colors.white,
      '&:hover': {
        color: Colors.white
      }
    }
  });

type Props = OwnProps & WithStyles<typeof styles>;

class LandingPage extends React.Component<Props> {

  public render() {
    const { classes } = this.props;

    return (
      <Slide in={true} direction="left">
        <main className={classes.layout}>
          <Typography variant="h1" className={classes.whiteText}>
            Wanchain powered wallet
          </Typography>
          <Typography
            variant="body1"
            className={classnames([classes.subText, classes.whiteText])}
          >
            Send and receive ETH, WAN and all compatible tokens
          </Typography>
          <Grid
            className={classes.buttonRow}
            container={true}
            direction="row"
            justify="center"
            alignItems="center"
            spacing={24}
          >
            <React.Fragment>
              <Grid item={true}>
                <Button
                  variant="outlined"
                  classes={{ outlined: classes.button }}
                  // onClick={() => this.handleClick('/account')}
                >
                  Open Wallet
                </Button>
              </Grid>
              <Grid item={true}>
                <Button variant="outlined" classes={{ outlined: classes.button }}>
                  <NewTabLink href="https://cryptocurve.io/#faq" className={classes.newTabLink}>
                    Learn More
                  </NewTabLink>
                </Button>
              </Grid>
            </React.Fragment>
          </Grid>
        </main>
      </Slide>
    );
  }
}

export default withStyles(styles)(LandingPage) as React.ComponentClass<OwnProps>;