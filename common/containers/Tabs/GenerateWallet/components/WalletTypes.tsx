import React from 'react';
import translate, { translateRaw } from 'translations';
import { WalletType } from '../GenerateWallet';
import { RouteComponentProps } from 'react-router-dom';
import './WalletTypes.scss';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import Template from './Template';

const styles = (theme: Theme) =>
  createStyles({
    layout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexGrow: 1
    },
    buttonGridItem: {
      minHeight: 80,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonRow: {
      marginTop: theme.spacing.unit * 20
    }
  });

type Props = RouteComponentProps<{}>;

const WalletTypes: React.SFC<Props & WithStyles<typeof styles>> = props => {
  const { classes, history, location } = props;
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
    <Template version={2} title="PRIVATE_KEY_TITLE">
      <Grid
        className={classes.buttonRow}
        container={true}
        item={true}
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
    </Template>
  );
};

export default withStyles(styles)(WalletTypes);
