import * as React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import TextField from '@material-ui/core/TextField/TextField';
import { WithWalletContext, withWalletContext } from '../../../context/WalletContext';
import { helperRenderConsoleText } from '../../../helpers/helpers';

import * as CryptoCurveSDK from 'cryptocurve-sdk';

interface OwnProps {
}

const styles = (theme: Theme) =>
  createStyles({
    containerGrid: {
      paddingLeft: theme.spacing.unit * 4,
      paddingRight: theme.spacing.unit * 20,
      display: 'flex',
      flex: 1
    },
    gridItem: {
      marginTop: theme.spacing.unit * 6
    }
  });

interface State {
  amount: number;
  toAddress: string;
}

interface Props extends OwnProps, WithStyles<typeof styles>, WithWalletContext {
}

class SendTransaction extends React.Component<Props, State> {
  public state = {
    amount: 0,
    toAddress: ''
  };

  public render() {
    console.log(...helperRenderConsoleText('Render SendTransaction', 'lightGreen'));
    const { classes, walletContext } = this.props;
    const { amount, toAddress } = this.state;
    const { wallet, currentChain } = walletContext;
    console.log('currentChain + ' + JSON.stringify(currentChain));
    const { address: fromAddress } = wallet;
    console.log('from ' + fromAddress);
    console.log(amount + ' to ' + toAddress);

    const client = new CryptoCurveSDK.Client();
    // TODO here we connect the client
    const clientHost = 'http://localhost:8545'; // [wan/wan.testnet].cryptocurve.network
    const timeout = 0; // or null
    const clientUsername = 'test'; // default value for testnet
    const clientPassword = 'test'; // default value for testnet
    client.setProvider(clientHost, timeout, clientUsername, clientPassword);

    // TODO create a transaction to validate it,
    //    if transaction created without a client then it instantiates one itself?
    // access client.getGasPrice and client.getGasLimit
    //    display values before submission and make some kind of
    //    override functionality available

    // TODO HERE IS WHERE WE USE THE WALLET TO PREPARE AND SIGN THE TRANSACTION
    // TODO validate address
    // TODO check balance
    // TODO action on success - enable send transaction button
    // TODO action on failure - disable send transaction button
    return (
      <Grid container className={classes.containerGrid} direction="column" justify="flex-end">
        <Grid item className={classes.gridItem}>
          <TextField
            label="To Address"
            value={toAddress}
            onChange={this.handleToAddressChange}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <TextField
            label="Amount"
            inputProps={{ type: 'number', min: 0 }}
            value={amount}
            onChange={this.handleAmountChange}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <Button variant="contained" color="primary">
            Send Transaction
          </Button>
        </Grid>
      </Grid>
    );
  }

  private handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    this.setState({ amount: value === '' ? 0 : Number(value) });
  };

  private handleToAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    this.setState({ toAddress: value });
  };
}

// @ts-ignore
export default (withStyles(styles)(withWalletContext(SendTransaction)) as unknown) as React.ComponentClass<OwnProps>;
