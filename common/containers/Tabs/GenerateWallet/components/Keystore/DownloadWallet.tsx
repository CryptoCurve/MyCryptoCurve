import { IV3Wallet } from 'ethereumjs-wallet';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import { makeBlob } from 'utils/blob';
import Grid from '@material-ui/core/Grid/Grid';
import { Theme, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button/Button';

const styles = (theme: Theme) =>
  createStyles({
    mainContentGrid: {
      marginTop: theme.spacing.unit * 5
    }
  });

interface OwnProps {
  keystore: IV3Wallet;
  filename: string;
  continue(): void;
}

interface State {
  hasDownloadedWallet: boolean;
}

class DownloadWallet extends Component<OwnProps & WithStyles<typeof styles>, State> {
  public state: State = {
    hasDownloadedWallet: false
  };

  public componentDidMount() {
    // this.props.continue();
  }

  public render() {
    const { filename, classes } = this.props;
    const { hasDownloadedWallet } = this.state;
    console.log(filename);
    return (
      <Grid
        className={classes.mainContentGrid}
        container={true}
        direction="column"
        justify="space-evenly"
        alignItems="center"
        spacing={24}
      >
        <Grid item={true}>
          <Button
            variant="outlined"
            aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
            aria-describedby={translateRaw('X_KEYSTOREDESC')}
            href={this.getBlob()}
            onClick={this.handleDownloadKeystore}
            download={filename}
            color="primary"
          >
            {translate('ACTION_13', { $thing: translateRaw('X_KEYSTORE2') })}
          </Button>
        </Grid>
        <Grid item={true}>
          <Button
            variant="raised"
            onClick={this.handleContinue}
            disabled={!hasDownloadedWallet}
            color="primary"
          >
            {translate('ACTION_14')}
          </Button>
        </Grid>
        {/*<div className="DlWallet">*/}
        {/*<div className="DlWallet-warning">*/}
        {/*<p>{translate('DL_WALLET_WARNING_1')}</p>*/}
        {/*<p>{translate('DL_WALLET_WARNING_2')}</p>*/}
        {/*<p>{translate('DL_WALLET_WARNING_3')}</p>*/}
        {/*</div>*/}
        {/*</div>*/}
      </Grid>
    );
  }

  public getBlob = () => makeBlob('text/json;charset=UTF-8', this.props.keystore);

  private handleContinue = () => this.state.hasDownloadedWallet && this.props.continue();

  private handleDownloadKeystore = () => this.setState({ hasDownloadedWallet: true });
}

export default withStyles(styles)(DownloadWallet) as React.ComponentClass<OwnProps>;
