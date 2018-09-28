import React from 'react';
import translate, { translateRaw } from 'translations';
import { WalletType } from '../GenerateWallet';
import { RouteComponentProps } from 'react-router-dom';
import './WalletTypes.scss';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import ArrowBack from '@material-ui/icons/ArrowBack';

const styles = (theme: Theme) =>
  createStyles({
    layout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexGrow: 1
    },
    backButton: {
      position: 'absolute',
      left: theme.spacing.unit * 15
    },
    buttonRow: {
      marginTop: theme.spacing.unit * 20
    }
  });

interface StyleProps {
  classes: {
    layout: string;
    backButton: string;
    buttonRow: string;
  };
}

type Props = StyleProps & RouteComponentProps<{}>;

const WalletTypes: React.SFC<Props> = props => {
  const { classes, history, location } = props;
  console.log(props);
  const typeInfo = {
    [WalletType.Keystore]: {
      name: 'X_KEYSTORE2',
      bullets: [
        'An encrypted JSON file, protected by a password',
        'Back it up on a USB drive',
        'Cannot be written, printed, or easily transferred to mobile',
        'Compatible with Mist, Parity, Geth',
        'Provides a single address for sending and receiving'
      ]
    },
    [WalletType.Mnemonic]: {
      name: 'X_MNEMONIC',
      bullets: [
        'A 12-word private seed phrase',
        'Back it up on paper or USB drive',
        'Can be written, printed, and easily typed on mobile, too',
        'Compatible with MetaMask, Jaxx, imToken, and more',
        'Provides unlimited addresses for sending and receiving'
      ]
    }
  };

  return (
    <main className={classes.layout}>
      <Grid
        container={true}
        direction="row"
        justify="space-evenly"
        alignItems="center"
        spacing={16}
      >
        <Grid container={true} item={true} xs={12} sm={1} md={1} lg={1} xl={1} justify="center">
          <Button variant="fab" color="primary" aria-label="Back" onClick={() => history.push('/')}>
            <ArrowBack />
          </Button>
        </Grid>
        <Grid item={true} xs={12} sm={10} md={10} lg={10} xl={10}>
          <Typography variant="title" align="center">
            {translate('PRIVATE_KEY_TITLE')}
          </Typography>
        </Grid>
        <Grid item={true} xs={false} sm={1} md={1} lg={1} xl={1} />
      </Grid>
      <Grid
        className={classes.buttonRow}
        container={true}
        direction="row"
        justify="space-evenly"
        alignItems="center"
        spacing={16}
      >
        {Object.keys(typeInfo).map((type: keyof typeof typeInfo) => (
          <React.Fragment key={type}>
            <Grid item={true}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push(`${location.pathname}/${type}`)}
              >
                {translate('GENERATE_THING', { $thing: translateRaw(typeInfo[type].name) })}
              </Button>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </main>
  );
};

export default withStyles(styles)(WalletTypes);
