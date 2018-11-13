import { PaperWallet } from 'components';
import * as React from 'react';
import { stripHexPrefix } from 'libs/values';
import Grid from '@material-ui/core/Grid/Grid';
import ReactToPrint from 'react-to-print';
import Button from '@material-ui/core/Button/Button';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';

const styles = (theme: Theme) =>
  createStyles({
    buttonRow: {
      marginTop: theme.spacing.unit * 5
    }
  });

interface OwnProps {
  address: string;
  privateKey: string;
}

const PrintableWallet: React.SFC<OwnProps & WithStyles<typeof styles>> = props => {
  const { address, privateKey, classes } = props;
  let PaperWalletRef: any;
  const pkey = stripHexPrefix(privateKey);

  return (
    <Grid container={true} direction="column">
      <PaperWallet
        address={address}
        privateKey={pkey}
        ref={el => {
          PaperWalletRef = el;
        }}
      />
      <Grid container={true} direction="row" justify="space-between" className={classes.buttonRow}>
        <Grid item={true}>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary">
                Print Paper Wallet
              </Button>
            )}
            content={() => PaperWalletRef}
          />
        </Grid>
        <Grid item={true}>
          <Button
            component={(linkProps: any) => <Link to="/account" {...linkProps} />}
            variant="contained"
            color="primary"
          >
            Open your wallet
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(PrintableWallet) as React.ComponentClass<OwnProps>;
