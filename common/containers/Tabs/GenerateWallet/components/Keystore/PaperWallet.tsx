import PrintableWallet from 'components/PrintableWallet';
import { IV3Wallet } from 'ethereumjs-wallet';
import React from 'react';
import translate from 'translations';
import { stripHexPrefix } from 'libs/values';
import Button from '@material-ui/core/Button/Button';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Typography from '@material-ui/core/Typography/Typography';
import { green } from '@material-ui/core/colors';
import Fade from '@material-ui/core/Fade/Fade';

const styles = (theme: Theme) =>
  createStyles({
    mainContentGrid: {
      marginTop: theme.spacing.unit * 4
    },
    saveKeyButton: {
      padding: ['8px', '30px'].join(' '),
      backgroundColor: '#272532',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#48474e'
      }
    },
    title: {
      ...theme.typography.title,
      marginTop: theme.spacing.unit * 5
    },
    privateKeyGrid: {
      position: 'relative'
    },
    paperWalletGrid: {
      width: 810
    },
    copiedText: {
      position: 'absolute',
      marginTop: theme.spacing.unit,
      color: green['500'],
      bottom: -15
    }
  });

interface OwnProps {
  keystore: IV3Wallet;
  privateKey: string;
}

interface State {
  copied: boolean;
}

// TODO: Add copy to clipboard functionality
class PaperWallet extends React.Component<OwnProps & WithStyles<typeof styles>, State> {
  public state: State = {
    copied: false
  };

  public render() {
    const { classes, privateKey, keystore } = this.props;
    const { copied } = this.state;
    return (
      <Grid
        className={classes.mainContentGrid}
        container={true}
        direction="column"
        justify="space-evenly"
        alignItems="center"
        spacing={24}
      >
        <Grid container={true} item={true} justify="center" className={classes.privateKeyGrid}>
          <CopyToClipboard text={stripHexPrefix(privateKey)} onCopy={this.handleOnCopy}>
            <Button variant="raised" classes={{ contained: classes.saveKeyButton }}>
              {stripHexPrefix(privateKey)}
            </Button>
          </CopyToClipboard>
          <Fade in={copied}>
            <Typography variant="body1" className={classes.copiedText}>
              Key copied to clipboard
            </Typography>
          </Fade>
        </Grid>
        <Grid container={true} item={true} justify="center" className={classes.paperWalletGrid}>
          <span className={classes.title}>{translate('X_PRINT_2')}</span>
          <PrintableWallet address={keystore.address} privateKey={privateKey} />
        </Grid>
      </Grid>
    );
  }

  private handleOnCopy = () => {
    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 3000);
  };
}

export default withStyles(styles)(PaperWallet) as React.ComponentClass<OwnProps>;
