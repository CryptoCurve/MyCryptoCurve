import { QRCode } from 'components/ui';
import React from 'react';

import Paper from '@material-ui/core/Paper/Paper';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import translate from '../../translations';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing.unit * 5,
      marginLeft: theme.spacing.unit * 2.5,
      marginRight: theme.spacing.unit * 2.5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit *
        3}px`,
      borderRadius: 8,
      border: ['1px', 'solid', theme.palette.text.primary].join(' ')
    },
    qrItem: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      '& img': {
        width: 180
      }
    },
    qrLabel: {
      marginBottom: theme.spacing.unit * 4
    },
    detailsGrid: {
      marginTop: theme.spacing.unit * 5
    },
    detailsLabel: {
      marginBottom: theme.spacing.unit
    },
    smallerText: {
      fontSize: 18
    }
  });

interface OwnProps {
  address: string;
  privateKey: string;
}

const PaperWallet = (props: OwnProps & WithStyles<typeof styles>) => {
  const { privateKey, address, classes } = props;
  return (
    <Paper className={classes.paper}>
      <Grid container={true} direction="column">
        <Grid container={true} direction="row" justify="space-evenly">
          <Grid item={true} className={classes.qrItem} xs={6}>
            <Typography className={classes.qrLabel} variant="caption">
              {translate('X_PRINT_YOURADDRESS')}
            </Typography>
            <QRCode data={address} />
          </Grid>
          <Grid item={true} className={classes.qrItem} xs={6}>
            <Typography className={classes.qrLabel} variant="caption">
              {translate('X_PRINT_YOURPRIVATEKEY')}
            </Typography>
            <QRCode data={privateKey} />
          </Grid>
        </Grid>
        <Grid container={true} direction="column" className={classes.detailsGrid} spacing={16}>
          <Grid item={true}>
            <Typography className={classes.detailsLabel} variant="caption">
              {translate('X_PRINT_YOURADDRESS')}
            </Typography>
            <Typography variant="caption" className={classes.smallerText}>
              {address}
            </Typography>
          </Grid>
          <Grid item={true}>
            <Typography className={classes.detailsLabel} variant="caption">
              {translate('X_PRINT_YOURPRIVATEKEY')}
            </Typography>
            <Typography variant="caption" className={classes.smallerText}>
              {privateKey}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(PaperWallet) as React.ComponentClass<OwnProps>;
